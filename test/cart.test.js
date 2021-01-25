const { saveCart, rebuildCart } = require('../lib/cart')
const sinon = require('sinon')
const { expect } = require('chai')

const cartFixture = require('./cart.fixture')
const productsFixture = require('./products.fixture')

describe('cart / saveCart', () => {
  let globalWindowBackup, sandbox
  const fakedNow = new Date()

  before(() => {
    globalWindowBackup = global.window
    sandbox = sinon.createSandbox()
    sandbox.clock = sandbox.useFakeTimers(fakedNow)

    global.window = {
      _recart: {
        setCart: sandbox.stub(),
        getSiteId: sandbox.stub(),
        getSessionId: sandbox.stub()
      },
      location: {
        hostname: 'some-host-name'
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

  it('should send empty setCart if there is no cart.lineItem', async () => {
    const cart = {
      lineItems: []
    }

    await saveCart(cart, {}, {})

    expect(global.window._recart.setCart.callCount).to.equal(1)
    expect(global.window._recart.setCart.firstCall.args[0]).to.eql(cartFixture.expectedEmptyCartData)
    expect(global.window._recart.setCart.firstCall.args[1]).to.eql([])
    expect(global.window._recart.setCart.firstCall.args[2]).to.eql(fakedNow)
  })

  it('should send setCart, getting products from products parameter', async () => {
    await saveCart(cartFixture.nacelleCart, productsFixture, {})

    expect(global.window._recart.setCart.callCount).to.equal(1)
    expect(global.window._recart.setCart.firstCall.args[0]).to.eql(cartFixture.expectedCartData)
    expect(global.window._recart.setCart.firstCall.args[1]).to.eql(cartFixture.expectedLineItems)
    expect(global.window._recart.setCart.firstCall.args[2]).to.eql(fakedNow)
  })

  it('should send setCart, getting products from $nacelle.data.product', async () => {
    const ctx = {
      $nacelle: {
        data: {
          product: async (product) => {
            return productsFixture.products[product.handle].product
          }
        }
      }
    }

    await saveCart(cartFixture.nacelleCart, {}, ctx)

    expect(global.window._recart.setCart.callCount).to.equal(1)
    expect(global.window._recart.setCart.firstCall.args[0]).to.eql(cartFixture.expectedCartData)
    expect(global.window._recart.setCart.firstCall.args[1]).to.eql(cartFixture.expectedLineItems)
    expect(global.window._recart.setCart.firstCall.args[2]).to.eql(fakedNow)
  })

  it('should return if couldn\'t get product', async () => {
    await saveCart(cartFixture.nacelleCart, {}, {})

    sinon.assert.notCalled(global.window._recart.setCart)
  })
})

describe('cart / rebuildCart', () => {
  let globalWindowBackup, sandbox

  before(() => {
    globalWindowBackup = global.window
    sandbox = sinon.createSandbox()
  })

  beforeEach(() => {
    global.window = {
      _recart: {
        getCartItems: sandbox.stub().resolves(cartFixture.recartCartItems)
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

  it('should rebuild cart', async () => {
    const ctx = {
      store: {
        dispatch: sandbox.stub()
      }
    }

    await rebuildCart(ctx, 'some-session-id')

    expect(ctx.store.dispatch.callCount).to.equal(3)
    expect(ctx.store.dispatch.getCall(0).args[0]).to.equal('cart/resetLineItems')
    expect(ctx.store.dispatch.getCall(1).args[0]).to.equal('cart/addLineItem')
    expect(ctx.store.dispatch.getCall(1).args[1]).to.eql(cartFixture.addLineItemMutations[0])
    expect(ctx.store.dispatch.getCall(2).args[0]).to.equal('cart/addLineItem')
    expect(ctx.store.dispatch.getCall(2).args[1]).to.eql(cartFixture.addLineItemMutations[1])
  })
})
