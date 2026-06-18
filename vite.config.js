import { defineConfig } from 'vite'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

function sitemapLastmod() {
  return {
    name: 'sitemap-lastmod',
    closeBundle() {
      const today = new Date().toISOString().slice(0, 10)
      const path = resolve(__dirname, 'dist/sitemap.xml')
      const updated = readFileSync(path, 'utf-8')
        .replace(/<lastmod>[\d-]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`)
      writeFileSync(path, updated)
    }
  }
}

export default defineConfig({
  plugins: [sitemapLastmod()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
})
