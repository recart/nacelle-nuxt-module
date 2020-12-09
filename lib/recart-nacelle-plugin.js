const getMetafieldsForCheckout = require('./getMetafieldsForCheckout')
const { saveCart } = require('./cart')

const delay = async milliseconds => {
  return new Promise(resolve =>
    setTimeout(() => resolve(true), milliseconds)
  )
}

const initRecartPlugin = async (ctx) => {
  console.log('Recart Nacelle plugin started')

  let timeoutCounter = 0
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
