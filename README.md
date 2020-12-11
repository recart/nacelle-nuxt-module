# Recart integration for Nacelle

Recart works out of the box on normal Shopify storefronts. 

However, if you have a Nacelle site, you need to install this Nuxt module make Recart work.

## Requirements

- A Nacelle project set up locally. See https://docs.getnacelle.com for getting started.
- Shopify store backend.
- [Recart](https://recart.com/) installed on your Shopify store.

## Usage

1. Install our package.

    ```
    npm install @recart/nacelle-nuxt-module
    ```

2. Add the module to your Nacelle app.

    Open `nuxt.config.js` and add `@recart/nacelle-nuxt-module` to the `modules` array. It should look like this:

    ```
    modules: [
      '@nuxtjs/pwa',
      '@nuxtjs/dotenv',
      '@nacelle/nacelle-nuxt-module',
      '@nuxtjs/sitemap',
      '@recart/nacelle-nuxt-module'
    ],
    ```

3. Add configuration details

    Add your Recart Site ID to the `nacelle` config object in `nuxt.config.js` as `recartSiteId`.
    
    You can find your Site ID on the Recart dashboard: [app.recart.com/settings/me](https://app.recart.com/settings/me)

    ```
    nacelle: {
      spaceID: process.env.NACELLE_SPACE_ID,
      token: process.env.NACELLE_GRAPHQL_TOKEN,
      gaID: process.env.NACELLE_GA_ID,
      fbID: process.env.NACELLE_FB_ID,
      recartSiteId: '5abcdefgh000000000000000'
    },
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