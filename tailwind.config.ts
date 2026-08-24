import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    screens: {
      xs: '0px',
      sm: '600px',
      md: '1200px',
      lg: '1440px',
      xl: '1920px'
    }
  }
} satisfies Config


