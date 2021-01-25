module.exports = {
  reportError: (message, context) => {
    if (!window || typeof CustomEvent === 'undefined') return

    window.dispatchEvent(new CustomEvent('RecartIntegrationError', {
      detail: {
        integration: 'nacelle',
        message,
        context
      }
    }))
  }
}
