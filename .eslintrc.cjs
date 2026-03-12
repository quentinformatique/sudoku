module.exports = {
  root: true,
  extends: ['universe/native', 'universe/shared/typescript-analysis', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['react', 'react-hooks', 'react-native'],
  env: {
    es2021: true,
    jest: true,
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'off',
    'react/jsx-boolean-value': 'off',
    'no-void': 'off',
  },
};

