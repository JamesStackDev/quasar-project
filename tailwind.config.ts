import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class', 'body.body--dark'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '0px',
      sm: '600px',
      md: '1200px',
      lg: '1440px',
      xl: '1920px',
    },

    extend: {
      colors: {
        primary: 'var(--app-primary)',
        secondary: 'var(--app-secondary)',
        background: 'var(--app-background)',
        surface: 'var(--app-surface)',
        text: 'var(--app-text)',
        'text-secondary': 'var(--app-text-secondary)',
        border: 'var(--app-border)',
        link: 'var(--app-link)',
        positive: '#21ba45',
        negative: '#c10015',
        info: '#31ccec',
        warning: '#f2c037',
      },
    },
  },
} satisfies Config;
