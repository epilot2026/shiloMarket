/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1FA84D',
          dark: '#178A40',
          light: '#E6F4EA',
        },
        certified: '#7C3AED',
        loc: '#2563EB',
        live: '#E03131',
        ink: '#1A1A1A',
        muted: '#6B7280',
        soft: '#F2F3F5',
        line: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        feed: '680px',
        content: '720px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(16,24,40,0.08), 0 1px 2px rgba(16,24,40,0.04)',
        fab: '0 6px 16px rgba(31,168,77,0.4)',
      },
    },
  },
  plugins: [],
}
