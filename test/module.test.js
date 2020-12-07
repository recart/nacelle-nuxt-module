const { expect } = require('chai')

const recartModule = require('../lib/module')
const packageJSON = require('../package.json')

describe('module', () => {
  it('should not throw errors', () => {
    expect(() => recartModule({})).to.not.throw()
  })

  it('should export package.json as "meta"', () => {
    expect(recartModule.meta).to.equal(packageJSON)
  })
})
