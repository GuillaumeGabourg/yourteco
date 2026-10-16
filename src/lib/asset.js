/** Chemin d'un fichier de public/ ("/img/...") préfixé par la base du site (racine en local, /yourteco/ sur GitHub Pages). */
export const asset = (p) => (p && p.startsWith('/') && !p.startsWith('//') ? import.meta.env.BASE_URL + p.slice(1) : p)
