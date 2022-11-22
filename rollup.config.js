export default {
  input: 'setup2.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  external: ['node:assert']
};
