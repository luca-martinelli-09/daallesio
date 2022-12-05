/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      'sans': ['"Noto Sans"', 'sans-serif'],
      'serif': ['Castoro', 'serif'],
    },
    extend: {
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
}
