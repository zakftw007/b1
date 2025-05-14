/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
          primary: '#030014',
          accent: '#AB8BFF',
          secondary: '#151312',
          light: {
            100: '#D6C6FF',
            200: '#A8B5DB',
            300: '#9CA4AB',
          },
          dark: {
            100: '#221f3d',
            200: '#0f0d23',
          },
        },
      },
    },
    plugins: [],
  }
  