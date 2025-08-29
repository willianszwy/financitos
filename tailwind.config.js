/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Jost', 'system-ui', 'sans-serif'],
      },
      colors: {
        income: {
          primary: '#139469',
          dark: '#077552'
        },
        expense: {
          primary: '#992525',
          dark: '#700909'
        },
        investment: {
          primary: '#1f498d',
          dark: '#06173b'
        },
        priority: {
          high: '#a85959',
          medium: '#ddb56f',
          low: '#5c85c7'
        }
      }
    },
  },
  plugins: [],
}