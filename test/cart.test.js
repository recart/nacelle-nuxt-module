const { saveCart } = require('../lib/cart')
const sinon = require('sinon')

const cartFixture = require('./cart.fixture')
const productsFixture = require('./products.fixture')

describe('cart', () => {
  let globalWindowBackup, sandbox
  const fakedNow = new Date()

  before(() => {
    globalWindowBackup = global.window
    sandbox = sinon.createSandbox()
    sandbox.clock = sandbox.useFakeTimers(fakedNow)

    global.window = {
      _recart: {
        setCart: sandbox.stub()
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

    sinon.assert.calledOnceWithMatch(global.window._recart.setCart,
      {
        itemCount: 0,
        value: 0,
        returnUrl: global.window.location.hostname
      },
      [],
      fakedNow
    )
  })

  it('should send setCart, getting products from products parameter', async () => {
    await saveCart(cartFixture, productsFixture, {})

    sinon.assert.calledOnceWithMatch(global.window._recart.setCart,
      {
        itemCount: 5,
        value: 444,
        returnUrl: global.window.location.hostname,
        currency: 'USD'
      },
      [
        {
          variantId: 37036471615646,
          productId: 5928875229342,
          name: '4 Ounce Soy Candle',
          qty: 3,
          price: 116,
          qtyPrice: 3 * 116,
          currency: 'USD',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0515/7004/9182/products/4-ounce-soy-candle.jpg?v=1606487687'
        },
        {
          variantId: 37036471582878,
          productId: 5928875163806,
          name: 'Fancy Bath Bombs',
          qty: 2,
          price: 48,
          qtyPrice: 2 * 48,
          currency: 'USD',
          imageUrl: 'https://static.ghostmonitor.com/email/shopping-bag.jpg'
        }
      ],
      fakedNow
    )
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

    await saveCart(cartFixture, {}, ctx)

    sinon.assert.calledOnceWithMatch(global.window._recart.setCart,
      {
        itemCount: 5,
        value: 444,
        returnUrl: global.window.location.hostname,
        currency: 'USD'
      },
      [
        {
          variantId: 37036471615646,
          productId: 5928875229342,
          name: '4 Ounce Soy Candle',
          qty: 3,
          price: 116,
          qtyPrice: 3 * 116,
          currency: 'USD',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0515/7004/9182/products/4-ounce-soy-candle.jpg?v=1606487687'
        },
        {
          variantId: 37036471582878,
          productId: 5928875163806,
          name: 'Fancy Bath Bombs',
          qty: 2,
          price: 48,
          qtyPrice: 2 * 48,
          currency: 'USD',
          imageUrl: 'https://static.ghostmonitor.com/email/shopping-bag.jpg'
        }
      ],
      fakedNow
    )
  })

  it('should return if couldn\'t get product', async () => {
    await saveCart(cartFixture, {}, {})

    sinon.assert.notCalled(global.window._recart.setCart)
  })
})
