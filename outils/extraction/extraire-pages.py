#!/usr/bin/env python
"""Extrait des pages du site d'origine (WordPress / Beaver Builder) vers src/content/pages/*.json.

Usage : PYTHONIOENCODING=utf8 python outils/extraction/extraire-pages.py <slug> [<slug> ...]
Les pages brutes sont mises en cache dans le dossier indiqué par $YT_CACHE (défaut : ./.cache-extraction).
Les images sont téléchargées, converties en .webp (plus une version .800.webp au-dessus de 1000 px)
dans public/img/site/, et enregistrées dans images.json, imageDims.json et imageVariants.json.
Rien n'est inventé : textes repris tels quels, seul le balisage est converti.
"""
import html, io, json, os, re, sys, unicodedata, urllib.parse, urllib.request
from html.parser import HTMLParser
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
CACHE = Path(os.environ.get('YT_CACHE', ROOT / '.cache-extraction'))
CONTENT = ROOT / 'src' / 'content'
IMG_DIR = ROOT / 'public' / 'img' / 'site'
ORIGIN = 'https://www.yourteco.com'
UA = {'User-Agent': 'Mozilla/5.0'}
VOID = {'img', 'br', 'hr', 'meta', 'link', 'input', 'source', 'wbr'}


def wr(path, text):
    with open(path, 'w', encoding='utf8', newline='\n') as f:
        f.write(text)


# ---------- petit arbre HTML ----------
class Node:
    def __init__(self, tag, attrs, parent):
        self.tag, self.attrs, self.parent, self.kids = tag, dict(attrs), parent, []

    @property
    def cls(self):
        return self.attrs.get('class', '') or ''


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('root', [], None)
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur)
        self.cur.kids.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.kids.append(Node(tag, attrs, self.cur))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not None and n.tag != tag:
            n = n.parent
        if n is not None and n.parent is not None:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.kids.append(data)


def parse(text):
    b = Builder()
    b.feed(text)
    return b.root


def find(n, pred):
    if isinstance(n, str):
        return
    if pred(n):
        yield n
    for k in n.kids:
        yield from find(k, pred)


def plain(n):
    if isinstance(n, str):
        return n
    if n.tag in ('script', 'style'):
        return ''
    return ''.join(plain(k) for k in n.kids)


# ---------- liens et images ----------
def norm_href(h):
    if not h:
        return None
    h = html.unescape(h.strip())
    m = re.match(r'https?://(www\.)?yourteco\.com(/[^?]*)?(\?.*)?$', h)
    if m and not (m.group(2) or '/').startswith('/wp-content'):
        return m.group(2) or '/'
    if h.startswith(('javascript:', '#')):
        return None
    if re.match(r'/(images|wp-content)/', h):
        return ORIGIN + h
    return h


def clean_ws(s):
    return re.sub(r'[ \t\r\n\xa0]+', ' ', s)


def segs_of(nodes):
    """Liste de nœuds en ligne -> segments {t, b?, href?}. Les images rencontrées sont renvoyées à part."""
    out, imgs = [], []

    def add(t, b, href):
        if not t:
            return
        if out and out[-1].get('b', False) == b and out[-1].get('href') == href:
            out[-1]['t'] += t
        else:
            s = {'t': t}
            if b:
                s['b'] = True
            if href:
                s['href'] = href
            out.append(s)

    def walk(n, b, href):
        if isinstance(n, str):
            add(clean_ws(n), b, href)
            return
        if n.tag in ('script', 'style', 'noscript', 'form'):
            return
        if n.tag == 'br':
            add('\n', b, href)
            return
        if n.tag == 'img':
            imgs.append((n, href))
            return
        nb = b or n.tag in ('strong', 'b')
        nh = href
        if n.tag == 'a':
            nh = norm_href(n.attrs.get('href')) or href
        for k in n.kids:
            walk(k, nb, nh)

    for n in nodes:
        walk(n, False, None)
    # nettoyage des bords et des espaces autour des retours à la ligne
    for s in out:
        s['t'] = re.sub(r' *\n *', '\n', s['t'])
    while out and not out[0]['t'].strip():
        out.pop(0)
    while out and not out[-1]['t'].strip():
        out.pop()
    if out:
        out[0]['t'] = out[0]['t'].lstrip()
        out[-1]['t'] = out[-1]['t'].rstrip()
    # fusionne les segments voisins devenus identiques
    merged = []
    for s in out:
        if merged and merged[-1].get('b', False) == s.get('b', False) and merged[-1].get('href') == s.get('href'):
            merged[-1]['t'] += s['t']
        else:
            merged.append(s)
    return merged, imgs


