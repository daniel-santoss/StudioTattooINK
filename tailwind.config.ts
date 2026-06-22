import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#d41132',
        'primary-hover': '#b00e29',
        'background-light': '#1a1a1a',
        'background-dark': '#0a0a0a',
        'surface-dark': '#161616',
        'surface-light': '#262626',
        'surface-accent': '#27272a',
        'border-dark': '#2e2e2e',
        'text-muted': '#a3a3a3',
        'text-light': '#e5e5e5',
      },
      fontFamily: {
        'display': ['var(--font-display)', 'sans-serif'],
        'body': ['var(--font-body)', 'sans-serif'],
        'tattoo': ['var(--font-tattoo)', 'cursive'],
        'inter': ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};

export default config;
