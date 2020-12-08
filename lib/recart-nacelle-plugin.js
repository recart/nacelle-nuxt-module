const initRecartPlugin = async (ctx, inject) => {
  console.log('Recart Nacelle plugin started')
}

module.exports = function (ctx, inject) {
  window.onNuxtReady(() => initRecartPlugin(ctx, inject).catch(console.error))
}
