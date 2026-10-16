import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Lenis from 'lenis'

const SmoothCtx = createContext({ lenis: null, scrollToId: () => {} })
export const useSmooth = () => useContext(SmoothCtx)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Hauteur réelle de la barre fixe (bordure comprise), jamais le menu mobile ouvert. */
export function barHeight() {
  const bar = document.getElementById('site-bar')
  return bar ? bar.getBoundingClientRect().height : 0
}

export function SmoothProvider({ children }) {
  const [lenis, setLenis] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const first = useRef(true)

  // Lenis (désactivé si mouvement réduit)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const l = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true })
    let raf
    const loop = (time) => { l.raf(time); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    setLenis(l)
    window.__lenis = l
    return () => { cancelAnimationFrame(raf); l.destroy(); window.__lenis = null }
  }, [])

  // --bar-h = hauteur mesurée de la barre
  useEffect(() => {
    const bar = document.getElementById('site-bar')
    if (!bar) return
    const set = () => document.documentElement.style.setProperty('--bar-h', barHeight() + 'px')
    set()
    const ro = new ResizeObserver(set)
    ro.observe(bar)
    return () => ro.disconnect()
  }, [])

  const scrollToId = useCallback((id, { immediate = false } = {}) => {
    const el = document.getElementById(id)
    if (!el) return false
    const top = el.getBoundingClientRect().top + window.scrollY - barHeight()
    lenis?.start() // le menu mobile ouvert met Lenis en pause
    if (lenis && !immediate) {
      lenis.scrollTo(top, { duration: 1.1 })
    } else {
      window.scrollTo({ top, behavior: 'instant' })
      lenis?.scrollTo(top, { immediate: true })
    }
    return true
  }, [lenis])

  // Liens de même page : défilement à section.top - hauteur de la barre
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest('a[href]')
      if (!a || a.target === '_blank') return
      const url = new URL(a.getAttribute('href'), window.location.href)
      if (url.origin !== window.location.origin || !url.hash) return
      const id = decodeURIComponent(url.hash.slice(1))
      e.preventDefault()
      const menuWasOpen = document.documentElement.classList.contains('menu-open')
      window.dispatchEvent(new Event('ytc:navclick')) // referme le menu mobile
      if (url.pathname === window.location.pathname) {
        history.replaceState(null, '', url.pathname + url.hash)
        // menu ouvert : attendre sa fermeture (Lenis relancé, défilement débloqué)
        if (menuWasOpen) setTimeout(() => scrollToId(id), 80)
        else scrollToId(id)
      } else {
        navigate(url.pathname + url.hash)
      }
    }
    // phase de capture : passe avant le <Link> de React Router
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [navigate, scrollToId])

  // Changement de page : haut de page, ou arrivée sur un #hash depuis une autre page
  useEffect(() => {
    const id = location.hash ? decodeURIComponent(location.hash.slice(1)) : null
    if (!id) {
      if (!first.current) { window.scrollTo({ top: 0, behavior: 'instant' }); lenis?.scrollTo(0, { immediate: true }) }
      first.current = false
      return
    }
    first.current = false
    // attendre le rendu (images avec dimensions fixées) puis corriger une seconde fois
    let tries = 0
    const go = () => {
      if (!scrollToId(id, { immediate: true }) && tries++ < 20) return setTimeout(go, 50)
      setTimeout(() => scrollToId(id, { immediate: true }), 350)
    }
    requestAnimationFrame(go)
  }, [location.pathname, location.hash, lenis, scrollToId])

  return <SmoothCtx.Provider value={{ lenis, scrollToId }}>{children}</SmoothCtx.Provider>
}
