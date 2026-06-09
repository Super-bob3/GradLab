import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'GradLab',
  description: 'WebGL gradient engine with OKLab color science, 13 fluid algorithms, halftone rendering, and interactive ASCII matrix.',
  cleanUrls: true,
  head: [
    ['meta', { property: 'og:title', content: 'GradLab Docs' }],
    ['meta', { property: 'og:description', content: 'Documentation for GradLab, a browser-based WebGL gradient tool.' }],
  ],
  themeConfig: {
    siteTitle: 'GradLab',
    nav: [
      { text: 'Launch App ↗', link: 'https://gradlab.app' }
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Quick Start', link: '/quickstart' }
        ]
      },
      {
        text: 'Features',
        items: [
          { text: 'Palette', link: '/features/palette' },
          { text: 'Shape & Flow', link: '/features/shape-flow' },
          { text: 'Post-Processing', link: '/features/post-processing' },
          { text: 'Halftone', link: '/features/halftone' },
          { text: 'ASCII Matrix', link: '/features/ascii-matrix' },
          { text: 'Export', link: '/features/export' }
        ]
      },
      {
        text: 'Help',
        items: [
          { text: 'FAQ', link: '/faq' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Super-bob3/GradLab' }
    ],
    footer: {
      message: '<a href="https://gradlab.app" target="_blank">Launch App ↗</a>',
      copyright: `© ${new Date().getFullYear()} GradLab`
    },
    search: {
      provider: 'local'
    }
  }
})