def full_src(img, link):
    src = html.unescape(img.attrs.get('src') or img.attrs.get('data-src') or '')
    if link and re.search(r'/wp-content/uploads/.*\.(jpe?g|png|webp|gif)$', link, re.I):
        return link if link.startswith('http') else ORIGIN + link
    return re.sub(r'-\d+x\d+(?=\.\w+$)', '', src)


# ---------- conversion vers blocs ----------
SKIP_CLS = ('call-to-action', 'modal-popup', 'uabb-modal', 'frm_forms', 'cmplz', 'fl-post-header')


class Conv:
    def __init__(self, img_ref):
        self.blocks = []
        self.img_ref = img_ref  # origine -> chemin local (.webp)
        self.buf = []  # nœuds en ligne en attente
        self.pending_link = None

    def flush(self):
        if not self.buf:
            return
        nodes, self.buf = self.buf, []
        self.emit_inline(nodes)

    def emit_inline(self, nodes):
        segs, imgs = segs_of(nodes)
        for im, href in imgs:
            pass
        if segs:
            self.blocks.append({'type': 'text', 'segs': segs})
        for im, href in imgs:
            self.add_image(im, href)

    def add_image(self, im, link=None):
        src = full_src(im, link)
        if not src:
            return
        alt = clean_ws(html.unescape(im.attrs.get('alt') or '')).strip()
        b = {'type': 'image', 'src': self.img_ref(src), 'alt': alt}
        if self.pending_link:
            b['href'] = self.pending_link
            self.pending_link = None
        elif link and not re.search(r'/wp-content/', link):
            b['href'] = norm_href(link)
        self.blocks.append(b)

    def para(self, n):
        """<p> : texte, avec les images rencontrées émises à leur place."""
        cur = []
        def flush_cur():
            nonlocal cur
            if cur:
                segs, _ = segs_of(cur)
                if segs:
                    self.blocks.append({'type': 'text', 'segs': segs})
            cur = []
        def visit(k, link=None):
            nonlocal cur
            if isinstance(k, str):
                cur.append(k)
            elif k.tag == 'img':
                flush_cur(); self.add_image(k, link)
            elif k.tag == 'dd' and 'gallery-caption' in k.cls:
                flush_cur(); self.caption(k)
            elif k.tag in ('p', 'figcaption') and ('wp-caption-text' in k.cls or k.tag == 'figcaption'):
                flush_cur(); self.caption(k)
            elif k.tag == 'a' and any(isinstance(c, Node) and c.tag == 'img' for c in k.kids):
                flush_cur()
                lk = html.unescape(k.attrs.get('href') or '')
                for c in k.kids:
                    if isinstance(c, Node) and c.tag == 'img':
                        self.add_image(c, lk)
                    elif isinstance(c, str):
                        cur.append(c)
            elif isinstance(k, Node) and any(True for _ in find(k, lambda x: x.tag == 'img' or (x.tag == 'p' and 'wp-caption-text' in x.cls) or x.tag == 'figcaption')):
                for c in k.kids:
                    visit(c, link)
            elif k.tag == 'p':
                flush_cur(); self.para(k)
            else:
                cur.append(k)
        for k in n.kids:
            visit(k)
        flush_cur()

    def caption(self, n):
        t = clean_ws(plain(n)).strip()
        for b in reversed(self.blocks):
            if b['type'] == 'image':
                if t and 'caption' not in b:
                    b['caption'] = t
                return

    def walk(self, n):
        if isinstance(n, str):
            if n.strip():
                self.buf.append(n)
            return
        tag, cls = n.tag, n.cls
        if tag == 'header' and any(True for _ in find(n, lambda x: re.fullmatch(r'h[1-6]', x.tag))):
            for k in n.kids:
                self.walk(k)
            return
        if tag in ('script', 'style', 'noscript', 'form', 'meta', 'link', 'header', 'svg', 'button', 'input', 'label') or any(c in cls.replace('fl-post-header', '') for c in SKIP_CLS if c != 'fl-post-header'):
            return
        if re.fullmatch(r'h[1-6]', tag):
            self.flush()
            t = clean_ws(plain(n)).strip()
            if t:
                self.blocks.append({'type': 'heading', 'level': int(tag[1]), 'text': t})
            return
        if tag == 'p':
            self.flush()
            if 'wp-caption-text' in cls:
                self.caption(n)
            else:
                self.para(n)
            return
        if tag == 'figcaption':
            self.flush(); self.caption(n); return
        if tag in ('ul', 'ol'):
            self.flush()
            items = []
            for li in find(n, lambda x: x.tag == 'li'):
                segs, _ = segs_of([k for k in li.kids if not (isinstance(k, Node) and k.tag in ('ul', 'ol'))])
                if segs:
                    items.append(segs)
            if items:
                self.blocks.append({'type': 'list', 'ordered': tag == 'ol', 'items': items})
            return
        if tag == 'table':
            self.flush()
            rows = []
            for tr in find(n, lambda x: x.tag == 'tr'):
                rows.append([segs_of(td.kids)[0] for td in tr.kids if isinstance(td, Node) and td.tag in ('td', 'th')])
            if rows:
                self.blocks.append({'type': 'table', 'head': False, 'rows': rows})
            return
        if tag == 'dl' and 'gallery-item' in cls:
            self.flush()
            a = next(find(n, lambda x: x.tag == 'a'), None)
            im = next(find(n, lambda x: x.tag == 'img'), None)
            dd = next(find(n, lambda x: x.tag == 'dd'), None)
            if im is not None:
                self.add_image(im, html.unescape(a.attrs.get('href', '')) if a is not None else None)
                if dd is not None:
                    self.caption(dd)
            return
        if tag == 'iframe':
            self.flush()
            src = html.unescape(n.attrs.get('src', ''))
            m = re.search(r'youtube(?:-nocookie)?\.com/embed/([\w\-]+)', src)
            if m:
                self.blocks.append({'type': 'video', 'youtube': m.group(1)})
            elif src:
                self.blocks.append({'type': 'embed', 'src': src, 'title': '', 'height': int(re.sub(r'\D', '', n.attrs.get('height', '') or '') or 450)})
            return
        if tag == 'img':
            self.flush(); self.add_image(n); return
        if tag == 'a':
            href = norm_href(n.attrs.get('href'))
            has_img = any(True for _ in find(n, lambda x: x.tag == 'img'))
            text = clean_ws(plain(n)).strip()
            if has_img:
                self.flush()
                for im in find(n, lambda x: x.tag == 'img'):
                    self.add_image(im, n.attrs.get('href') if re.search(r'/wp-content/uploads/', n.attrs.get('href', '')) else None)
                    if href and not re.search(r'/wp-content/', href) and self.blocks[-1]['type'] == 'image':
                        self.blocks[-1]['href'] = href
                return
            if not text:
                if href and n.attrs.get('target') == '_blank':
                    self.pending_link = href
                return
            if href and href.startswith(('tel:', 'mailto:')) and 'button' in cls:
                return
            if href and ('button' in cls or n.parent is not None and any(c in n.parent.cls for c in ('fl-button',))):
                self.flush()
                self.blocks.append({'type': 'button', 'label': text, 'href': href})
                return
            self.buf.append(n)
            return
        if tag in ('span', 'strong', 'b', 'em', 'i', 'u', 'small', 'br'):
            if any(isinstance(k, Node) and (k.tag in ('p', 'img', 'a') and ('button' in k.cls or k.tag in ('p', 'img'))) for k in n.kids):
                for k in n.kids:
                    self.walk(k)
            else:
                self.buf.append(n)
            return
        # conteneur : on descend ; une `a` de bouton dans un conteneur de bouton est traitée plus haut
        if tag in ('div', 'section', 'article', 'main', 'figure', 'li', 'blockquote', 'body', 'html', 'root', 'td', 'dl', 'dt', 'dd'):
            if tag in ('div', 'section', 'article', 'figure', 'li', 'blockquote') and n.kids:
                self.flush()
            for k in n.kids:
                self.walk(k)
            if tag in ('div', 'section', 'article', 'figure', 'li', 'blockquote'):
                self.flush()
            return
        for k in n.kids:
            self.walk(k)


