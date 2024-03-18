const pluginSecurity = require('eslint-plugin-security');

module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': ['google',pluginSecurity.configs.recommended],
  'overrides': [
    {
      'env': {
        'node': true,
      },
      'files': ['.eslintrc.{js,cjs}'],
      'parserOptions': {
        'sourceType': 'script',
      },
    },
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'rules': {},
};
