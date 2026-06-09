import { defineConfig } from 'vitepress'

const enNav = [
  { text: 'Launch App ↗', link: 'https://gradlab.app' }
]

const zhNav = [
  { text: '打开应用 ↗', link: 'https://gradlab.app' }
]

const enSidebar = [
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
]

const zhSidebar = [
  {
    text: '开始使用',
    items: [
      { text: '介绍', link: '/zh/' },
      { text: '快速上手', link: '/zh/quickstart' }
    ]
  },
  {
    text: '功能',
    items: [
      { text: '调色板', link: '/zh/features/palette' },
      { text: '形态与流动', link: '/zh/features/shape-flow' },
      { text: '后期处理', link: '/zh/features/post-processing' },
      { text: '半调', link: '/zh/features/halftone' },
      { text: 'ASCII 字符矩阵', link: '/zh/features/ascii-matrix' },
      { text: '导出', link: '/zh/features/export' }
    ]
  },
  {
    text: '帮助',
    items: [
      { text: '常见问题', link: '/zh/faq' }
    ]
  }
]

export default defineConfig({
  title: 'GradLab',
  cleanUrls: true,

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      description: 'WebGL gradient engine with OKLab color science, 13 fluid algorithms, halftone rendering, and interactive ASCII matrix.',
      head: [
        ['meta', { property: 'og:title', content: 'GradLab Docs' }],
        ['meta', { property: 'og:description', content: 'Free WebGL gradient generator — OKLab color science, 13 algorithms, halftone, ASCII matrix, PNG and MP4 export.' }],
      ],
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        footer: {
          message: '<a href="https://gradlab.app" target="_blank">Launch App ↗</a>',
          copyright: `© ${new Date().getFullYear()} GradLab`
        },
        outlineTitle: 'On this page',
        docFooter: { prev: 'Previous', next: 'Next' },
      }
    },
    zh: {
      label: '中文',
      lang: 'zh-CN',
      description: 'GradLab — 基于 WebGL 的流体渐变生成工具，支持 OKLab 色彩科学、13 种流动算法、半调效果、ASCII 字符矩阵及多格式导出。',
      head: [
        ['meta', { property: 'og:title', content: 'GradLab 文档' }],
        ['meta', { property: 'og:description', content: '免费在线 WebGL 渐变生成器 — OKLab 色彩空间、13 种算法、半调、ASCII 矩阵，支持 PNG 和 MP4 导出。' }],
      ],
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
        footer: {
          message: '<a href="https://gradlab.app" target="_blank">打开应用 ↗</a>',
          copyright: `© ${new Date().getFullYear()} GradLab`
        },
        outlineTitle: '本页目录',
        docFooter: { prev: '上一页', next: '下一页' },
        darkModeSwitchLabel: '主题',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        langMenuLabel: '切换语言',
      }
    }
  },

  themeConfig: {
    siteTitle: 'GradLab',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Super-bob3/GradLab' }
    ],
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
              modal: {
                noResultsText: '无搜索结果',
                resetButtonTitle: '清除',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
              }
            }
          }
        }
      }
    }
  }
})
