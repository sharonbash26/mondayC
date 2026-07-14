/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        monday: {
          bg: '#f6f7fb',
          purple: '#6161ff',
          text: '#323338',
          muted: '#676879',
          border: '#e6e9ef',
        },
        status: {
          backlog: '#c4c4c4',
          progress: '#fdab3d',
          done: '#00c875',
        },
        prio: {
          low: '#00c875',
          medium: '#579bfc',
          high: '#fdab3d',
          urgent: '#e2445c',
        },
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.06)',
        modal: '0 12px 40px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
}
