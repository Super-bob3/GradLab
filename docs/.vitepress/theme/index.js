import DefaultTheme from 'vitepress/theme'
import { inject } from '@vercel/analytics'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp() {
    if (typeof window !== 'undefined') {
      inject()
    }
  }
}
