const { expect } = require('chai')
const sinon = require('sinon')

const packageJSON = require('../package.json')
const recartModule = require('../lib/module')

describe('module', () => {
  it('should add Recart plugin', () => {
    const nuxtContext = {
      options: {
        nacelle: {
          abcd: 'some-nacelle-thingy'
        }
      },
      addPlugin: sinon.stub()
    }

    const moduleOptions = {
      efgh: 'some-module-thingy'
    }

    recartModule.call(nuxtContext, moduleOptions)

    sinon.assert.calledOnceWithMatch(nuxtContext.addPlugin, params => {
      expect(params.src).to.contain('recart-nacelle-plugin.js')
      expect(params.fileName).to.equal('recart-nacelle-plugin.js')

      expect(params.options).to.deep.equal({
        ...nuxtContext.options.nacelle,
        ...moduleOptions
      })

      expect(params.async).to.equal(true, 'async should be true')
      expect(params.defer).to.equal(true, 'defer should be true')
      expect(params.mode).to.equal('client', 'mode should be set to "client"')
      expect(params.ssr).to.equal(false, 'ssr should be false')
      return true
    })
  })

  it('should export package.json as "meta"', () => {
    expect(recartModule.meta).to.equal(packageJSON)
  })
})
