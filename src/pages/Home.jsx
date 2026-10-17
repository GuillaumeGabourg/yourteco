import { useRef, useState, useEffect } from 'react'
import { asset } from '../lib/asset.js'
import { Link } from 'react-router-dom'
import { motion, useScroll, useReducedMotion, useMotionValueEvent, useMotionValue } from 'motion/react'
import { HOME } from '../content/home.js'
import { REVIEWS, REVIEWS_META, SOURCE_LABEL } from '../content/reviews.js'
import { CONTACT } from '../content/site.js'
import { fix, SmartLink } from '../lib/text.jsx'
import { Reveal, WordsReveal, Counter, EASE } from '../components/Motion.jsx'
import { Plate } from '../components/Plate.jsx'
import { QuoteButton, PhoneLink } from '../components/Chrome.jsx'
import { SunRays, FallingLeaves, Hills, TreeRings, Dapple, GrowingStem, LeafShape } from '../components/Nature.jsx'
import YurtAssembly from '../components/YurtAssembly.jsx'
import ReviewCarousel from '../components/ReviewCarousel.jsx'
import QuoteForm from '../components/QuoteForm.jsx'
import Icon from '../components/Icon.jsx'
import { usePageMeta } from '../lib/meta.js'
import { useSmooth, barHeight, prefersReducedMotion } from '../lib/smooth.jsx'

/* ---------- Héros ---------- */
function Hero() {
  const h = HOME.hero
  const reduce = useReducedMotion()
  // parallaxe et fondu du héros : animations CSS liées au défilement (site.css), aucun calcul JavaScript
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-media">
        <motion.img
          src={asset(h.image)}
          alt={h.alt}
          width="2000"
          height="1289"
          fetchPriority="high"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        />
      </div>
      <SunRays className="hero-rays" />
      <FallingLeaves count={10} />
      <div className="wrap hero-content">
        <h1 id="hero-title" className="hero-title" aria-label={h.title}>
          <motion.img
            className="hero-logo"
            src={asset('/img/brand/logo-yourteco-light.png')}
            alt=""
            width="904"
            height="327"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25, duration: 1.1, ease: EASE }}
          />{' '}
          <WordsReveal as="span" text={h.title.replace(/^Yourteco\s*/, '')} className="hero-words" immediate delay={0.55} stagger={0.06} />
        </h1>
        <motion.div
          className="hero-actions"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9, ease: EASE }}
        >
          <QuoteButton className="btn-lg" />
          <PhoneLink className="phone-lg phone-light" />
        </motion.div>
        <motion.p
          className="hero-place"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <Icon name="pin" size={16} /> {h.tag}
        </motion.p>
      </div>
      <p className="hero-cap">{fix(h.caption)}</p>
      <Hills className="hills-bottom" to="var(--bg)" back="var(--leaf)" mid="var(--sun)" />
    </section>
  )
}

