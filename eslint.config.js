import nextConfig from 'eslint-config-next';

const prettierPlugin = await import('eslint-plugin-prettier');

const nextFlat = Array.isArray(nextConfig) ? nextConfig : [nextConfig];

export default [
  ...nextFlat,
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**', 'build/**', 'coverage/**', 'out/**', '*.min.js'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { prettier: prettierPlugin.default },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off'
    }
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];
