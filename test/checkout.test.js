const { expect } = require('chai')
const { getMetafieldsForCheckout, saveCheckoutId } = require('../lib/checkout')
const sinon = require('sinon')

describe('checkout / getMetafieldsForCheckout', () => {
  let globalWindowBackup

  before(() => {
    globalWindowBackup = global.window
  })

  after(() => {
    global.window = globalWindowBackup
  })

  const testTable = [
    {
      name: 'should return empty array if window._recart does not exist',
      window: {},
      expected: []
    },
    {
      name: 'should return RecartSessionId if it is on window._recart',
      window: {
        _recart: { getSessionId: () => 'some-session-id' }
      },
      expected: [{ key: 'RecartSessionId', value: 'some-session-id' }]
    },
    {
      name: 'should return RecartShopperId if it is on window._recart',
      window: {
        _recart: { getShopperId: () => 'some-shopper-id' }
      },
      expected: [{ key: 'RecartShopperId', value: 'some-shopper-id' }]
    },
    {
      name: 'should return both RecartSessionId AND RecartShopperId if they exist',
      window: {
        _recart: {
          getSessionId: () => 'some-session-id',
          getShopperId: () => 'some-shopper-id'
        }
      },
      expected: [
        { key: 'RecartSessionId', value: 'some-session-id' },
        { key: 'RecartShopperId', value: 'some-shopper-id' }
      ]
    }
  ]

  testTable.forEach(testCase => {
    it(testCase.name, () => {
      global.window = testCase.window
      const result = getMetafieldsForCheckout()
      expect(result).to.deep.equal(testCase.expected)
    })
  })
})

describe('checkout / saveCheckoutId', () => {
  let globalWindowBackup, sandbox

  before(() => {
    globalWindowBackup = global.window
    sandbox = sinon.createSandbox()
    global.window = {
      _recart: {
        setShopifyCheckoutId: sandbox.stub()
      }
    }
  })

  afterEach(() => {
    sandbox.reset()
  })

  after(() => {
    sandbox.restore()
    global.window = globalWindowBackup
  })

  it('should NOT send anything if input is unknown', async () => {
    await saveCheckoutId('something-random', { hello: 'world' })

    sinon.assert.notCalled(global.window._recart.setShopifyCheckoutId)
  })

  it('should send encoded checkout ID from checkout/setCheckout mutation', async () => {
    await saveCheckoutId('checkout/setCheckout', {
      id: 'Z2lkOi8vc2hvcGlmeS9DaGVja291dC80NDFmYzNlM2YzZjJkYTE5OGQwZmExMTI1OTMyNjJmMz9rZXk9N2U4MGMwZjVlNTdjNDFlODVjNDRiNGFjMTBlNjQzYTQ=',
      url: 'https://shop.something.com/6644334658/checkouts/441fc3e3f3f2da198d0fa112593262f3?key=7e80c0f5e57c41e85c44b4ac10e643a4&c=undefined&_ga=2.118637641.1321579166.1607552485-2133470184.1594910032'
    })

    sinon.assert.calledOnceWithExactly(global.window._recart.setShopifyCheckoutId, '441fc3e3f3f2da198d0fa112593262f3')
  })

  it('should send non-encoded checkout ID from checkout/setCheckout mutation', async () => {
    await saveCheckoutId('checkout/setCheckout', {
      id: '233d67a224864402bd3ad922ad3f6f82',
      url: 'https://checkout.rechargeapps.com/r/checkout/233d67a224864402bd3ad922ad3f6f82?myshopify_domain=blendjet.myshopify.com&c=undefined&_ga=2.164114623.1410696213.1607938690-1280642583.1607938690'
    })

    sinon.assert.calledOnceWithExactly(global.window._recart.setShopifyCheckoutId, '233d67a224864402bd3ad922ad3f6f82')
  })

  it('should NOT send anything if encoded checkout ID is invalid', async () => {
    await saveCheckoutId('checkout/setCheckout', {
      id: 'blablablablablabla...JmMz9rZXk9N2U4MGMwZjVlNTdjNDFlODVjNDRiNGFjMTBlNjQzYTQ='
    })

    sinon.assert.notCalled(global.window._recart.setShopifyCheckoutId)
  })

  it('should send encoded checkout ID from checkout/setCheckoutId mutation', async () => {
    await saveCheckoutId('checkout/setCheckoutId', 'Z2lkOi8vc2hvcGlmeS9DaGVja291dC80NDFmYzNlM2YzZjJkYTE5OGQwZmExMTI1OTMyNjJmMz9rZXk9N2U4MGMwZjVlNTdjNDFlODVjNDRiNGFjMTBlNjQzYTQ=')

    sinon.assert.calledOnceWithExactly(global.window._recart.setShopifyCheckoutId, '441fc3e3f3f2da198d0fa112593262f3')
  })

  it('should send non-encoded checkout ID from checkout/setCheckoutId mutation', async () => {
    await saveCheckoutId('checkout/setCheckoutId', '441fc3e3f3f2da198d0fa112593262f3')

    sinon.assert.calledOnceWithExactly(global.window._recart.setShopifyCheckoutId, '441fc3e3f3f2da198d0fa112593262f3')
  })

  it('should send checkout ID from events/addEvent mutation', async () => {
    await saveCheckoutId('events/addEvent', {
      checkoutId: '441fc3e3f3f2da198d0fa112593262f3'
    })

    sinon.assert.calledOnceWithExactly(global.window._recart.setShopifyCheckoutId, '441fc3e3f3f2da198d0fa112593262f3')
  })
})
