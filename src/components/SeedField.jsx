import { useEffect, useRef } from 'react'
import { isLowPerf, onPerfChange } from '../lib/perf.js'

/** Fond vivant : graines de pissenlit qui flottent et s'écartent au passage de la souris (souffle).
 *  Canvas fixe, 30 images/s au plus, en pause quand la souris ne bouge plus (4 s) ou si l'onglet est caché ;
 *  image fixe si mouvement réduit ; absent en mode léger (appareil peu puissant). */
export default function SeedField() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const colors = ['56, 98, 52', '106, 163, 58', '150, 146, 30']
    const colorsDark = ['190, 222, 160', '219, 215, 58', '150, 200, 110']
    const isDark = () => document.documentElement.dataset.theme === 'dark'
    let w = 0, h = 0, dpr = 1, seeds = [], raf = 0, last = 0, awakeUntil = performance.now() + 4000
    const IDLE = 4000, FRAME = 32 // ms : pause après 4 s sans mouvement, ~30 images/s
    const mouse = { x: -999, y: -999, vx: 0, vy: 0, t: 0 }

    const make = (anywhere) => {
      const s = 0.7 + Math.random() * 0.7
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 30,
        vx: 0, vy: 0,
        s, a: Math.random() * Math.PI * 2, spin: 0,
        ph: Math.random() * 100,
        ci: Math.floor(Math.random() * colors.length),
        o: 0.16 + Math.random() * 0.16,
      }
    }
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth; h = window.innerHeight
      cv.width = w * dpr; cv.height = h * dpr
      cv.style.width = w + 'px'; cv.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round(Math.min(14, Math.max(8, (w * h) / 80000)))
      while (seeds.length < n) seeds.push(make(true))
      seeds.length = n
      if (!raf) { pal = isDark() ? colorsDark : colors; seeds.forEach(draw) } // redimensionné à l'arrêt : on redessine
    }
    let pal = colors
    const draw = (p) => {
      p.c = pal[p.ci]
      const len = 13 * p.s
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.a)
      ctx.strokeStyle = `rgba(${p.c}, ${p.o})`
      ctx.fillStyle = `rgba(${p.c}, ${p.o + 0.15})`
      ctx.lineWidth = 0.9
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, len); ctx.stroke() // tige
      ctx.beginPath(); ctx.ellipse(0, len + 1.6 * p.s, 1.1 * p.s, 2 * p.s, 0, 0, Math.PI * 2); ctx.fill() // akène
      ctx.beginPath() // aigrette
      for (let i = 0; i < 9; i++) {
        const ang = -Math.PI / 2 + (i - 4) * 0.3
        const r = 7.5 * p.s
        ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r)
      }
      ctx.stroke()
      ctx.restore()
    }
    const step = (t) => {
      if (last && t - last < FRAME) { raf = requestAnimationFrame(step); return }
      const dt = Math.min(50, t - (last || t)) / 16.7
      last = t
      ctx.clearRect(0, 0, w, h)
      pal = isDark() ? colorsDark : colors
      const gust = Math.hypot(mouse.vx, mouse.vy)
      for (const p of seeds) {
        // dérive : légère brise vers le haut et la droite, ondulation
        p.ph += 0.01 * dt
        let ax = 0.012 + Math.sin(p.ph) * 0.01
        let ay = -0.018 - Math.cos(p.ph * 0.7) * 0.008
        // souffle de la souris
        const dx = p.x - mouse.x, dy = p.y - mouse.y
        const d = Math.hypot(dx, dy)
        if (d < 150 && d > 0.1) {
          const f = (1 - d / 150) * (0.25 + Math.min(gust, 40) * 0.03)
          ax += (dx / d) * f + mouse.vx * 0.004 * (1 - d / 150)
          ay += (dy / d) * f + mouse.vy * 0.004 * (1 - d / 150)
        }
        p.vx = (p.vx + ax * dt) * 0.94
        p.vy = (p.vy + ay * dt) * 0.94
        p.x += p.vx * dt; p.y += p.vy * dt
        p.spin += (p.vx * 0.02 - p.spin * 0.05) * dt
        p.a = Math.sin(p.ph * 0.8) * 0.35 + p.spin
        if (p.y < -40 || p.x > w + 40 || p.x < -40) Object.assign(p, make(false), { x: Math.random() * w })
        draw(p)
      }
      mouse.vx *= 0.9; mouse.vy *= 0.9
      raf = t < awakeUntil ? requestAnimationFrame(step) : 0
    }
    const wake = () => {
      awakeUntil = performance.now() + IDLE
      if (!raf && !document.hidden && !isLowPerf()) { last = 0; raf = requestAnimationFrame(step) }
    }
    const onMove = (e) => {
      if (mouse.x > -900) { mouse.vx = e.clientX - mouse.x; mouse.vy = e.clientY - mouse.y }
      mouse.x = e.clientX; mouse.y = e.clientY
      wake()
    }
    const onLeave = () => { mouse.x = mouse.y = -999 }
    const onVis = () => {
      cancelAnimationFrame(raf); raf = 0
      if (!document.hidden && !reduce) wake()
    }
    const offPerf = onPerfChange(() => { if (isLowPerf()) { cancelAnimationFrame(raf); raf = 0; ctx.clearRect(0, 0, w, h) } })
    resize()
    window.addEventListener('resize', resize)
    if (reduce) { seeds.forEach(draw) } else {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerleave', onLeave)
      document.addEventListener('visibilitychange', onVis)
      if (!isLowPerf()) raf = requestAnimationFrame(step)
    }
    return () => {
      cancelAnimationFrame(raf)
      offPerf()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])
  return <canvas ref={ref} className="seed-field" aria-hidden="true" />
}
