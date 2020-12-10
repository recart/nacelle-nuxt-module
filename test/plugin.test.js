const sinon = require('sinon')
const { expect } = require('chai')

const plugin = require('../lib/recart-nacelle-plugin')
const cartLib = require('../lib/cart')

describe('recart-nucelle-plugin', () => {
  let globalWindowBackup, sandbox, ctx, inject

  before(() => {
    globalWindowBackup = global.window
    sandbox = sinon.createSandbox()

    global.window = {
      _recart: {
        isReady: () => true,
        addCartRecoveryOverlay: sandbox.stub(),
        removeCartRecoveryOverlay: sandbox.stub()
      },
      onNuxtReady: (callback) => callback()
    }

    ctx = {
      query: {
        cart_id: 'some-cart-id',
        utm_source: 'some-utm-source'
      },
      store: {
        dispatch: sandbox.stub(),
        subscribe: () => true
      }
    }

    inject = () => true
  })

  afterEach(() => {
    sandbox.reset()
  })

  after(() => {
    sandbox.restore()
    global.window = globalWindowBackup
  })

  it('should trigger overlay and rebuildCart if utmCource and cartId present', async () => {
    cartLib.rebuildCart = sandbox.stub()

    await plugin(ctx, inject)

    expect(global.window._recart.addCartRecoveryOverlay.callCount).to.equal(1)
    expect(cartLib.rebuildCart.callCount).to.equal(1)
    expect(cartLib.rebuildCart.firstCall.args[0]).to.eql(ctx)
    expect(cartLib.rebuildCart.firstCall.args[1]).to.eql('some-cart-id')

    expect(ctx.store.dispatch.callCount).to.equal(1)
    expect(ctx.store.dispatch.firstCall.args[0]).to.eql('checkout/processCheckout')
    expect(ctx.store.dispatch.firstCall.args[1]).to.eql({})
    expect(global.window._recart.removeCartRecoveryOverlay.callCount).to.equal(0)
  })

  it('should trigger removeOverlay if rebuild had errors', async () => {
    cartLib.rebuildCart = sandbox.stub().rejects()

    await plugin(ctx, inject)

    expect(global.window._recart.addCartRecoveryOverlay.callCount).to.equal(1)
    expect(cartLib.rebuildCart.callCount).to.equal(1)
    expect(cartLib.rebuildCart.firstCall.args[0]).to.eql(ctx)
    expect(cartLib.rebuildCart.firstCall.args[1]).to.eql('some-cart-id')

    expect(ctx.store.dispatch.callCount).to.equal(0)
    expect(global.window._recart.removeCartRecoveryOverlay.callCount).to.equal(1)
  })
})
