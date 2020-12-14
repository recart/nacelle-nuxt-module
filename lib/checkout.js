const decodeAndParseCheckoutId = (input) => {
  const isEncoded = input.slice(-1) === '='
  if (!isEncoded) {
    return input
  }

  const decoded = Buffer.from(input, 'base64').toString('binary')
  if (!decoded) return null

  const parts = decoded.match(/Checkout\/([^?/]+)/)
  if (!Array.isArray(parts) || !parts[1]) return null

  return parts[1]
}

const getCheckoutId = (mutationType, mutationPayload) => {
  if (!mutationType || !mutationPayload) {
    return null
  }

  switch (mutationType) {
    case 'checkout/setCheckout':
      return decodeAndParseCheckoutId(mutationPayload.id)
    case 'checkout/setCheckoutId':
      return decodeAndParseCheckoutId(mutationPayload)
    case 'events/addEvent':
      return mutationPayload.checkoutId
  }

  return null
}

module.exports = {
  getMetafieldsForCheckout: () => {
    const metaFields = []

    if (!window || !window._recart) {
      return metaFields
    }

    const sessionId = window._recart.getSessionId && window._recart.getSessionId()
    if (sessionId) {
      metaFields.push({ key: 'RecartSessionId', value: sessionId })
    }

    const shopperId = window._recart.getShopperId && window._recart.getShopperId()
    if (shopperId) {
      metaFields.push({ key: 'RecartShopperId', value: shopperId })
    }

    return metaFields
  },

  saveCheckoutId: async (mutationType, mutationPayload) => {
    const checkoutId = getCheckoutId(mutationType, mutationPayload)
    if (!checkoutId) return

    await window._recart.setShopifyCheckoutId(checkoutId)
  }
}
