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
  }
}
