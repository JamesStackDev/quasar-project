import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
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
        primary: '#1976d2',
        secondary: '#26a69a',
        accent: '#9c27b0',
        dark: '#1d1d1d',
        'dark-page': '#121212',
        positive: '#21ba45',
        negative: '#c10015',
        info: '#31ccec',
        warning: '#f2c037',
      },
    },
  },
} satisfies Config;
