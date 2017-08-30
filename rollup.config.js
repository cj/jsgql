const buble = require('rollup-plugin-buble')
const commonjs = require('rollup-plugin-commonjs')
const cleanup = require('rollup-plugin-cleanup')
const uglify = require('rollup-plugin-uglify')
const version  = require('./package.json').version
const compress = !!process.env.COMPRESS

const plugins = [
  buble(),
  commonjs(),
  cleanup(),
]

if (compress) {
  plugins.push(uglify())
}

export default {
  plugins,
  input: 'src/jsgql',
  name: 'jsgql',
  sourcemap: true,
  exports: 'named',
  output: {
    file: `dist/jsgql${compress ? '.min' : ''}.js`,
    format: 'umd',
  },
  external: ['graphql-tag'],
  globals: {
    'graphql-tag': 'graphql-tag',
  },
  banner:
`/**
 * jsgql v${version}
 * (c) ${new Date().getFullYear()} CJ Lazell
 * @license MIT
 */`,
}
