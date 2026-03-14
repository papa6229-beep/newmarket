/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50:  '#FAF8F5',
          100: '#F5F0EB',
          200: '#EBE3DB',
          300: '#D5C8BA',
          400: '#BDA898',
          500: '#A08878',
          600: '#8C7060',
          700: '#6B5244',
          800: '#4A3728',
          900: '#2E2019',
        },
        accent: {
          50:  '#FEF3EE',
          100: '#FDE6D5',
          200: '#FBC9A9',
          300: '#F8A877',
          400: '#F07C50',
          500: '#C96442',
          600: '#B55539',
          700: '#9A4630',
          800: '#7C3826',
        },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
      },
      boxShadow: {
        soft:  '0 2px 12px 0 rgba(60,40,20,0.07)',
        card:  '0 1px 4px 0 rgba(60,40,20,0.08), 0 4px 16px 0 rgba(60,40,20,0.05)',
        modal: '0 8px 40px 0 rgba(40,25,10,0.18)',
      },
    },
  },
  plugins: [],
}
