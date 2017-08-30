const jsgql = require('./jsgql')
const {
  processName,
  processMethod,
  processFields,
  typeOf,
} = require('./jsgql')

const cleanGqlString = str => {
  return str.replace(/\r?\n|\r/g, '').replace(/ +(?= )/g, '')
}

describe('jsgql', () => {
  test('should return graphql-tag gql object', () => {
    const testGql = {
      type: 'query',
      name: 'test',
      method: 'testMethod',
      variables: {
        id: 1,
        foo: 'bar',
      },
      types: {
        bar: 'Baz',
      },
      fields: [
        'id',
        ['foo', [
          'id', 'bar',
        ]],
      ],
    }

    expect(jsgql(testGql).kind).toBe('Document')
  })

  test('processName', () => {
    expect(processName('')).toBe('')
    expect(processName({ foo: 'bar' })).toBe('($foo: String!)')
    expect(processName({ id: 1 })).toBe('($id: ID!)')
    expect(processName({ someId: 1 })).toBe('($someId: ID!)')
    expect(processName({ foo: 1 })).toBe('($foo: Int!)')
    expect(processName({ foo: true })).toBe('($foo: Boolean!)')
    expect(processName({ bar: true }, { bar: 'Baz' })).toBe('($bar: Baz!)')
  })

  test('processMethod', () => {
    expect(processMethod('')).toBe('')
    expect(processMethod({ foo: 'bar' })).toBe('(foo: $foo)')
  })

  test('processFields', () => {
    expect(processFields('')).toBe('')
    expect(cleanGqlString(processFields([
      'id',
      ['foo', [
        'bar',
      ]],
    ]))).toBe('id foo { bar }')
  })

  test('typeOf', () => {
    expect(typeOf('foo')).toBe('String')
    expect(typeOf(1)).toBe('Int')
  })
})
