<h1 align="center">jsgql</h1>

<p align="center">
  <q>Javascript to <a href="https://github.com/apollographql/graphql-tag#gql">graphql-tag/gql</a></q>
</p>

<p align="center">
  <a href="https://travis-ci.org/cj/jsgql"><img src="https://img.shields.io/travis/cj/jsgql/master.svg" alt="Build Status" target="_blank"></a>
  <a href="https://coveralls.io/github/cj/jsgql?branch=master"><img src="https://img.shields.io/coveralls/cj/jsgql/master.svg" alt="Coverage Status" target="_blank"></a>
  <a href="https://www.npmjs.com/package/jsgql"><img src="https://img.shields.io/npm/dt/jsgql.svg" alt="Downloads" target="_blank"></a>
  <a href="https://github.com/cj/jsgql/blob/master/LICENSE.md"><img src="https://img.shields.io/npm/l/jsgql.svg" alt="License" target="_blank"></a>
</p>

**Install**

`yarn add jsgql@latest`

**Description**

Converts a javascript object to a [graphql-tag/gql] object.

**Use**
```javascript
import jsgql from 'jsgql'

const testGql = {
  type: 'query',
  name: 'test',
  method: 'testMethod',
  variables: {
    id: 1,
    foo: 'bar',
    bar: 'baz',
  },
  types: {
    foo: 'Baz',
  },
  fields: [
    'id',
    ['foo', [
      'id', 'bar',
    ]],
  ],
}

console.log(jsgql(testGql))
// {
//   "kind": "Document",
// ...
```

**The string that's created by the above object and sent to [graphql-tag/gql]**

```graphql
query name($id: ID!, $foo: Baz!, $bar: String!) {
  testMethod(id: $id, foo: $foo, bar: $bar) {
    id
    foo {
      id
      bar
    }
  }
}
```

[graphql-tag/gql]: https://github.com/apollographql/graphql-tag#gql
