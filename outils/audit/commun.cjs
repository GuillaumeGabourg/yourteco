// Réglages communs aux audits : navigateur, adresse du site testé, liste des pages, dossier des rapports
const fs = require('fs')
const path = require('path')

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
// AUDIT_URL=https://guillaumegabourg.github.io/yourteco/ pour auditer le site publié
const BASE = (process.env.AUDIT_URL || 'http://127.0.0.1:4173/').replace(/\/?$/, '/')
const PAGES_DIR = path.join(__dirname, '../../src/content/pages')
const RAPPORTS = path.join(__dirname, 'rapports')
fs.mkdirSync(RAPPORTS, { recursive: true })

/** Toutes les pages : '' pour l'accueil, puis les slugs des pages de contenu. */
const slugs = ['', 'devis', 'quote', 'angebot', ...fs.readdirSync(PAGES_DIR).map((f) => f.replace('.json', '').replace(/__/g, '/'))]
const out = (f) => path.join(RAPPORTS, f)

module.exports = { CHROME, BASE, PAGES_DIR, slugs, out }
