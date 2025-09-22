/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: '#0B0C0E',
        foreground: '#FFFFFF',
        surface: '#111316',
        panel: '#14171B',
        border: '#262A2F',
        accent: '#0A84FF',
        success: '#34C759',
        warning: '#FFD60A',
        danger: '#FF453A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#8E8E93',
        'text-muted': '#636366',
        primary: {
          DEFAULT: '#0A84FF',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#111316',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#636366',
          foreground: '#8E8E93',
        },
        card: {
          DEFAULT: '#111316',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      keyframes: {
        'slide-in-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-out-down': {
          from: { opacity: '1', transform: 'translateY(0)' },
          to: { opacity: '0', transform: 'translateY(8px)' },
        },
      },
      animation: {
        'slide-in': 'slide-in-up 0.2s ease-out',
        'slide-out': 'slide-out-down 0.2s ease-in',
      },
    },
  },
  plugins: [],
}
