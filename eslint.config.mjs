import globals from 'globals';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react,
      prettier
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': [
        'error',
        {
          semi: true,
          tabWidth: 2,
          printWidth: 100,
          singleQuote: true,
          trailingComma: 'none',
          bracketSpacing: true,
          bracketSameLine: false,
          endOfLine: 'lf'
        }
      ],
      'linebreak-style': ['error', 'unix'],
      // Added rule to allow unused parameters that start with underscore
      // This is commonly used in Express.js error handlers where 'next' parameter is required
      // but not always used. Example: (err, req, res, _next) => {}
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];
