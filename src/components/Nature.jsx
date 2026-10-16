import { useMemo, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useInView, useMotionValue, useSpring } from 'motion/react'

/* Générateur pseudo-aléatoire stable (mêmes feuilles à chaque rendu) */
function rng(seed) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

/** Feuille : forme vectorielle exacte (amande + nervure). */
export function LeafShape({ color = 'currentColor', vein = 'rgba(255,255,255,.45)' }) {
  return (
    <svg viewBox="-10 -14 20 28" aria-hidden="true">
      <path d="M0 -13 C 8 -7 8 6 0 13 C -8 6 -8 -7 0 -13 Z" fill={color} />
      <path d="M0 -11 L0 12" stroke={vein} strokeWidth="1" fill="none" />
    </svg>
  )
}

/** Rayons du logo : éventail de lumière qui respire lentement. */
export function SunRays({ className = '', rays = 13 }) {
  const reduce = useReducedMotion()
  const paths = useMemo(() => {
    const out = []
    const cx = 500, cy = 500, r = 520
    for (let i = 0; i < rays; i++) {
      const a0 = Math.PI + (i / rays) * Math.PI
      const a1 = Math.PI + ((i + 0.55) / rays) * Math.PI
      const p = (a) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`
      out.push(`M${cx} ${cy} L${p(a0)} L${p(a1)} Z`)
    }
    return out
  }, [rays])
  return (
    <svg className={'sun-rays ' + className} viewBox="0 0 1000 520" aria-hidden="true">
      <defs>
        <radialGradient id="ray-fade" cx="500" cy="500" r="520" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F4F1A0" stopOpacity=".95" />
          <stop offset=".55" stopColor="#DBD73A" stopOpacity=".45" />
          <stop offset="1" stopColor="#DBD73A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.g
        style={{ transformOrigin: '500px 500px' }}
        animate={reduce ? undefined : { rotate: [-3, 3, -3] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      >
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="url(#ray-fade)"
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? { opacity: 0.7 } : { opacity: [0.35, 0.85, 0.35] }}
            transition={{ duration: 6 + (i % 4), repeat: Infinity, delay: 0.4 + i * 0.18, ease: 'easeInOut' }}
          />
        ))}
      </motion.g>
    </svg>
  )
}

/** Feuilles qui tombent en se balançant (CSS pur, coupé si mouvement réduit). */
export function FallingLeaves({ count = 9, seed = 7, className = '' }) {
  const leaves = useMemo(() => {
    const r = rng(seed)
    const colors = ['#6AA33A', '#A8CB7C', '#DBD73A', '#386234']
    return Array.from({ length: count }, (_, i) => ({
      left: 4 + r() * 92,
      size: 14 + r() * 16,
      dur: 14 + r() * 12,
      delay: -r() * 26,
      sway: 30 + r() * 60,
      spin: (r() > 0.5 ? 1 : -1) * (160 + r() * 260),
      color: colors[i % colors.length],
    }))
  }, [count, seed])
  return (
    <div className={'leaves ' + className} aria-hidden="true">
      {leaves.map((l, i) => (
        <span
          key={i}
          className="leaf-fall"
          style={{ left: l.left + '%', '--dur': l.dur + 's', '--delay': l.delay + 's', '--sway': l.sway + 'px', '--spin': l.spin + 'deg', width: l.size, height: l.size * 1.4 }}
        >
          <span className="leaf-sway"><LeafShape color={l.color} /></span>
        </span>
      ))}
    </div>
  )
}

/** Collines superposées (les trois verts du logo) + herbes qui ondulent.
 *  `to` = couleur de la section suivante (dernière couche). */
export function Hills({ to = 'var(--bg)', back = 'var(--leaf)', mid = 'var(--green-600)', grass = true, className = '', seed = 3 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yBack = useTransform(scrollYProgress, [0, 1], [18, -10])
  const yMid = useTransform(scrollYProgress, [0, 1], [10, -4])
  const blades = useMemo(() => {
    const r = rng(seed)
    return Array.from({ length: 46 }, (_, i) => {
      const x = (i / 45) * 1440 + (r() - 0.5) * 20
      // hauteur de la colline avant à cet x (même courbe que le path)
      const y = 86 - 14 * Math.sin((x / 1440) * Math.PI * 2 + 0.6)
      const h = 10 + r() * 16
      const lean = (r() - 0.5) * 8
      return { x, y, h, lean, d: 2.6 + r() * 2.2, delay: -r() * 4 }
    })
  }, [seed])
  const wave = (base, amp, phase, bottom = 120) => {
    let d = `M0 ${bottom} L0 ${base}`
    for (let x = 0; x <= 1440; x += 40) d += ` L${x} ${(base - amp * Math.sin((x / 1440) * Math.PI * 2 + phase)).toFixed(1)}`
    return d + ` L1440 ${bottom} Z`
  }
  return (
    <div ref={ref} className={'hills ' + className} aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <motion.path d={wave(54, 22, 2.2)} fill={back} style={reduce ? undefined : { y: yBack }} opacity=".55" />
        <motion.path d={wave(70, 18, 4.1)} fill={mid} style={reduce ? undefined : { y: yMid }} opacity=".8" />
        <path d={wave(86, 14, 0.6, 175)} fill={to} />
        {grass && blades.map((b, i) => (
          <path
            key={i}
            className="blade"
            d={`M${b.x - 2} ${b.y + 2} Q${b.x + b.lean / 2} ${b.y - b.h / 2} ${b.x + b.lean} ${b.y - b.h} Q${b.x + 1} ${b.y - b.h / 2} ${b.x + 2} ${b.y + 2} Z`}
            fill={to}
            style={{ '--d': b.d + 's', '--delay': b.delay + 's' }}
          />
        ))}
      </svg>
    </div>
  )
}

/** Cernes d'arbre qui se dessinent à l'arrivée. */
export function TreeRings({ rings = 6, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  return (
    <svg ref={ref} className={'rings ' + className} viewBox="0 0 200 200" aria-hidden="true">
      {Array.from({ length: rings }, (_, i) => {
        const r = 14 + i * 14 + (i % 2) * 3
        return (
          <motion.ellipse
            key={i}
            cx={100 + (i % 3) - 1}
            cy={100 + ((i + 1) % 2)}
            rx={r}
            ry={r * 0.94}
            fill="none"
            stroke="currentColor"
            strokeWidth={i === rings - 1 ? 2.2 : 1.2}
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={inView || reduce ? { pathLength: 1, opacity: 1 } : undefined}
            transition={{ duration: 1.4, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          />
        )
      })}
    </svg>
  )
}

/** Tache de lumière (soleil à travers les feuilles) qui suit le pointeur. */
export function Dapple({ className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(70), y = useMotionValue(20)
  const sx = useSpring(x, { stiffness: 40, damping: 18 })
  const sy = useSpring(y, { stiffness: 40, damping: 18 })
  useEffect(() => {
    const el = ref.current?.parentElement
    if (!el || reduce) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      x.set(((e.clientX - r.left) / r.width) * 100)
      y.set(((e.clientY - r.top) / r.height) * 100)
    }
    el.addEventListener('pointermove', move)
    return () => el.removeEventListener('pointermove', move)
  }, [reduce, x, y])
  const bg = useTransform([sx, sy], ([a, b]) => `radial-gradient(520px circle at ${a}% ${b}%, rgba(219,215,58,.16), rgba(106,163,58,.07) 40%, transparent 70%)`)
  return <motion.div ref={ref} className={'dapple ' + className} style={{ background: bg }} aria-hidden="true" />
}

/** Tige qui pousse avec le défilement (frise des étapes). */
export function GrowingStem({ progress, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <svg className={'stem ' + className} viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 20 C 120 4, 220 36, 333 20 S 560 4, 666 20 S 880 36, 1000 20" className="stem-bg" />
      <motion.path
        d="M0 20 C 120 4, 220 36, 333 20 S 560 4, 666 20 S 880 36, 1000 20"
        className="stem-fg"
        style={reduce ? undefined : { pathLength: progress }}
      />
    </svg>
  )
}
