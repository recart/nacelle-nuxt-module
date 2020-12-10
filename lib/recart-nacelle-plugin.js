const { getMetafieldsForCheckout, saveCheckoutId } = require('./checkout')
const { saveCart, rebuildCart } = require('./cart')

const delay = async milliseconds => {
  return new Promise(resolve =>
    setTimeout(() => resolve(true), milliseconds)
  )
}

const initRecartPlugin = async (ctx) => {
  console.log('Recart Nacelle plugin started')

  let timeoutCounter = 0
  while (!window._recart || !window._recart.isReady()) {
    if (timeoutCounter > 30) {
      console.error('Recart is not initialized.')
      return
    }
    await delay(200)
    timeoutCounter++
  }

  ctx.store.subscribe(async (mutation, state) => {
    const { type, payload } = mutation

    switch (type) {
      case 'cart/addLineItemMutation':
      case 'cart/incrementLineItemMutation':
      case 'cart/decrementLineItemMutation':
      case 'cart/removeLineItemMutation':
        await saveCart(state.cart, state.products, ctx)
        break
      case 'checkout/setCheckout':
      case 'checkout/setCheckoutId':
      case 'events/addEvent':
        await saveCheckoutId(type, payload)
        break
    }
  })

  const cartId = ctx.query.cart_id
  const utmSource = ctx.query.utm_source
  if (utmSource && cartId) {
    // TODO initOverlay
    await rebuildCart(ctx, cartId).catch(e => {
      console.error(e)
      // TODO removeOverlay
    })
  }
}

module.exports = function (ctx, inject) {
  window.onNuxtReady(() => initRecartPlugin(ctx, inject).catch(console.error))

  inject('recart', { getMetafieldsForCheckout })
}
