const sinon = require('sinon')
const { expect } = require('chai')

const plugin = require('../lib/recart-nacelle-plugin')
const cartLib = require('../lib/cart')

describe('rebuild cart flow', () => {
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
    cartLib.rebuildCart = sandbox.stub().resolves()

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

describe('save cart flow', () => {
  let globalWindowBackup, sandbox, ctx, inject, subscribeCallBack

  before(() => {
    globalWindowBackup = global.window
    sandbox = sinon.createSandbox()

    global.window = {
      _recart: { isReady: () => true },
      onNuxtReady: (callback) => callback()
    }

    ctx = {
      query: {},
      store: { subscribe: (callBack) => { subscribeCallBack = callBack } }
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

  it('should trigger save cart on cart/addLineItemMutation', async () => {
    cartLib.saveCart = sandbox.stub().resolves()

    const mutation = { type: 'cart/addLineItemMutation', payload: {} }
    const state = { cart: { example: 'example' }, products: {} }

    await plugin(ctx, inject)
    await subscribeCallBack(mutation, state)

    expect(cartLib.saveCart.callCount).to.equal(1)
    expect(cartLib.saveCart.firstCall.args[0]).to.eql(state.cart)
    expect(cartLib.saveCart.firstCall.args[1]).to.eql(state.products)
    expect(cartLib.saveCart.firstCall.args[2]).to.eql(ctx)
  })

  it('should trigger save cart on cart/addLineItemMutation', async () => {
    cartLib.saveCart = sandbox.stub().resolves()

    const mutation = { type: 'cart/addLineItemMutation', payload: {} }
    const state = { cart: { example: 'example' }, products: {} }

    await plugin(ctx, inject)
    await subscribeCallBack(mutation, state)

    expect(cartLib.saveCart.callCount).to.equal(1)
    expect(cartLib.saveCart.firstCall.args[0]).to.eql(state.cart)
    expect(cartLib.saveCart.firstCall.args[1]).to.eql(state.products)
    expect(cartLib.saveCart.firstCall.args[2]).to.eql(ctx)
  })

  it('should trigger save cart on cart/incrementLineItemMutation', async () => {
    cartLib.saveCart = sandbox.stub().resolves()

    const mutation = { type: 'cart/incrementLineItemMutation', payload: {} }
    const state = { cart: { example: 'example' }, products: {} }

    await plugin(ctx, inject)
    await subscribeCallBack(mutation, state)

    expect(cartLib.saveCart.callCount).to.equal(1)
    expect(cartLib.saveCart.firstCall.args[0]).to.eql(state.cart)
    expect(cartLib.saveCart.firstCall.args[1]).to.eql(state.products)
    expect(cartLib.saveCart.firstCall.args[2]).to.eql(ctx)
  })

  it('should trigger save cart on cart/decrementLineItemMutation', async () => {
    cartLib.saveCart = sandbox.stub().resolves()

    const mutation = { type: 'cart/decrementLineItemMutation', payload: {} }
    const state = { cart: { example: 'example' }, products: {} }

    await plugin(ctx, inject)
    await subscribeCallBack(mutation, state)

    expect(cartLib.saveCart.callCount).to.equal(1)
    expect(cartLib.saveCart.firstCall.args[0]).to.eql(state.cart)
    expect(cartLib.saveCart.firstCall.args[1]).to.eql(state.products)
    expect(cartLib.saveCart.firstCall.args[2]).to.eql(ctx)
  })

  it('should trigger save cart on cart/removeLineItemMutation', async () => {
    cartLib.saveCart = sandbox.stub().resolves()

    const mutation = { type: 'cart/removeLineItemMutation', payload: {} }
    const state = { cart: { example: 'example' }, products: {} }

    await plugin(ctx, inject)
    await subscribeCallBack(mutation, state)

    expect(cartLib.saveCart.callCount).to.equal(1)
    expect(cartLib.saveCart.firstCall.args[0]).to.eql(state.cart)
    expect(cartLib.saveCart.firstCall.args[1]).to.eql(state.products)
    expect(cartLib.saveCart.firstCall.args[2]).to.eql(ctx)
  })

  it('should not trigger save cart if cart is rebuilding', async () => {
    cartLib.saveCart = sandbox.stub().resolves()

    ctx.query = {
      cart_id: 'some-cart-id',
      utm_source: 'some-utm-source'
    }

    const mutation = { type: 'cart/addLineItemMutation', payload: {} }
    const state = { cart: { example: 'example' }, products: {} }

    await plugin(ctx, inject)
    await subscribeCallBack(mutation, state)

    expect(cartLib.saveCart.callCount).to.equal(0)
  })
})
