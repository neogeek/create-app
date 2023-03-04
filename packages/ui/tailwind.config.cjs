/** @type {import('tailwindcss').Config} */
const tailwindcssConfig = {
  content: ['**/*.tsx'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};

module.exports = tailwindcssConfig;
