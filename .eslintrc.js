const prettierConfig = require('./prettier.config');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['react-hooks', 'prettier', 'jest'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'global-require': 0,
    'linebreak-style': 0,
    'no-global-assign': 0,
    'no-console': 0,
    'no-unused-vars': [2, { varsIgnorePattern: 'styles' }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 0,
    'react/display-name': 0,
    'react/jsx-no-target-blank': 1,
    'prettier/prettier': ['error', prettierConfig]
  },
  ignorePatterns: ['public/**/*', 'storage/coverage/**/*']
};
