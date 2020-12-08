const path = require('path')

module.exports = function (moduleOptions) {
  const options = {
    ...this.options.nacelle,
    ...moduleOptions
  }

  if (!options.recartSiteId) {
    console.error('RecartSiteId is required on module options')
    return
  }
  const siteId = options.recartSiteId
  const baseUrl = options.recartBaseUrl || 'https://cdn.ghostmonitor.com'

  const fileName = 'recart-nacelle-plugin.js'

  this.options.head.script.push({
    hid: 'trackingjs',
    src: `${baseUrl}/recart-loader.js?siteId=${siteId}&storefront=nacelle`,
    async: true,
    defer: true
  })

  this.addPlugin({
    src: path.resolve(__dirname, fileName),
    fileName,
    options,
    async: true,
    defer: true,
    mode: 'client',
    ssr: false
  })

  console.log(`Recart Nucelle module initialized for ${siteId} site`)
}

module.exports.meta = require('../package.json')
