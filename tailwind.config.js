/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        command: {
          ink: '#0f172a',
          panel: '#111827',
          steel: '#334155',
          line: '#d8dee8',
          field: '#f8fafc',
          amber: '#f59e0b',
          red: '#dc2626',
          blue: '#2563eb',
          green: '#16a34a',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.10)',
      },
    },
  },
  plugins: [],
};
