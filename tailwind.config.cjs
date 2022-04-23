module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      'sans': ['Montserrat', 'sans-serif'],
      'body': ['Montserrat', 'sans-serif'],
      'serif': ['Cooper Black', 'serif']
    },
    extend: {
      colors: {
        'background': '#FFEDED',
        'accent': '#FF00E4',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
