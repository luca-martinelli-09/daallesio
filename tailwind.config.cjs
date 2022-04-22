module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      'sans': ['Montserrat', 'sans-serif'],
      'body': ['Montserrat', 'sans-serif'],
      'serif': ['Cooper', 'serif']
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
