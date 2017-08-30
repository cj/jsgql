module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  extends: 'standard',
  // add your custom rules here
  rules: {
    'no-multi-spaces': 0,
    'key-spacing': 0,
    'require-await': 2,
    'react/display-name': 0,
    'comma-dangle': [2, 'always-multiline'],
    'func-style': [2, 'declaration', { 'allowArrowFunctions': true }],
    'no-confusing-arrow': 2,
    'arrow-parens': [2, 'as-needed'],
  },
  globals: {}
}