# ---------- images ----------
def ascii_name(s):
    s = unicodedata.normalize('NFKD', urllib.parse.unquote(s)).encode('ascii', 'ignore').decode()
    s = re.sub(r'[^A-Za-z0-9._-]+', '-', s).strip('-').lower()
    return s


def make_img_ref():
    ref_path = CONTENT / 'images.json'
    refs = json.loads(ref_path.read_text(encoding='utf8'))
    by_origin = {v: k for k, v in refs.items()}
    dims_p, var_p = CONTENT / 'imageDims.json', CONTENT / 'imageVariants.json'
    dims, variants = json.loads(dims_p.read_text(encoding='utf8')), json.loads(var_p.read_text(encoding='utf8'))
    (CACHE / 'img').mkdir(parents=True, exist_ok=True)
    changed = {'v': False}

    def ref(origin):
        if origin.startswith('/'):
            origin = ORIGIN + origin
        origin = urllib.parse.quote(urllib.parse.unquote(origin), safe=":/%?=&")
        if origin in by_origin:
            return '/img/site/' + by_origin[origin]
        # un autre fichier déjà pris en compte sous une forme décodée
        dec = urllib.parse.unquote(origin)
        if dec in by_origin:
            return '/img/site/' + by_origin[dec]
        base = os.path.splitext(ascii_name(os.path.basename(urllib.parse.urlparse(origin).path)))[0] or 'image'
        name = base + '.webp'
        i = 2
        while name in refs:
            name = f'{base}-{i}.webp'; i += 1
        raw = CACHE / 'img' / ascii_name(os.path.basename(urllib.parse.urlparse(origin).path))
        if not raw.exists():
            req = urllib.request.Request(origin, headers=UA)
            raw.write_bytes(urllib.request.urlopen(req, timeout=60).read())
        im = Image.open(raw)
        im.load()
        if im.mode in ('P', 'LA') or (im.mode == 'RGBA'):
            im = im.convert('RGBA')
        else:
            im = im.convert('RGB')
        if im.width > 2000:
            im = im.resize((2000, round(im.height * 2000 / im.width)), Image.LANCZOS)
        im.save(IMG_DIR / name, 'WEBP', quality=82, method=6)
        p = '/img/site/' + name
        dims[p] = [im.width, im.height]
        if im.width > 1000:
            small = im.resize((800, round(im.height * 800 / im.width)), Image.LANCZOS)
            small.save(IMG_DIR / name.replace('.webp', '.800.webp'), 'WEBP', quality=80, method=6)
            variants[p] = im.width
        refs[name] = origin
        by_origin[origin] = name
        changed['v'] = True
        return p

    def save():
        wr(ref_path, json.dumps(refs, ensure_ascii=False, indent=1))
        wr(dims_p, json.dumps(dims, ensure_ascii=False, separators=(',', ':')))
        wr(var_p, json.dumps(variants, ensure_ascii=False, separators=(',', ':')))

    return ref, save


