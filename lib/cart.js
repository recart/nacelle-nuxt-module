const get = require('lodash.get')

const decodeBase64Id = (encodedId) => {
  // Some IDs are like Z2lkOi8A3Mzg5MTM4Nw==::706db06f-4ce4-4f
  // We extract the base64 part from these.
  // After decoding, we can get strings like gid://shopify/variant/3423489374893

  if (encodedId && typeof encodedId === 'string') {
    const base64id = encodedId.split('::').shift()
    return Buffer.from(base64id, 'base64').toString('binary').split('/').pop()
  }
  return encodedId
}

const encodeBase64 = (input) => {
  return Buffer.from(input).toString('base64')
}

module.exports = {
  saveCart: async (cart, products, ctx) => {
    if (!cart.lineItems) return

    const cartData = cart.lineItems.reduce(function (sum, item) {
      sum.itemCount += Number(item.quantity)
      sum.value += Number(item.variant.price) * Number(item.quantity)
      return sum
    }, { itemCount: 0, value: 0, returnUrl: window.location.hostname })

    if (cart.lineItems.length > 0) {
      cartData.currency = cart.lineItems[0].variant.priceCurrency
    }

    const cartItems = []
    for (const lineItem of cart.lineItems) {
      const quantity = Number(lineItem.quantity)
      const price = Number(lineItem.variant.price)

      // sometimes we can get it from the state, but it's a deprecated feature.
      let product = get(products, `products.${lineItem.handle}.product`)
      if (!product) {
        product = get(ctx, '$nacelle.data.product') &&
          await ctx.$nacelle.data.product({ handle: lineItem.handle }) // this could be "cached"
      }

      // TODO what if "product" is still null?
      // "productId" is a required field in the request so we should probably just return
      // we should track these errors, and if we have many of them,
      // we can accept requests without "productId" and extend the data on the backend (from shopify-product-variant-service)
      // later we should send this to sentry
      if (!product) return

      cartItems.push({
        variantId: parseInt(decodeBase64Id(lineItem.variant.id), 10),
        productId: parseInt(decodeBase64Id(product.pimSyncSourceProductId), 10),
        name: lineItem.title,
        qty: quantity,
        price: price,
        qtyPrice: quantity * price,
        currency: lineItem.variant.priceCurrency,
        imageUrl: get(lineItem, 'image.src') ||
          get(lineItem, 'image.thumbnailSrc') ||
          'https://static.ghostmonitor.com/email/shopping-bag.jpg'
      })
    }

    await window._recart.setCart(cartData, cartItems, new Date())
  },

  rebuildCart: async (ctx, sessionId) => {
    ctx.store.dispatch('cart/resetLineItems')

    const cartItems = await window._recart.getCartItems(sessionId)

    cartItems.forEach(item => {
      const nacelleLineItem = {
        image: {
          thumbnailSrc: item.imageUrl
        },
        title: item.name,
        variant: {
          id: encodeBase64(`gid://shopify/ProductVariant/${item.variantId}`),
          price: item.price,
          priceCurrency: item.currency
        },
        quantity: item.qty,
        metafields: []
      }
      ctx.store.dispatch('cart/addLineItem', nacelleLineItem)
    })
  }
}
