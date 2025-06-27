// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        emoji: [
          'Segoe UI Emoji',
          'Noto Color Emoji',
          'Apple Color Emoji',
          'sans-serif',
        ],
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Arial',
          'sans-serif',
          'Segoe UI Emoji',
          'Apple Color Emoji',
        ],
      },
    },
  },
  plugins: [require("daisyui")],
}
