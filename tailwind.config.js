/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#080C10',
          secondary: '#0D1117',
          tertiary: '#161B22',
        },
        border: {
          DEFAULT: '#21262D',
          accent: '#30363D',
        },
        text: {
          primary: '#E6EDF3',
          secondary: '#8B949E',
          muted: '#484F58',
        },
        accent: {
          DEFAULT: '#00D4AA',
          glow: 'rgba(0,212,170,0.15)',
          secondary: '#1F6FEB',
        },
        danger: '#F85149',
        warning: '#D29922',
        success: '#3FB950',
      },
    },
  },
  plugins: [],
}
