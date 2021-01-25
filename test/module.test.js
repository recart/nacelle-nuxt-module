const { expect } = require('chai')
const sinon = require('sinon')

const packageJSON = require('../package.json')
const recartModule = require('../lib/module')

describe('module', () => {
  let sandbox
  before(() => {
    sandbox = sinon.createSandbox()
  })

  let nuxtContext, moduleOptions
  beforeEach(() => {
    nuxtContext = {
      options: {
        nacelle: {
          abcd: 'some-nacelle-thingy'
        },
        head: { script: [] }
      },
      addPlugin: sandbox.stub()
    }

    moduleOptions = {
      recartSiteId: 'some-recart-siteid'
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should log error and exit if there is no Recart siteId', () => {
    moduleOptions = {}
    console.error = sandbox.spy()
    recartModule.call(nuxtContext, moduleOptions)

    sandbox.assert.calledOnceWithMatch(console.error, params => {
      expect(params).to.equal('RecartSiteId is required in module options')
      return true
    })
  })

  it('should add Recart nacelle plugin', () => {
    recartModule.call(nuxtContext, moduleOptions)

    sandbox.assert.calledOnceWithMatch(nuxtContext.addPlugin, params => {
      expect(params.src).to.contain('recart-nacelle-plugin.js')
      expect(params.fileName).to.equal('recart-nacelle-plugin.js')

      expect(params.options).to.deep.equal({
        ...nuxtContext.options.nacelle,
        ...moduleOptions
      })

      expect(params.mode).to.equal('client', 'mode should be set to "client"')
      expect(params.ssr).to.equal(false, 'ssr should be false')
      return true
    })
  })

  it('should export package.json as "meta"', () => {
    expect(recartModule.meta).to.equal(packageJSON)
  })

  it('should add recart-loader script', () => {
    recartModule.call(nuxtContext, moduleOptions)

    expect(nuxtContext.options.head.script.length).to.equal(1)
    expect(nuxtContext.options.head.script[0]).to.eql({
      hid: 'recart-loader-js',
      src: `https://cdn.ghostmonitor.com/recart-loader.js?siteId=${moduleOptions.recartSiteId}&storefront=nacelle`,
      async: true
    })
  })
})
