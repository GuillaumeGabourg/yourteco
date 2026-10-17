import { motion, useReducedMotion } from 'motion/react'
import Icon from './Icon.jsx'
import { asset } from '../lib/asset.js'
import VARIANTS from '../content/imageVariants.json'

/* grandes photos : une version 800 px (.800.webp) est servie aux écrans qui n'ont pas besoin de la pleine taille */
const srcSetOf = (src) => (VARIANTS[src] ? `${asset(src.replace(/\.webp$/, '.800.webp'))} 800w, ${asset(src)} ${VARIANTS[src]}w` : undefined)

/** Pastille (soleil du logo) posée sur une photo. */
export function Tag({ children, className = '' }) {
  return (
    <span className={'tag ' + className}>
      <Icon name="leaf" size={15} />
      <span>{children}</span>
    </span>
  )
}

/** Photo arrondie : ouverture douce à l'arrivée + léger parallaxe.
 *  Parallaxe en CSS (animation liée au défilement, calculée par le navigateur) : aucun calcul JavaScript par image. */
export function Plate({ src, alt, caption, meta, ratio = '3 / 2', tag, parallax = 0, className = '', priority = false, sizes, reveal = true, style }) {
  const reduce = useReducedMotion()
  const open = reveal && !reduce && !priority
  return (
    <figure className={'plate ' + className} style={style}>
      <motion.div
        className="plate-frame"
        style={{ aspectRatio: ratio }}
        initial={open ? { clipPath: 'inset(10% 8% 10% 8% round 22px)' } : false}
        whileInView={open ? { clipPath: 'inset(0% 0% 0% 0% round 22px)' } : undefined}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          className={parallax ? 'px' : undefined}
          src={asset(src)}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          srcSet={srcSetOf(src)}
          sizes={srcSetOf(src) ? sizes || '(max-width: 760px) 100vw, 55vw' : undefined}
          style={parallax ? { '--px': parallax } : undefined}
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
