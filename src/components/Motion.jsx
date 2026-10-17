import { motion, useInView, useReducedMotion, animate } from 'motion/react'
import { Fragment, useEffect, useRef, useState } from 'react'

const EASE = [0.16, 1, 0.3, 1]

/** Apparition au défilement : contenu visible par défaut si mouvement réduit. */
export function Reveal({ as = 'div', delay = 0, y = 28, children, className, ...rest }) {
  const reduce = useReducedMotion()
  const M = motion[as]
  if (reduce) return <M className={className} {...rest}>{children}</M>
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -4% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </M>
  )
}

/* trait de survol des titres : posé sur le texte, pas sur le bloc */
const Wrap = ({ ul, children }) => (ul ? <span className="ul">{children}</span> : children)

/** Titre révélé mot par mot (masque). Le texte reste lisible par les lecteurs d'écran. */
export function WordsReveal({ text, as = 'h2', id, className, delay = 0, stagger = 0.055, immediate = false }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  if (reduce) { const Tag = as; return <Tag id={id} className={className}>{as === 'span' ? text : <span className="ul">{text}</span>}</Tag> }
  const label = as === 'span' ? undefined : text
  const M = motion[as]
  const trigger = immediate
    ? { initial: 'hidden', animate: 'show' }
    : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '0px 0px -4% 0px' } }
  return (
    <M id={id} className={className} aria-label={label} aria-hidden={as === 'span' ? 'true' : undefined} {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}>
      <Wrap ul={as !== 'span'}>{words.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span className="wr-mask" aria-hidden="true">
            <motion.span
              className="wr-word"
              variants={{ hidden: { y: '108%' }, show: { y: '0%', transition: { duration: 1, ease: EASE } } }}
            >
              {w}
            </motion.span>
          </span>
        </Fragment>
      ))}</Wrap>
    </M>
  )
}

/** Compteur qui « se marque » à l'arrivée. */
export function Counter({ to, prefix = '', suffix = '', className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, to, { duration: 1.6, ease: EASE, onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, reduce, to])
  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{prefix}{val}{suffix}</span>
      <span className="sr-only">{prefix}{to}{suffix}</span>
    </span>
  )
}

export { EASE }
