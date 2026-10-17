import { motion, useReducedMotion } from 'motion/react'
import Icon from './Icon.jsx'
import { asset } from '../lib/asset.js'
import VARIANTS from '../content/imageVariants.json'
import DIMS from '../content/imageDims.json'

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

/** Photo arrondie : ouverture douce à l'arrivée.
 *  Toujours au format réel de l'image quand il est connu (jamais rognée) ; pas de parallaxe,
 *  qui agrandit la photo et en coupe les bords. `ratio` ne sert que si le format est inconnu. */
export function Plate({ src, alt, caption, meta, ratio: fallback = '3 / 2', tag, className = '', priority = false, sizes, reveal = true, style }) {
  const reduce = useReducedMotion()
  const dims = DIMS[src]
  const ratio = dims ? `${dims[0]} / ${dims[1]}` : fallback
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
          src={asset(src)}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          srcSet={srcSetOf(src)}
          sizes={srcSetOf(src) ? sizes || '(max-width: 760px) 100vw, 55vw' : undefined}
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
