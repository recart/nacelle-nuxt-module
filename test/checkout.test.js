const { expect } = require('chai')
const { getMetafieldsForCheckout } = require('../lib/checkout')

describe('checkout / getMetafieldsForCheckout', () => {
  let globalWindowBackup

  before(() => {
    globalWindowBackup = global.window
  })

  after(() => {
    global.window = globalWindowBackup
  })

  const testTable = [
    {
      name: 'should return empty array if window._recart does not exist',
      window: {},
      expected: []
    },
    {
      name: 'should return RecartSessionId if it is on window._recart',
      window: {
        _recart: { getSessionId: () => 'some-session-id' }
      },
      expected: [{ key: 'RecartSessionId', value: 'some-session-id' }]
    },
    {
      name: 'should return RecartShopperId if it is on window._recart',
      window: {
        _recart: { getShopperId: () => 'some-shopper-id' }
      },
      expected: [{ key: 'RecartShopperId', value: 'some-shopper-id' }]
    },
    {
      name: 'should return both RecartSessionId AND RecartShopperId if they exist',
      window: {
        _recart: {
          getSessionId: () => 'some-session-id',
          getShopperId: () => 'some-shopper-id'
        }
      },
      expected: [
        { key: 'RecartSessionId', value: 'some-session-id' },
        { key: 'RecartShopperId', value: 'some-shopper-id' }
      ]
    }
  ]

  testTable.forEach(testCase => {
    it(testCase.name, () => {
      global.window = testCase.window
      const result = getMetafieldsForCheckout()
      expect(result).to.deep.equal(testCase.expected)
    })
  })
})
