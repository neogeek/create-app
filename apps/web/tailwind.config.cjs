/** @type {import('tailwindcss').Config} */
const tailwindcssConfig = {
  content: [
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};

module.exports = tailwindcssConfig;
