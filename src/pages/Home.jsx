import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from 'motion/react'
import { HOME } from '../content/home.js'
import { REVIEWS, REVIEWS_META, SOURCE_LABEL } from '../content/reviews.js'
import { CONTACT } from '../content/site.js'
import { fix, SmartLink } from '../lib/text.jsx'
import { Reveal, WordsReveal, Counter } from '../components/Motion.jsx'
import { Plate, Tag } from '../components/Plate.jsx'
import { QuoteButton, PhoneLink } from '../components/Chrome.jsx'
import YurtAssembly from '../components/YurtAssembly.jsx'
import QuoteForm from '../components/QuoteForm.jsx'
import Icon from '../components/Icon.jsx'
import { usePageMeta } from '../lib/meta.js'

/* ---------- Hero ---------- */
function Hero() {
  const h = HOME.hero
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14])
  return (
    <section ref={ref} className="hero" aria-labelledby="hero-title">
      <div className="hero-media">
        <motion.img
          src={h.image}
          alt={h.alt}
          width="2000"
          height="1289"
          fetchPriority="high"
          style={reduce ? undefined : { y, scale }}
          initial={reduce ? false : { clipPath: 'inset(8% 6% 8% 6%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <motion.div
        className="hero-tag-wrap"
        initial={reduce ? false : { opacity: 0, y: -30, rotate: -12 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: 1.1, type: 'spring', stiffness: 120, damping: 11 }}
      >
        <Tag tilt={-4}>{h.tag}</Tag>
      </motion.div>
      <div className="hero-plank">
        <div className="hero-plank-in">
          <WordsReveal as="h1" id="hero-title" text={h.title} className="hero-title" immediate delay={0.35} stagger={0.06} />
          <motion.div
            className="hero-actions"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <QuoteButton className="btn-lg" />
            <PhoneLink className="phone-lg" />
          </motion.div>
        </div>
      </div>
      <p className="hero-cap wrap"><span>{fix(h.caption)}</span><span className="plate-meta">Habitation · RE2020</span></p>
    </section>
  )
}

/* ---------- Intro ---------- */
function Intro() {
  const d = HOME.intro
  return (
    <section className="intro section" aria-labelledby="intro-title">
      <div className="wrap intro-grid">
        <div className="intro-text">
          <WordsReveal as="h2" id="intro-title" text={fix(d.title)} className="h2" />
          <Reveal className="intro-paras">
            {d.paragraphs.map((p, i) => <p key={i} className={i === 0 ? 'lead' : ''}>{fix(p)}</p>)}
          </Reveal>
        </div>
        <div className="intro-plates">
          <Reveal><Plate {...d.images[0]} caption={fix(d.images[0].caption)} meta="ERP · Paris" parallax={4} tag="8 yourtes" tagTilt={3} /></Reveal>
          <Reveal delay={0.1} className="intro-plate-2"><Plate {...d.images[1]} caption={fix(d.images[1].caption)} meta="Intérieur" /></Reveal>
        </div>
      </div>
      <div className="wrap why">
        <Reveal as="h3" className="why-title h3">{fix(d.whyTitle)}</Reveal>
        <dl className="why-list">
          {d.why.map(([t, x], i) => (
            <Reveal key={t} className="why-item" delay={i * 0.08}>
              <dt>{fix(t)}</dt>
              <dd>{fix(x)}</dd>
            </Reveal>
          ))}
        </dl>
        <Reveal className="eco">
          <h3 className="h3">{fix(d.ecoTitle)}</h3>
          <p>{fix(d.eco)}</p>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Bouts de poutre (preuves) ---------- */
function Marks() {
  return (
    <section className="marks" aria-label="Repères">
      <div className="wrap marks-grid">
        {HOME.marks.map((m, i) => (
          <Reveal key={m.label} className={'beam beam-' + i} delay={i * 0.08} y={40}>
            <span className="beam-paint" aria-hidden="true" />
            <Counter to={m.value} suffix={m.suffix} className="beam-num" />
            <span className="beam-label">{fix(m.label)}</span>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------- Signature : montage au défilement ---------- */
function Specs() {
  const s = HOME.specs
  const colRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: colRef, offset: ['start 75%', 'end 55%'] })
  const [step, setStep] = useState(1)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setStep(Math.min(4, Math.floor(v * 4) + 1)))
  return (
    <section className="specs section" aria-labelledby="specs-title">
      <div className="wrap">
        <header className="specs-head">
          <WordsReveal as="h2" id="specs-title" text={fix(s.title)} className="h2" />
          <Reveal as="p" className="lead specs-lead">{fix(s.lead)}</Reveal>
          <p className="specs-kicker-line">{fix(s.kicker)}</p>
        </header>
        <div className="specs-grid">
          <div className="specs-figure">
            <div className="specs-sticky">
              <YurtAssembly progress={scrollYProgress} step={step} />
              <ol className="specs-steps" aria-hidden="true">
                {['Structure', 'Étanchéité', 'Confort', 'Sol & urbanisme'].map((l, i) => (
                  <li key={l} className={step === i + 1 ? 'is-on' : step > i + 1 ? 'is-done' : ''}>{l}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="specs-col" ref={colRef}>
            {s.groups.map((g, gi) => (
              <article key={g.title} className={'spec-group' + (step === gi + 1 ? ' is-on' : '')}>
                <h3 className="h3">{fix(g.title)}</h3>
                <dl>
                  {g.items.map(([t, x]) => (
                    <div key={t} className="spec-item">
                      <dt>{fix(t)}</dt>
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
            <Reveal key={im.src} delay={i * 0.1}><Plate {...im} caption={fix(im.caption)} meta={i ? 'Double yourte' : 'Habitation'} parallax={3} /></Reveal>
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
        <div key={g.group} className="wrap offer-group">
          <WordsReveal as="h2" text={fix(g.group)} className="h2 offer-group-title" />
          <div className="offer-pair">
            {g.items.map((o, i) => (
              <Reveal key={o.title} className={'offer offer-' + ((gi * 2 + i) % 4)} delay={i * 0.12}>
                <Link to={o.href} className="offer-img" tabIndex={-1} aria-hidden="true">
                  <Plate src={o.image} alt="" ratio="3 / 2" tag={o.tag} tagTilt={i ? 3 : -3} />
                </Link>
                <div className="offer-body">
                  <h3 className="h3"><Link to={o.href}>{fix(o.title)}</Link></h3>
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
      <div className="wrap reviews-grid">
        <div className="reviews-head">
          <h2 id="reviews-title" className="h2">Ils nous ont fait confiance</h2>
          <p className="lead">Échantillon de nos avis clients, sélectionnés par Yourteco parmi les plus récents et les plus représentatifs.</p>
          <div className="g-score">
            <span className="g-num">{m.googleRating}<span className="g-of">/5</span></span>
            <span className="g-txt">sur {m.googleCount} avis Google<br /><span className="muted">relevé du {m.googleCheckedAt}</span></span>
          </div>
          <a className="btn btn-line" href={CONTACT.googleReviews} target="_blank" rel="noopener noreferrer">
            <span>Lire tous nos avis sur Google</span><Icon name="out" size={16} />
          </a>
        </div>
        <ul className="reviews-list">
          {REVIEWS.map((r, i) => (
            <Reveal as="li" key={r.id} className={'review review-' + i} delay={(i % 2) * 0.1}>
              <blockquote>
                <p>« {r.text} »</p>
              </blockquote>
              <p className="review-by">
                <strong>{r.author}</strong>
                <span>{r.project}</span>
                <span>{SOURCE_LABEL[r.source]} · {r.date}</span>
              </p>
              {r.reply && <p className="review-reply"><span>Réponse de Yourteco</span> {r.reply}</p>}
            </Reveal>
          ))}
        </ul>
      </div>
      <div className="wrap reviews-legal">
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
    </section>
  )
}

/* ---------- Éthique + vidéo ---------- */
function Ethics() {
  const e = HOME.ethics
  const [play, setPlay] = useState(false)
  return (
    <section className="ethics section" aria-labelledby="ethics-title">
      <div className="wrap ethics-head">
        <h2 id="ethics-title" className="h2">{fix(e.title)}<span className="h2-sub">{fix(e.subtitle)}</span></h2>
        <Reveal as="p" className="lead">{fix(e.lead)}</Reveal>
      </div>
      <div className="planks" role="list">
        {e.pillars.map(([t, x], i) => (
          <Reveal key={t} className="plank" role="listitem" delay={i * 0.07} y={50}>
            <span className="plank-end" aria-hidden="true" />
            <h3>{fix(t)}</h3>
            <p>{fix(x)}</p>
          </Reveal>
        ))}
      </div>
      <div className="wrap craft">
        <div className="craft-text">
          <h3 className="h3">{fix(e.craftTitle)}</h3>
          <p>{fix(e.craft)}</p>
        </div>
        <figure className="video plate">
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
                <img src={e.video.poster} alt="" loading="lazy" />
                <span className="video-play"><Icon name="play" size={30} /></span>
              </button>
            )}
          </div>
          <figcaption className="plate-cap">
            <span>{fix(e.video.caption)}</span>
            <span className="plate-meta">YouTube · chargé au clic</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

/* ---------- Étapes (contenu proposé) ---------- */
function Steps() {
  const s = HOME.steps
  return (
    <section className="steps section" aria-labelledby="steps-title">
      <div className="wrap">
        <div className="steps-head">
          <h2 id="steps-title" className="h2">{s.title}</h2>
          {s.proposed && <p className="proposed">Bloc proposé, à valider par Yourteco</p>}
        </div>
        <ol className="steps-list">
          {s.items.map(([t, x], i) => (
            <Reveal as="li" key={t} className="step" delay={i * 0.1}>
              <span className="step-n" aria-hidden="true">{i + 1}</span>
              <h3>{t}</h3>
              <p>{x}</p>
            </Reveal>
          ))}
        </ol>
        <div className="steps-cta"><QuoteButton className="btn-lg">Commencer par un devis</QuoteButton></div>
      </div>
    </section>
  )
}

/* ---------- Engagements (bande défilante) ---------- */
function Commitments() {
  const c = HOME.commitments
  const reduce = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const row = c.items.map(([t]) => fix(t))
  return (
    <section className="commit" aria-labelledby="commit-title">
      <div className="wrap commit-head">
        <h2 id="commit-title" className="h2">{fix(c.title)}</h2>
        {!reduce && (
          <button className="btn-icon" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
            <Icon name={paused ? 'play' : 'pause'} size={18} />
            <span className="sr-only">{paused ? 'Relancer le défilement' : 'Mettre en pause le défilement'}</span>
          </button>
        )}
      </div>
      <div className={'marquee' + (paused ? ' is-paused' : '')} aria-hidden="true">
        <div className="marquee-track">
          {[...row, ...row].map((t, i) => <span key={i} className="marquee-item">{t}</span>)}
        </div>
      </div>
      <ul className="wrap commit-list">
        {c.items.map(([t, x]) => (
          <li key={t}><strong>{fix(t)}</strong>{x && <span> {fix(x)}</span>}</li>
        ))}
      </ul>
    </section>
  )
}

/* ---------- Actualités ---------- */
function News() {
  const n = HOME.news
  return (
    <section className="news section" aria-labelledby="news-title">
      <div className="wrap">
        <h2 id="news-title" className="h2">{n.title}</h2>
        <div className="news-grid">
          {n.items.map((it, i) => (
            <Reveal as="article" key={it.title} className={'news-item news-' + i} delay={i * 0.1}>
              <Plate src={it.image} alt="" ratio={i ? '3 / 2' : '3 / 2'} parallax={i ? 3 : 0} />
              <h3 className="h3">{fix(it.title)}</h3>
              <p>{fix(it.text)}</p>
              <SmartLink href={it.href} className="more"><span>{fix(it.cta)}</span><Icon name="out" size={16} /></SmartLink>
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
      <div className="wrap quote-grid">
        <div className="quote-side">
          <h2 id="quote-title" className="h2">{fix(p.title)}</h2>
          <p>{fix(p.text)}</p>
          <Link to={p.href} className="more more-light"><span>{fix(p.cta)}</span><Icon name="arrow" size={18} /></Link>
          <div className="quote-contact">
            <p className="quote-contact-h">Préférez le téléphone ?</p>
            <PhoneLink className="phone-xl" />
            <a href={'mailto:' + CONTACT.email} className="phone"><Icon name="mail" size={18} /><span>{CONTACT.email}</span></a>
            <p className="muted">« Le petit paradis », 49640 Daumeray</p>
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
