import DefaultTheme from 'vitepress/theme'
import { inject } from '@vercel/analytics'
import { defineComponent, h } from 'vue'
import { useData } from 'vitepress'
import HomeLayout from './HomeLayout.vue'
import './custom.css'

const Layout = defineComponent({
  name: 'Layout',
  setup() {
    const { frontmatter } = useData()
    return () => {
      if (frontmatter.value.layout === 'home') {
        return h(HomeLayout)
      }
      return h(DefaultTheme.Layout)
    }
  },
})

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp() {
    if (typeof window !== 'undefined') {
      inject()
    }
  },
}