# ---------- pages ----------
def fetch(slug):
    CACHE.mkdir(parents=True, exist_ok=True)
    f = CACHE / (slug + '.html')
    if not f.exists():
        req = urllib.request.Request(f'{ORIGIN}/{slug}/', headers=UA)
        f.write_bytes(urllib.request.urlopen(req, timeout=60).read())
    return f.read_text(encoding='utf8')


def region(t):
    a = t.find('<article')
    page = t.find('fl-page-content')
    if a < 0 or 'fl-module' in t[page:t.find('<footer', page)]:
        a = t.rfind('<div', 0, page)
    return t[a:t.find('<footer', a)]


def page_meta(t):
    title = html.unescape(re.search(r'<title>(.*?)</title>', t, re.S).group(1)).strip()
    m = re.search(r'<meta name="description" content="(.*?)"', t) or re.search(r'<meta property="og:description" content="(.*?)"', t)
    return title, html.unescape(m.group(1)).strip() if m else ''


DEAD_LINKS = {'/wp-content/mp3/yourteco_radio-g-angers.mp3'}  # 404 sur le site d'origine : texte gardé, lien retiré


# logos très larges remplacés par des versions de 500 px (sinon la première grande image devient le bandeau de la page)
LOGOS = {'/img/site/logo-yourtevent-blanc-noir.webp': '/img/site/logo-yourtevent-partenaire.webp', '/img/site/logo-chantier-participatif-yourte.webp': '/img/site/logo-yourtandco-partenaire.webp'}
LOGO_ALT = {'lesnouvellesdesable.fr': 'Les Nouvelles de Sablé', 'ouest-france.fr': 'Ouest-France', 'courrierdelouest.fr': "Courrier de l'Ouest", 'radio-g.fr': 'Radio G'}
EMBED_TITLES = {'sketchfab.com': "Modèle 3D d'une yourte Yourteco", 'www.google.fr': 'Aperçu Google Street View de Yourteco'}


