import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

/** Étiquette kraft agrafée (marquage de lot). */
export function Tag({ children, className = '', tilt = -2.5 }) {
  return (
    <span className={'tag ' + className} style={{ '--tilt': tilt + 'deg' }}>
      <span className="tag-hole" aria-hidden="true" />
      <span className="tag-text">{children}</span>
    </span>
  )
}

/** Photo traitée comme une planche : cadre net + ligne de légende sous filet. */
export function Plate({ src, alt, caption, meta, ratio = '3 / 2', tag, tagTilt, parallax = 0, className = '', priority = false, sizes }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`])
  return (
    <figure ref={ref} className={'plate ' + className}>
      <div className="plate-frame" style={{ aspectRatio: ratio }}>
        <motion.img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          sizes={sizes}
          style={parallax && !reduce ? { y, scale: 1 + parallax / 50 } : undefined}
        />
        {tag && <Tag tilt={tagTilt}>{tag}</Tag>}
      </div>
      {(caption || meta) && (
        <figcaption className="plate-cap">
          {caption && <span>{caption}</span>}
          {meta && <span className="plate-meta">{meta}</span>}
        </figcaption>
      )}
    </figure>
  )
}
