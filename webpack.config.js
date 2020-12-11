const nodeExternals = require('webpack-node-externals')
const path = require('path')

module.exports = [
  {
    mode: 'production',
    target: 'node',
    entry: {
      module: './lib/module.js'
    },
    output: {
      filename: 'module.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'commonjs-module'
    },
    externals: [nodeExternals()]
  },
  {
    mode: 'production',
    target: 'node',
    entry: {
      plugin: './lib/recart-nacelle-plugin.js'
    },
    output: {
      filename: 'recart-nacelle-plugin.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'commonjs-module'
    },
    externals: [nodeExternals()]
  }
]
