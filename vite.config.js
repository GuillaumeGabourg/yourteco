import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// en production, le site est servi par GitHub Pages sous /yourteco/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/yourteco/' : '/',
  plugins: [react()],
  server: { host: '127.0.0.1', port: 4173, strictPort: true },
}))
