const getMetafieldsForCheckout = require('./getMetafieldsForCheckout')

const delay = async milliseconds => {
  return new Promise(resolve =>
    setTimeout(() => resolve(true), milliseconds)
  )
}

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

const saveCart = async (cart, products, ctx) => {
  const cartData = cart.lineItems.reduce(function (sum, item) {
    sum.itemCount += Number(item.quantity)
    sum.value += Number(item.variant.price) * Number(item.quantity)
    return sum
  }, { itemCount: 0, value: 0, returnUrl: window.location.host })

  const cartItems = []
  for (const lineItem of cart.lineItems) {
    const quantity = Number(lineItem.quantity)
    const price = Number(lineItem.variant.price)

    // sometimes we can get it from the state, but it's a deprecated feature.
    let product = products && // TODO this will need proper error handling
      products.products &&
      products.products[lineItem.handle] &&
      products.products[lineItem.handle].product
    if (!product) {
      product = await ctx.$nacelle.data.product({ handle: lineItem.handle }) // this could be "cached"
    }

    // TODO what if "product" is still null?
    // "productId" is a required field in the request so we should probably just return
    // we should track these errors, and if we have many of them, we can accept requests without "productId" and extend the data on the backend (from shopify-product-variant-service)

    cartItems.push({
      variantId: parseInt(decodeBase64Id(lineItem.variant.id), 10),
      productId: parseInt(decodeBase64Id(product.pimSyncSourceProductId), 10),
      name: lineItem.title,
      qty: quantity,
      price: price,
      qtyPrice: quantity * price,
      currency: lineItem.variant.priceCurrency,
      imageUrl: (lineItem.image && lineItem.image.src) || 'https://static.ghostmonitor.com/email/shopping-bag.jpg'
    })
  }

  return window._recart.setCart(cartData, cartItems, new Date())
}

const initRecartPlugin = async (ctx) => {
  console.log('Recart Nacelle plugin started')

  let timoutCounter = 0
  while (!window._recart || !window._recart.isReady()) {
    if (timoutCounter > 10) throw new Error('Recart is not initialized.')
    await delay(1000)
    timoutCounter++
  }

  ctx.store.subscribe(async (mutation, state) => {
    const { type } = mutation

    switch (type) {
      case 'cart/addLineItemMutation':
      case 'cart/incrementLineItemMutation':
      case 'cart/decrementLineItemMutation':
      case 'cart/removeLineItemMutation':
        await saveCart(state.cart, state.products, ctx)
        break
    }
  })
}

module.exports = function (ctx, inject) {
  window.onNuxtReady(() => initRecartPlugin(ctx, inject).catch(console.error))

  inject('recart', { getMetafieldsForCheckout })
}
