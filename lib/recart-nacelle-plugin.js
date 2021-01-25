const { getMetafieldsForCheckout, saveCheckoutId } = require('./checkout')
const cartLib = require('./cart')
const { reportError } = require('./error-reporter')

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
      reportError('Failed to init Recart plugin', { _recart: window._recart })
      return
    }
    await delay(200)
    timeoutCounter++
  }

  const cartId = ctx.query.cart_id
  const utmSource = ctx.query.utm_source

  const shouldRebuildCart = utmSource && cartId

  ctx.store.subscribe(async (mutation, state) => {
    const { type, payload } = mutation

    switch (type) {
      case 'cart/addLineItemMutation':
      case 'cart/incrementLineItemMutation':
      case 'cart/decrementLineItemMutation':
      case 'cart/removeLineItemMutation':
        if (!shouldRebuildCart) {
          await cartLib.saveCart(state.cart, state.products, ctx)
            .catch(error => reportError('Failed to save cart', {
              error,
              cart: state.cart,
              siteId: window._recart.getSiteId(),
              sessionId: window._recart.getSessionId()
            }))
        }
        break
      case 'checkout/setCheckout':
      case 'checkout/setCheckoutId':
      case 'events/addEvent':
        await saveCheckoutId(type, payload)
        break
    }
  })

  if (shouldRebuildCart) {
    window._recart.addCartRecoveryOverlay()
    try {
      await cartLib.rebuildCart(ctx, cartId)
      ctx.store.dispatch('checkout/processCheckout', {})
    } catch (error) {
      window._recart.removeCartRecoveryOverlay()

      reportError('Failed to rebuild cart', {
        error,
        cartId,
        siteId: window._recart.getSiteId(),
        sessionId: window._recart.getSessionId()
      })
    }
  }
}

module.exports = function (ctx, inject) {
  window.onNuxtReady(() => {
    initRecartPlugin(ctx, inject)
      .catch(error => reportError('Error in initRecartPlugin', {
        error,
        siteId: window._recart?.getSiteId(),
        sessionId: window._recart?.getSessionId()
      }))
  })

  inject('recart', { getMetafieldsForCheckout })
}
