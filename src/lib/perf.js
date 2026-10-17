/* Niveau de performance de l'appareil, posé sur <html data-perf="high|low">.
 * « low » = mode léger : défilement natif, pas de graines ni d'effets décoratifs continus.
 * Détection : peu de cœurs ou de mémoire, économiseur de données, ou défilement mesuré trop lent (< ~30 images/s).
 * Forçable pour les tests avec ?perf=low ou ?perf=high (mémorisé pour la visite). */
import { useSyncExternalStore } from 'react'

const KEY = 'ytc-perf'
const root = document.documentElement
const subs = new Set()
let forced = false // niveau imposé par ?perf= : pas de sonde

function initial() {
  try {
    const q = new URLSearchParams(location.search).get('perf')
    if (q === 'low' || q === 'high') { sessionStorage.setItem(KEY, q); forced = true; return q }
    const s = sessionStorage.getItem(KEY)
    if (s === 'low' || s === 'high') return s
  } catch { /* stockage indisponible : détection à chaque visite */ }
  const n = navigator
  if (n.connection?.saveData) return 'low'
  if ((n.deviceMemory && n.deviceMemory <= 4) || (n.hardwareConcurrency && n.hardwareConcurrency <= 4)) return 'low'
  return 'high'
}

let level = initial()
root.dataset.perf = level

function setLevel(l) {
  if (l === level) return
  level = l
  root.dataset.perf = l
  try { sessionStorage.setItem(KEY, l) } catch { /* idem */ }
  subs.forEach((f) => f())
}

export const isLowPerf = () => level === 'low'
export function onPerfChange(fn) { subs.add(fn); return () => subs.delete(fn) }
export const usePerfLevel = () => useSyncExternalStore(onPerfChange, () => level)

/* Sonde de fluidité : pendant les premiers défilements, médiane du temps entre deux images.
 * Au-delà de 34 ms (moins de ~30 images/s) sur 45 images, on passe en mode léger. */
if (level === 'high' && !forced) {
  let frames = [], last = 0, raf = 0, stopAt = 0, checks = 0
  const tick = (t) => {
    if (last) frames.push(t - last)
    last = t
    if (frames.length >= 45) {
      const med = frames.sort((a, b) => a - b)[22]
      frames = []
      if (med > 34) setLevel('low')
      if (++checks >= 4 || level === 'low') { window.removeEventListener('scroll', onScroll); raf = 0; return }
    }
    raf = performance.now() < stopAt ? requestAnimationFrame(tick) : 0
    if (!raf) { last = 0; frames = [] }
  }
  const onScroll = () => {
    if (document.hidden) return
    stopAt = performance.now() + 250
    if (!raf) raf = requestAnimationFrame(tick)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
}

/* Effets décoratifs en boucle : ils ne tournent que lorsqu'ils sont à l'écran (data-live). */
const LIVE = '.hills, .leaves, .sun-rays, .marquee, .yurt-svg, .video-play, .dapple'
const io = new IntersectionObserver((entries) => {
  for (const e of entries) e.target.toggleAttribute('data-live', e.isIntersecting)
}, { rootMargin: '120px 0px' })
const watch = (node) => {
  if (node.nodeType !== 1) return
  if (node.matches(LIVE)) io.observe(node)
  node.querySelectorAll(LIVE).forEach((el) => io.observe(el))
}
const unwatch = (node) => {
  if (node.nodeType !== 1) return
  if (node.matches(LIVE)) io.unobserve(node)
  node.querySelectorAll(LIVE).forEach((el) => io.unobserve(el))
}
new MutationObserver((list) => list.forEach((m) => { m.addedNodes.forEach(watch); m.removedNodes.forEach(unwatch) }))
  .observe(root, { childList: true, subtree: true })
