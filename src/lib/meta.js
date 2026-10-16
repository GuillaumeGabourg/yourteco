import { useEffect } from 'react'

export function usePageMeta({ title, description, lang = 'fr' }) {
  useEffect(() => {
    if (title) document.title = title
    let m = document.querySelector('meta[name="description"]')
    if (description && m) m.setAttribute('content', description)
    document.documentElement.lang = lang
  }, [title, description, lang])
}
