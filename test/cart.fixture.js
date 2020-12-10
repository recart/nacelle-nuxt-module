module.exports = {
  nacelleCart: {
    lineItems: [{
      image: {
        src: 'https://cdn.shopify.com/s/files/1/0515/7004/9182/products/4-ounce-soy-candle.jpg?v=1606487687',
        id: 'Z2lkOi8vc2hvcGlmeS9JbWFnZVNvdXJjZS8xMjQ1OTMxOTA5OTU1MA==',
        thumbnailSrc: 'https://cdn.shopify.com/s/files/1/0515/7004/9182/products/4-ounce-soy-candle.jpg?v=1606487687&width=100',
        type: 'image',
        altText: null
      },
      title: '4 Ounce Soy Candle',
      variant: {
        id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zNzAzNjQ3MTYxNTY0Ng==',
        title: 'Frozen',
        price: '116.0',
        priceCurrency: 'USD',
        compareAtPrice: null,
        compareAtPriceCurrency: null,
        swatchSrc: null,
        selectedOptions: [{
          name: 'Title',
          value: 'Frozen'
        }],
        featuredMedia: {
          id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0SW1hZ2UvMjAyODMxMzc0NTgzMzQ=',
          thumbnailSrc: 'https://cdn.shopify.com/s/files/1/0515/7004/9182/products/4-ounce-soy-candle.jpg?v=1606487687&width=100',
          src: 'https://cdn.shopify.com/s/files/1/0515/7004/9182/products/4-ounce-soy-candle.jpg?v=1606487687',
          type: 'image',
          altText: null
        },
        sku: null,
        availableForSale: true,
        metafields: [],
        weight: null,
        weightUnit: null,
        priceRules: null
      },
      quantity: 3,
      productId: 'gabor-nacelle.myshopify.com::4-ounce-soy-candle::en-us',
      handle: '4-ounce-soy-candle',
      vendor: 'Hoeger, Rosenbaum and Emmerich',
      tags: ['developer-tools-generator'],
      metafields: [],
      id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zNzAzNjQ3MTYxNTY0Ng==::7eb9221e-e8ea-42f6-b6a6-b07f4b052638'
    }, {
      image: null,
      title: 'Fancy Bath Bombs',
      variant: {
        id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zNzAzNjQ3MTU4Mjg3OA==',
        title: 'Fresh',
        price: '48.0',
        priceCurrency: 'USD',
        compareAtPrice: null,
        compareAtPriceCurrency: null,
        swatchSrc: null,
        selectedOptions: [{
          name: 'Title',
          value: 'Fresh'
        }],
        featuredMedia: null,
        sku: null,
        availableForSale: true,
        metafields: [],
        weight: 89,
        weightUnit: 'GRAMS',
        priceRules: null
      },
      quantity: 2,
      productId: 'gabor-nacelle.myshopify.com::fancy-bath-bombs::en-us',
      handle: 'fancy-bath-bombs',
      vendor: 'Schumm and Sons',
      tags: ['developer-tools-generator'],
      metafields: [],
      id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zNzAzNjQ3MTU4Mjg3OA==::a0f47363-1328-4e51-ad41-9b7f451efcf7'
    }],
    cartVisible: true,
    freeShippingThreshold: 100,
    error: null
  },
  expectedEmptyCartData: {
    itemCount: 0,
    value: 0,
    returnUrl: 'some-host-name'
  },
  expectedCartData: {
    itemCount: 5,
    value: 444,
    returnUrl: 'some-host-name',
    currency: 'USD'
  },
  expectedLineItems: [
    {
      variantId: 37036471615646,
      productId: 5928875229342,
      name: '4 Ounce Soy Candle',
      qty: 3,
      price: 116,
      qtyPrice: 3 * 116,
      currency: 'USD',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0515/7004/9182/products/4-ounce-soy-candle.jpg?v=1606487687'
    },
    {
      variantId: 37036471582878,
      productId: 5928875163806,
      name: 'Fancy Bath Bombs',
      qty: 2,
      price: 48,
      qtyPrice: 2 * 48,
      currency: 'USD',
      imageUrl: 'https://static.ghostmonitor.com/email/shopping-bag.jpg'
    }
  ],
  recartCartItems: [{
    category: '',
    variantId: 37036471582878,
    productId: '5928875163806',
    name: 'Fancy Bath Bombs',
    qty: 2,
    price: 48,
    qtyPrice: 96,
    currency: 'USD',
    imageUrl: 'https://static.ghostmonitor.com/email/shopping-bag.jpg'
  }, {
    category: '',
    variantId: 37036471615646,
    productId: '5928875229342',
    name: '4 Ounce Soy Candle',
    qty: 1,
    price: 116,
    qtyPrice: 116,
    currency: 'USD',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0515/7004/9182/products/4-ounce-soy-candle.jpg?v=1606487687'
  }],
  addLineItemMutations: [{
    image: { thumbnailSrc: 'https://static.ghostmonitor.com/email/shopping-bag.jpg' },
    title: 'Fancy Bath Bombs',
    variant: {
      id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zNzAzNjQ3MTU4Mjg3OA==',
      price: 48,
      priceCurrency: 'USD'
    },
    quantity: 2,
    metafields: []
  },
  {
    image: { thumbnailSrc: 'https://cdn.shopify.com/s/files/1/0515/7004/9182/products/4-ounce-soy-candle.jpg?v=1606487687' },
    title: '4 Ounce Soy Candle',
    variant: {
      id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zNzAzNjQ3MTYxNTY0Ng==',
      price: 116,
      priceCurrency: 'USD'
    },
    quantity: 1,
    metafields: []
  }]
}
