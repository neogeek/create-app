module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'security'],
  extends: [
    'next',
    'turbo',
    'prettier',
    'eslint:recommended',
    'next/core-web-vitals',
    'plugin:security/recommended',
  ],
  rules: {
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@next/next/no-html-link-for-pages': 'off',
  },
};
