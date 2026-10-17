// Textes de l'interface (bandeau, menu, pied de page) dans les trois langues du site.
// Les traductions anglaises et allemandes sont nouvelles : à faire valider par Yourteco (docs/reformulations.md).
import { OTHER_PAGES } from './menu.js'

export const UI = {
  fr: {
    langName: 'Français', langLabel: 'Langue', home: '/',
    quote: 'Demander un devis', quoteShort: 'Devis', call: 'Appeler le',
    shop: 'Voir la boutique Yourteco', shopShort: 'Boutique',
    themeLight: 'Passer au thème clair', themeDark: 'Passer au thème sombre', themeLabel: 'Thème clair ou sombre',
    menuOpen: 'Ouvrir le menu', menuClose: 'Fermer le menu', nav: 'Navigation principale', homeLabel: 'Accueil',
    claim: 'Yourteco, votre fabricant de yourtes',
    about: "Yourteco est un fabricant de yourtes contemporaines français localisé dans le Maine-et-Loire. Nous construisons dans toute la France et à l'étranger.",
    findUs: 'Nous trouver', otherLinks: 'Autres liens', pagesTitle: 'Nos pages', socials: 'Réseaux sociaux',
    stripe: 'Vos transactions bancaires sur la Boutique Yourteco sont protégées par le référent Stripe.',
    copy: '© 2026 Yourteco. Maquette de démonstration, non publiée.',
  },
  en: {
    langName: 'English', langLabel: 'Language', home: '/buying-a-yurt/',
    quote: 'Request a quote', quoteShort: 'Quote', call: 'Call',
    shop: 'Visit the Yourteco shop', shopShort: 'Shop',
    themeLight: 'Switch to light theme', themeDark: 'Switch to dark theme', themeLabel: 'Light or dark theme',
    menuOpen: 'Open menu', menuClose: 'Close menu', nav: 'Main navigation', homeLabel: 'Home',
    claim: 'Yourteco, your yurt manufacturer',
    about: 'Yourteco is a French manufacturer of contemporary yurts based in Maine-et-Loire. We build throughout France and abroad.',
    findUs: 'Find us', otherLinks: 'Other links', pagesTitle: 'Our pages', socials: 'Social networks',
    stripe: 'Your payments on the Yourteco Shop are secured by Stripe.',
    copy: '© 2026 Yourteco. Demonstration mock-up, not published.',
  },
  de: {
    langName: 'Deutsch', langLabel: 'Sprache', home: '/jurte-kaufen/',
    quote: 'Angebot anfordern', quoteShort: 'Angebot', call: 'Anrufen:',
    shop: 'Zum Yourteco-Shop', shopShort: 'Shop',
    themeLight: 'Zum hellen Design wechseln', themeDark: 'Zum dunklen Design wechseln', themeLabel: 'Helles oder dunkles Design',
    menuOpen: 'Menü öffnen', menuClose: 'Menü schließen', nav: 'Hauptnavigation', homeLabel: 'Startseite',
    claim: 'Yourteco, Ihr Jurtenhersteller',
    about: 'Yourteco ist ein französischer Hersteller moderner Jurten mit Sitz im Département Maine-et-Loire. Wir bauen in ganz Frankreich und im Ausland.',
    findUs: 'So finden Sie uns', otherLinks: 'Weitere Links', pagesTitle: 'Unsere Seiten', socials: 'Soziale Netzwerke',
    stripe: 'Ihre Zahlungen im Yourteco-Shop sind durch Stripe geschützt.',
    copy: '© 2026 Yourteco. Demonstrationsentwurf, nicht veröffentlicht.',
  },
}

export const LANGS = ['fr', 'en', 'de']

/** Langue d'une adresse : anglais ou allemand pour les pages traduites, français sinon. */
export const langOf = (pathname) => OTHER_PAGES.find((g) => g.links.some((l) => l.href === pathname))?.lang || 'fr'

/** Pages d'une langue étrangère (menu et pied de page anglais / allemand). */
export const pagesOf = (lang) => OTHER_PAGES.find((g) => g.lang === lang)?.links || []
