/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './views/**/*.pug',   // Archivos Pug

  ], 
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        greenish: '#6A8E7F',
        light_blue: '#6F9CEB',
        pink: '#ED6B86',
        red: '#FF0000',
      },
    },
  },
  plugins: [],
};
