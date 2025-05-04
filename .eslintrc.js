// Root .eslintrc.js
export default {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'node'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended', // ← Less heavy than "recommended"
    'plugin:@typescript-eslint/recommended', // ← Only for type-aware rules
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    // Only keep essential rules
    'no-extra-semi': ['error'],
    'no-console': ['warn'],
    '@typescript-eslint/no-explicit-any': 'off', // ← Heavy rule - disable if not needed
    'prefer-const': ['error'],
  },
  overrides: [
    {
      files: ['client/src/**/*.ts?(x)'],
      rules: {
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
      },
    },
    {
      files: ['server/src/**/*.ts'],
      extends: ['plugin:node/recommended'],
      rules: {
        'node/no-unpublished-import': 'off',
        'node/no-missing-import': 'off',
      },
    },
  ],
}
