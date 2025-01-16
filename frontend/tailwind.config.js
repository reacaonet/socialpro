/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // azul
          dark: '#2563EB',
          light: '#60A5FA'
        },
        secondary: {
          DEFAULT: '#10B981', // verde
          dark: '#059669',
          light: '#34D399'
        },
        accent: {
          DEFAULT: '#8B5CF6', // roxo
          dark: '#7C3AED',
          light: '#A78BFA'
        },
        background: {
          DEFAULT: '#F3F4F6',
          dark: '#E5E7EB',
          light: '#F9FAFB'
        }
      }
    },
  },
  plugins: [],
}
