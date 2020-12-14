# Recart integration for Nacelle

Recart works out of the box on normal Shopify storefronts. 

However, if you have a Nacelle site, you need to install this Nuxt module to make Recart work.

## Requirements

- A Nacelle project set up locally. See https://docs.getnacelle.com for getting started.
- Shopify store backend.
- [Recart](https://recart.com/) installed on your Shopify store.

## Usage

1. **Install our package.**

    ```
    npm install @recart/nacelle-nuxt-module
    ```

2. **Add the module to your Nacelle app.**

    Open `nuxt.config.js` and add `@recart/nacelle-nuxt-module` to the `modules` array, along with your Recart Site ID.
    
    It should look like this:

    ```
    modules: [
      '@nuxtjs/pwa',
      '@nuxtjs/dotenv',
      '@nacelle/nacelle-nuxt-module',
      '@nuxtjs/sitemap',
      ['@recart/nacelle-nuxt-module', { recartSiteId: '5abcdefgh000000000000000' }]
    ],
    ```

    You can find your Site ID on the Recart dashboard: [app.recart.com/settings/me](https://app.recart.com/settings/me)

3. **Add our metafields to the checkout object.**

    Open `store/checkout.js` and find the `this.$nacelle.checkout.process` method call. In a fresh Nacelle install, it looks like this:

    ```js
    let checkout = await this.$nacelle.checkout.process({ cartItems, checkoutId })
    ```

    To help Recart identify checkouts and orders, extend this line with `metafields`, like this:

    ```js
    let checkout = await this.$nacelle.checkout.process({
      cartItems,
      checkoutId,
      metafields: this.$recart.getMetafieldsForCheckout() // <-- add this line
    })
    ```

## Support

If you have any questions, feel free to contact Recart support at [support@recart.com](mailto:support@recart.com).

# Contributing

We really appreciate contributions.

If you have identified a bug, please open an Issue and provide as with as many details as possible.

If you have a suggestion to make the code better, feel free to submit a Pull Request. We only ask a few things from you:

- Write a short PR description, explaining the purpose of your solution.
- Write descriptive commit messages.
- Format the code according to the [Standard JS](https://standardjs.com/) guidelines and make sure the `npm run lint` command runs without errors.
- If possible, cover your changes with tests and make sure the `npm test` command runs without errors.
