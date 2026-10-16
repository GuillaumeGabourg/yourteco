import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import Icon from './Icon.jsx'
import { asset } from '../lib/asset.js'

/** Pastille (soleil du logo) posée sur une photo. */
export function Tag({ children, className = '' }) {
  return (
    <span className={'tag ' + className}>
      <Icon name="leaf" size={15} />
      <span>{children}</span>
    </span>
  )
}

/** Photo arrondie : ouverture douce à l'arrivée + léger parallaxe. */
export function Plate({ src, alt, caption, meta, ratio = '3 / 2', tag, parallax = 0, className = '', priority = false, sizes, reveal = true, style }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`])
  const open = reveal && !reduce && !priority
  return (
    <figure ref={ref} className={'plate ' + className} style={style}>
      <motion.div
        className="plate-frame"
        style={{ aspectRatio: ratio }}
        initial={open ? { clipPath: 'inset(10% 8% 10% 8% round 22px)' } : false}
        whileInView={open ? { clipPath: 'inset(0% 0% 0% 0% round 22px)' } : undefined}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={asset(src)}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          sizes={sizes}
          style={parallax && !reduce ? { y, scale: 1 + parallax / 45 } : undefined}
        />
        {tag && <Tag>{tag}</Tag>}
      </motion.div>
      {(caption || meta) && (
        <figcaption className="plate-cap">
          {caption && <span>{caption}</span>}
          {meta && <span className="plate-meta">{meta}</span>}
        </figcaption>
      )}
    </figure>
  )
}