def post(slug, blocks):
    """Retouches de structure (jamais de texte) : niveaux de titres, vidéos YouTube en lien, logos partenaires."""
    out = []
    first_h1 = True
    prev = 1
    for b in blocks:
        if b['type'] == 'heading':
            if b['level'] == 1:
                if first_h1:
                    first_h1 = False
                else:
                    b['level'] = min(prev + 1, 6)
            b['level'] = min(b['level'], prev + 1) if not (b['level'] == 1) else 1
            prev = b['level']
        if b['type'] == 'text':
            for sg in b['segs']:
                if sg.get('href') and any(sg['href'].endswith(d) for d in DEAD_LINKS):
                    del sg['href']
            if len(b['segs']) == 1:
                t = b['segs'][0]['t'].strip()
                m = re.fullmatch(r'https?://(?:www\.)?youtube\.com/watch\?v=([\w\-]+)', t)
                if m:
                    b = {'type': 'video', 'youtube': m.group(1)}
                if b['type'] == 'text' and t == 'Lire la suite' and b['segs'][0].get('href'):
                    b = {'type': 'button', 'label': t, 'href': b['segs'][0]['href']}
        out.append(b)
    for b in out:  # pages « pièce jointe » de WordPress (une par photo) : non reprises, la photo reste sans lien
        if b['type'] == 'image' and b.get('href', '').startswith('/' + slug + '/'):
            del b['href']
    for b in out:  # logos de journaux sans texte alternatif dans l'original : on nomme le lien (obligatoire pour l'accessibilité)
        if b['type'] == 'image' and b.get('href') and not b.get('alt'):
            b['alt'] = next((v for k, v in LOGO_ALT.items() if k in b['href']), b['alt'])
    for b in out:  # titres des contenus externes (texte d'interface nouveau, listé dans docs/reformulations.md)
        if b['type'] == 'embed':
            b['title'] = EMBED_TITLES.get(urllib.parse.urlparse(b['src']).hostname, 'Contenu externe')
    if slug == 'nos-partenaires':  # une carte par partenaire : logo (lien), nom et description
        items, rest, i = [], [], 0
        while i < len(out):
            if out[i]['type'] == 'image' and i + 1 < len(out) and out[i + 1]['type'] == 'heading':
                logo, name = out[i], out[i + 1]
                text = out[i + 2] if i + 2 < len(out) and out[i + 2]['type'] == 'text' else None
                items.append({'name': name['text'], 'text': ''.join(x['t'] for x in text['segs']) if text else '', 'src': LOGOS.get(logo['src'], logo['src']), 'href': logo.get('href')})
                i += 3 if text else 2
            else:
                rest.append(out[i]); i += 1
        if items:
            rest.insert(1 if rest and rest[0]['type'] == 'heading' else 0, {'type': 'partners', 'items': items})
        out = rest
    return out


def extract(slug, img_ref):
    t = fetch(slug)
    title, desc = page_meta(t)
    root = parse(region(t))
    conv = Conv(img_ref)
    conv.walk(root)
    conv.flush()
    blocks = post(slug, conv.blocks)
    h1 = next((b['text'] for b in blocks if b['type'] == 'heading' and b['level'] == 1), title)
    if not any(b['type'] == 'heading' and b['level'] == 1 for b in blocks):
        blocks.insert(0, {'type': 'heading', 'level': 1, 'text': h1})
    i = next(i for i, b in enumerate(blocks) if b['type'] == 'heading' and b['level'] == 1)
    head, rest = blocks[:i + 1], blocks[i + 1:]
    # blocs avant le H1 : on les garde après
    pre, head = head[:-1], head[-1:]
    sections = [{'blocks': head}] + ([{'blocks': pre + rest}] if pre + rest else [])
    return {'slug': slug, 'url': f'{ORIGIN}/{slug}/', 'lang': 'fr', 'title': title, 'description': desc, 'h1': h1, 'sections': sections}


if __name__ == '__main__':
    ref, save = make_img_ref()
    for slug in sys.argv[1:]:
        data = extract(slug, ref)
        out = CONTENT / 'pages' / (slug.replace('/', '__') + '.json')
        wr(out, json.dumps(data, ensure_ascii=False, indent=1) + '\n')
        nb = sum(len(s['blocks']) for s in data['sections'])
        print(f'{slug}: {nb} blocs -> {out.name}')
    save()
