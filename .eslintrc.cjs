// .eslintrc.cjs
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'no-extra-semi': ['error'],
    //'no-console': ['warn'],
    '@typescript-eslint/no-explicit-any': 'off',
    'prefer-const': ['error'],
    'max-len': 'off',
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
      env: {
        node: true, // ← Ensures 'module' is defined
        es2021: true,
      },
      extends: ['plugin:node/recommended'],
      rules: {
        'node/no-unpublished-import': 'off',
        'node/no-missing-import': 'off',
        'node/no-unsupported-features/es-syntax': 'off', // ← Optional: Disable if not needed
        'no-restricted-imports': ['off', { patterns: ['*.ts'] }],
      },
    },
  ],
}
