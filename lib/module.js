const path = require('path')

module.exports = function (moduleOptions) {
  const options = {
    ...this.options.nacelle,
    ...moduleOptions
  }

  const fileName = 'recart-nacelle-plugin.js'

  this.addPlugin({
    src: path.resolve(__dirname, fileName),
    fileName,
    options,
    async: true,
    defer: true,
    mode: 'client',
    ssr: false
  })
}

module.exports.meta = require('../package.json')
