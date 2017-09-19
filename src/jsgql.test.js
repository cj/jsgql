import jsgql, {
  processName,
  processMethod,
  processMethodArgs,
  processFields,
  processType,
  processValue,
} from './jsgql'

const cleanGqlString = str => {
  return str.replace(/\r?\n|\r/g, '').replace(/ +(?= )/g, '')
}

describe('jsgql', () => {
  test('should return graphql-tag gql object', () => {
    const testGql = {
      type: 'query',
      name: 'test',
      method: 'testMethod',
      methodArgs: {
        last: 1,
        filter: {
          barIn: ['test'],
          foo: {__variable__: 'foo'},
          bar: {__type__: 'BAZ'},
        },
      },
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
    expect(processMethod(null, { foo: 'bar' })).toBe('(foo: "bar")')
  })

  test('processMethodArgs', () => {
    expect(processMethodArgs('')).toBe('')
    expect(processMethodArgs({ foo: 'bar' })).toBe('foo: "bar"')
    expect(processMethodArgs({ foo: { __variable__: 'bar' } })).toBe('foo: $bar')
    expect(processMethodArgs({ foo: { __type__: 'BAR' } })).toBe('foo: BAR')
    expect(processMethodArgs({ foo: ['bar', 'baz'] })).toBe('foo: ["bar", "baz"]')
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

  test('processType', () => {
    expect(processType('foo')).toBe('String')
    expect(processType(1)).toBe('Int')
  })

  test('processValue', () => {
    expect(processValue('foo')).toBe('"foo"')
    expect(processValue(1)).toBe(1)
  })
})
