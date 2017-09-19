import buble       from 'rollup-plugin-buble'
import commonjs    from 'rollup-plugin-commonjs'
import uglify      from 'rollup-plugin-uglify'
import cleanup     from 'rollup-plugin-cleanup'

const version  = require('./package.json').version
const compress = !!process.env.COMPRESS

let plugins = [
  buble({
    objectAssign: 'Object.assign',
  }),
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
  output: {
    file: `dist/jsgql${compress ? '.min' : ''}.js`,
    format: 'umd',
    exports: 'named',
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
