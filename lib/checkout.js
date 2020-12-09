const decodeAndParseCheckoutId = (encoded) => {
  const decoded = Buffer.from(encoded, 'base64').toString('binary')
  if (!decoded) return null

  const parts = decoded.match(/Checkout\/([^?/]+)/)
  if (!Array.isArray(parts) || !parts[1]) return null

  return parts[1]
}

const getCheckoutId = (mutationType, mutationPayload) => {
  if (!mutationType || !mutationPayload) {
    return null
  }

  if (mutationType === 'checkout/setCheckout') {
    return decodeAndParseCheckoutId(mutationPayload.id)
  } else if (mutationType === 'checkout/setCheckoutId') {
    return decodeAndParseCheckoutId(mutationPayload)
  } else if (mutationType === 'events/addEvent') {
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

    if (window._recart.getSessionId && window._recart.getSessionId()) {
      metaFields.push({ key: 'RecartSessionId', value: window._recart.getSessionId() })
    }

    if (window._recart.getShopperId && window._recart.getShopperId()) {
      metaFields.push({ key: 'RecartShopperId', value: window._recart.getShopperId() })
    }

    return metaFields
  },

  saveCheckoutId: async (mutationType, mutationPayload) => {
    const checkoutId = getCheckoutId(mutationType, mutationPayload)
    if (!checkoutId) return

    await window._recart.setShopifyCheckoutId(checkoutId)
  }
}
