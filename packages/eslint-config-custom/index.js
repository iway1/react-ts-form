module.exports = {
  env: {
    node: true,
  },
  extends: [
    'next',
    'plugin:@shopify/typescript',
    'plugin:@shopify/typescript-type-checking',
    'plugin:@shopify/react',
    'plugin:@shopify/jest',
    'plugin:@shopify/prettier',
    'plugin:react/jsx-runtime',
    'turbo',
  ],
  ignorePatterns: ['node_modules', 'dist'],
  rules: {
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-ignore': 'allow-with-description',
      },
    ],
    '@typescript-eslint/consistent-indexed-object-style': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
        prefix: ['T', 'U'],
      },
    ],
    'no-catch-shadow': 'off',
    'no-console': [
      'error',
      {
        allow: ['error', 'info', 'warn'],
      },
    ],
  },
};