/* ---------- Présentation ---------- */
function Intro() {
  const d = HOME.intro
  const icons = ['sun', 'shield', 'compass']
  return (
    <section className="intro section" aria-labelledby="intro-title">
      <div className="wrap">
        <header className="sec-head">
          <WordsReveal as="h2" id="intro-title" text={fix(d.title)} className="h2" />
          <Reveal as="p" className="lead">{fix(d.paragraphs[0])}</Reveal>
        </header>

        <div className="intro-grid">
          <div className="intro-collage">
            <Reveal className="collage-main"><Plate {...d.images[0]} ratio="5 / 4" caption={fix(d.images[0].caption)} tag="ERP · Paris" /></Reveal>
            <Reveal delay={0.15} className="collage-small"><Plate {...d.images[1]} ratio="1 / 1" /></Reveal>
          </div>
          <Reveal className="intro-text">
            {d.paragraphs.slice(1).map((p, i) => <p key={i}>{fix(p)}</p>)}
            <Link to="/fabrication-de-yourte-contemporaine/" className="more"><span>Découvrir nos yourtes</span><Icon name="arrow" size={18} /></Link>
          </Reveal>
        </div>

        <div className="why">
          <Reveal as="h3" className="why-title h3"><span className="ul">{fix(d.whyTitle)}</span></Reveal>
          <ul className="why-list">
            {d.why.map(([t, x], i) => (
              <Reveal as="li" key={t} className="why-item" delay={i * 0.1}>
                <span className="why-icon"><Icon name={icons[i]} size={26} /></span>
                <h4><span className="ul">{fix(t)}</span></h4>
                <p>{fix(x)}</p>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="eco">
          <SunRays className="eco-rays" rays={11} />
          <div className="eco-in">
            <span className="eco-icon"><Icon name="sprout" size={30} /></span>
            <h3 className="h3"><span className="ul">{fix(d.ecoTitle)}</span></h3>
            <p>{fix(d.eco)}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Repères (cernes) ---------- */
function Marks() {
  return (
    <section className="marks" aria-label="Repères">
      <Hills className="hills-top" to="var(--green-800)" back="var(--sun)" mid="var(--leaf)" grass={false} />
      <div className="wrap marks-grid">
        {HOME.marks.map((m, i) => (
          <Reveal key={m.label} className="mark" delay={i * 0.1}>
            <TreeRings rings={i === 3 ? 7 : 5} />
            <div className="mark-in">
              <Counter to={m.value} suffix={m.suffix} className="mark-num" />
              <span className="mark-label">{fix(m.label)}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------- Montage au défilement ---------- */
/* La yourte suit le bloc de texte en cours de lecture : chaque bloc pilote sa phase du montage
   (bornes de YurtAssembly), terminée quand la moitié du bloc a passé la ligne de lecture. */
const PHASES = ['Structure', 'Étanchéité', 'Confort', 'Sol & urbanisme']
const BOUNDS = [0, 0.44, 0.68, 0.81, 1]
const DONE_AT = 0.45
const STACKED = '(max-width: 900px)' // mobile : la yourte est fixée en haut, le texte défile dessous

function Specs() {
  const s = HOME.specs
  const sectionRef = useRef(null)
  const figRef = useRef(null)
  const groupsRef = useRef([])
  const progress = useMotionValue(0)
  const [step, setStep] = useState(1)
  const { lenis } = useSmooth()

  // ligne de lecture : milieu de l'écran (ordinateur) ; sous la yourte fixée (mobile)
  // stuck : position de la yourte une fois fixée sous la barre (pour viser un bloc avant qu'elle le soit)
  const figBottom = (stuck) => (stuck ? barHeight() + figRef.current.offsetHeight : figRef.current.getBoundingClientRect().bottom)
  const readLine = (stuck = false) => {
    if (!matchMedia(STACKED).matches) return innerHeight * 0.5
    const fb = figBottom(stuck)
    return fb + (innerHeight - fb) * 0.6
  }

  useEffect(() => {
    let raf = 0
    let near = false
    const update = () => {
      raf = 0
      const gs = groupsRef.current
      const y = readLine()
      let i = 0
      for (let k = 0; k < gs.length; k++) if (gs[k].getBoundingClientRect().top <= y) i = k
      const r = gs[i].getBoundingClientRect()
      const f = Math.min(1, Math.max(0, (y - r.top) / r.height) / DONE_AT)
      progress.set(BOUNDS[i] + (BOUNDS[i + 1] - BOUNDS[i]) * f)
      setStep(i + 1)
    }
    const on = () => { if (near && !raf) raf = requestAnimationFrame(update) }
    // calculs seulement quand la section est proche de l'écran
    const io = new IntersectionObserver(([e]) => { near = e.isIntersecting; if (near) on() }, { rootMargin: '50% 0px' })
    io.observe(sectionRef.current)
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => { io.disconnect(); removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [progress])

  // clic sur une phase : le bloc vient se placer pour que sa phase soit montée, titre visible
  const goTo = (i) => {
    const g = groupsRef.current[i]
    const r = g.getBoundingClientRect()
    const stacked = matchMedia(STACKED).matches
    const minTop = stacked ? figBottom(true) + 8 : barHeight() + 16
    const top = Math.max(minTop, readLine(true) - r.height * (DONE_AT + 0.04))
    const y = r.top + scrollY - top
    if (lenis) lenis.scrollTo(y, { duration: 1.1 })
    else window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'instant' : 'smooth' })
  }

  return (
    <section className="specs section" aria-labelledby="specs-title" ref={sectionRef}>
      <div className="wrap">
        <header className="sec-head">
          <WordsReveal as="h2" id="specs-title" text={fix(s.title)} className="h2" />
          <Reveal as="p" className="lead">{fix(s.lead)}</Reveal>
        </header>
        <div className="specs-grid">
          <div className="specs-figure" ref={figRef}>
            <div className="specs-sticky">
              <p className="specs-caption">{fix(s.kicker)}</p>
              <YurtAssembly progress={progress} step={step} />
              <ol className="specs-steps" aria-label="Phases du montage">
                {PHASES.map((l, i) => (
                  <li key={l} className={step === i + 1 ? 'is-on' : step > i + 1 ? 'is-done' : ''}>
                    <button type="button" onClick={() => goTo(i)} aria-controls={'spec-' + i} aria-current={step === i + 1 ? 'step' : undefined}>{l}</button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="specs-col">
            {s.groups.map((g, gi) => (
              <article key={g.title} id={'spec-' + gi} ref={(el) => (groupsRef.current[gi] = el)} className={'spec-group' + (step === gi + 1 ? ' is-on' : '')}>
                <h3 className="h3"><span className="ul">{fix(g.title)}</span></h3>
                <dl>
                  {g.items.map(([t, x]) => (
                    <div key={t} className="spec-item">
                      <dt><Icon name="leaf" size={18} /> {fix(t)}</dt>
                      <dd>{fix(x)}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>
        <div className="specs-plates">
          {s.images.map((im, i) => (
            <Reveal key={im.src} delay={i * 0.12}><Plate {...im} ratio="4 / 3" caption={fix(im.caption)} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Offres ---------- */
function Offers() {
  return (
    <section className="offers section" aria-label="Fabrication, location, kit et toiles">
      {HOME.offers.map((g, gi) => (
        <div key={g.group} className={'wrap offer-group' + (gi ? ' offer-group-2' : '')}>
          <header className="sec-head">
            <WordsReveal as="h2" text={fix(g.group)} className="h2" />
          </header>
          <div className="offer-pair">
            {g.items.map((o, i) => (
              <Reveal key={o.title} className="offer" delay={i * 0.12}>
                <Link to={o.href} className="offer-img" tabIndex={-1} aria-hidden="true">
                  <Plate src={o.image} alt="" ratio="4 / 3" tag={o.tag} />
                </Link>
                <div className="offer-body">
                  <h3 className="h3"><Link to={o.href}><span className="ul">{fix(o.title)}</span></Link></h3>
                  <p>{fix(o.text)}</p>
                  <Link to={o.href} className="more">
                    <span>{fix(o.cta)}</span>
                    <Icon name="arrow" size={18} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

/* ---------- Avis (échantillon mensuel) ---------- */
function Reviews() {
  const m = REVIEWS_META
  return (
    <section className="reviews section" aria-labelledby="reviews-title">
      <div className="wrap">
        <header className="sec-head">
          <WordsReveal as="h2" id="reviews-title" text="Ils nous ont fait confiance" className="h2" />
          <p className="lead">Échantillon de nos avis clients, sélectionnés par Yourteco parmi les plus récents et les plus représentatifs.</p>
          <div className="g-row">
            <div className="g-score">
              <span className="g-num">{m.googleRating}<span className="g-of">/5</span></span>
              <span className="g-txt">sur {m.googleCount} avis Google<br /><span className="muted">relevé du {m.googleCheckedAt}</span></span>
            </div>
            <div className="g-links">
              <Link className="btn btn-line" to="/avis-clients-sur-la-societe-yourteco/">
                <span>Tous les témoignages de nos clients</span><Icon name="arrow" size={16} />
              </Link>
              <a className="btn btn-line" href={CONTACT.googleReviews} target="_blank" rel="noopener noreferrer">
                <span>Lire tous nos avis sur Google</span><Icon name="out" size={16} />
              </a>
            </div>
          </div>
        </header>
        <Reveal>
          <ReviewCarousel
            items={REVIEWS}
            label="Échantillon d'avis clients"
            renderItem={(r) => (
              <article className="review">
                <svg className="review-mark" viewBox="0 0 40 30" aria-hidden="true">
                  <path d="M2 30V18C2 8 7 2 16 0l2 4c-5 2-8 6-8 11h7v15zm21 0V18c0-10 5-16 14-18l2 4c-5 2-8 6-8 11h7v15z" />
                </svg>
                <blockquote><p>{r.text}</p></blockquote>
                {r.reply && <p className="review-reply"><span>Réponse de Yourteco</span> {r.reply}</p>}
                <footer className="review-by">
                  <span className="rv-avatar" aria-hidden="true">{r.author.replace(/[^\p{L}\s]/gu, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')}</span>
                  <span className="rv-who">
                    <strong>{r.author}</strong>
                    <span>{r.project}</span>
                    <span>{SOURCE_LABEL[r.source]} · {r.date}</span>
                  </span>
                </footer>
              </article>
            )}
          />
        </Reveal>
        <div className="reviews-legal">
          <p>
            Sélection mise à jour le {m.updatedAt}. Cette page présente une partie des avis que nous avons reçus, choisis par Yourteco ;
            ils ne font pas l'objet d'une vérification indépendante. L'ensemble des avis, positifs comme négatifs, est consultable sur{' '}
            <a href={CONTACT.googleReviews} target="_blank" rel="noopener noreferrer">notre fiche Google</a>.
          </p>
          <details>
            <summary>Comment nous publions les avis</summary>
            <p>
              Source : avis publiés sur Google ou reçus directement par Yourteco. Sélection : choisie chaque mois par l'équipe parmi les avis les plus
              récents et les plus représentatifs, affichée du plus récent au plus ancien. Aucune contrepartie n'est offerte aux auteurs. Les textes ne sont
              pas modifiés ; les coupes sont signalées par « […] ». Un auteur peut demander le retrait de son avis à {CONTACT.email}.
            </p>
          </details>
        </div>
      </div>
    </section>
  )
}

/* ---------- Éthique + vidéo ---------- */
function Ethics() {
  const e = HOME.ethics
  const [play, setPlay] = useState(false)
  const icons = ['hammer', 'tree', 'compass', 'shield', 'hand']
  return (
    <section className="ethics section" aria-labelledby="ethics-title">
      <Hills className="hills-top" to="var(--green-800)" back="var(--leaf)" mid="var(--green-600)" seed={11} />
      <Dapple />
      <div className="wrap">
        <header className="sec-head">
          <h2 id="ethics-title" className="h2"><span className="ul">{fix(e.title)}</span><span className="h2-sub">{fix(e.subtitle)}</span></h2>
          <Reveal as="p" className="lead">{fix(e.lead)}</Reveal>
        </header>
        <ul className="pillars">
          {e.pillars.map(([t, x], i) => (
            <Reveal as="li" key={t} className="pillar" delay={i * 0.08}>
              <span className="pillar-icon"><Icon name={icons[i]} size={26} /></span>
              <h3><span className="ul">{fix(t)}</span></h3>
              <p>{fix(x)}</p>
            </Reveal>
          ))}
        </ul>
        <div className="craft">
          <Reveal className="craft-text">
            <h3 className="h3"><span className="ul">{fix(e.craftTitle)}</span></h3>
            <p>{fix(e.craft)}</p>
          </Reveal>
          <Reveal as="figure" className="video plate" delay={0.1}>
            <div className="plate-frame" style={{ aspectRatio: '16 / 9' }}>
              {play ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${e.video.id}?autoplay=1&rel=0`}
                  title="Visite des ateliers Yourteco"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button className="video-btn" onClick={() => setPlay(true)} aria-label="Lire la vidéo de visite des ateliers (YouTube)">
                  <img src={asset(e.video.poster)} alt="" loading="lazy" />
                  <span className="video-play"><Icon name="play" size={28} /></span>
                </button>
              )}
            </div>
            <figcaption className="plate-cap">
              <span>{fix(e.video.caption)}</span>
            </figcaption>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------- Étapes (contenu proposé) ---------- */
function Steps() {
  const s = HOME.steps
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'start 45%'] })
  const [reached, setReached] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setReached(v <= 0 ? 0 : Math.min(4, Math.floor(v * 4) + 1)))
  return (
    <section className="steps section" aria-labelledby="steps-title">
      <div className="wrap">
        <header className="sec-head">
          <WordsReveal as="h2" id="steps-title" text={s.title} className="h2" />
        </header>
        <div className="steps-track" ref={ref}>
          <GrowingStem progress={scrollYProgress} />
          <ol className="steps-list">
            {s.items.map(([t, x], i) => (
              <li key={t} className={'step' + (reached > i ? ' is-on' : '')}>
                <span className="step-bud" aria-hidden="true">
                  <span className="bud-leaf bud-l"><LeafShape color="var(--leaf)" /></span>
                  <span className="bud-leaf bud-r"><LeafShape color="var(--green-600)" /></span>
                  <span className="bud-n">{i + 1}</span>
                </span>
                <h3><span className="ul">{t}</span></h3>
                <p>{x}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="steps-cta"><QuoteButton className="btn-lg">Commencer par un devis</QuoteButton></div>
      </div>
    </section>
  )
}

/* ---------- Engagements (bande défilante) ---------- */
function Commitments() {
  const c = HOME.commitments
  const row = c.items.map(([t]) => fix(t))
  return (
    <section className="commit section" aria-labelledby="commit-title">
      <div className="wrap">
        <header className="sec-head">
          <WordsReveal as="h2" id="commit-title" text={fix(c.title)} className="h2" />
        </header>
      </div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...row, ...row].map((t, i) => (
            <span key={i} className="marquee-item"><span className="marquee-leaf"><LeafShape color={i % 2 ? 'var(--leaf)' : 'var(--sun)'} /></span>{t}</span>
          ))}
        </div>
      </div>
      <div className="wrap">
        <ul className="commit-list">
          {c.items.map(([t, x], i) => (
            <Reveal as="li" key={t} delay={(i % 2) * 0.08}>
              <Icon name="check" size={20} />
              <span><strong>{fix(t)}</strong>{x && <span className="muted"> {fix(x)}</span>}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Actualités ---------- */
function News() {
  const n = HOME.news
  return (
    <section className="news section" aria-labelledby="news-title">
      <div className="wrap">
        <header className="sec-head">
          <WordsReveal as="h2" id="news-title" text={n.title} className="h2" />
        </header>
        <div className="news-grid">
          {n.items.map((it, i) => (
            <Reveal as="article" key={it.title} className="news-item" delay={i * 0.12}>
              <Plate src={it.image} alt="" ratio="16 / 10" />
              <div className="news-body">
                <h3 className="h3"><span className="ul">{fix(it.title)}</span></h3>
                <p>{fix(it.text)}</p>
                <SmartLink href={it.href} className="more"><span>{fix(it.cta)}</span><Icon name="out" size={16} /></SmartLink>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Prix + devis ---------- */
function Quote() {
  const p = HOME.price
  return (
    <section id="devis" className="quote section" aria-labelledby="quote-title">
      <Hills className="hills-top" to="var(--green-800)" back="var(--sun)" mid="var(--leaf)" seed={23} />
      <Dapple />
      <div className="wrap quote-grid">
        <div className="quote-side">
          <h2 id="quote-title" className="h2"><span className="ul">{fix(p.title)}</span></h2>
          <p>{fix(p.text)}</p>
          <Link to={p.href} className="more more-light"><span>{fix(p.cta)}</span><Icon name="arrow" size={18} /></Link>
          <div className="quote-contact">
            <p className="quote-contact-h">Préférez le téléphone ?</p>
            <PhoneLink className="phone-xl" />
            <a href={'mailto:' + CONTACT.email} className="phone"><Icon name="mail" size={18} /><span>{CONTACT.email}</span></a>
            <p className="muted"><Icon name="pin" size={16} className="inline-ico" /> « Le petit paradis », 49640 Daumeray</p>
          </div>
        </div>
        <div className="quote-main">
          <h3 className="quote-form-title">Demander un devis</h3>
          <QuoteForm />
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  usePageMeta({ title: 'Yourteco : fabricant de yourtes contemporaines en bois', description: 'Yourteco conçoit, fabrique et installe votre yourte contemporaine en bois. Habitation, loisir, ERP, kit d\'autoconstruction.' })
  useEffect(() => { document.documentElement.classList.add('is-home'); return () => document.documentElement.classList.remove('is-home') }, [])
  return (
    <>
      <Hero />
      <Intro />
      <Marks />
      <Specs />
      <Offers />
      <Reviews />
      <Ethics />
      <Steps />
      <Commitments />
      <News />
      <Quote />
    </>
  )
}
