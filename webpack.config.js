const path = require('path')

module.exports = [
  {
    mode: 'production',
    target: 'web',
    entry: {
      module: './lib/module.js'
    },
    output: {
      filename: 'module.js',
      path: path.resolve(__dirname, 'dist')
    }
  },
  {
    mode: 'production',
    target: 'web',
    entry: {
      plugin: './lib/recart-nacelle-plugin.js'
    },
    output: {
      filename: 'recart-nacelle-plugin.js',
      path: path.resolve(__dirname, 'dist')
    }
  }
]
