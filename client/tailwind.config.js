/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
           borderColor: ['group-hover'],
           fontFamily:{
            museo: ['MuseoModerno', 'sans-serif'],
           }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}