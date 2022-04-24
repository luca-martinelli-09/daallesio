module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      'sans': ['Montserrat', 'sans-serif'],
      'body': ['Montserrat', 'sans-serif'],
      'serif': ['cooper-black-std', 'serif']
    },
    extend: {
      colors: {
        'background': '#FFF0F5',
        'accent': '#FA26A0',
        'accent-dark': '#381460',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
