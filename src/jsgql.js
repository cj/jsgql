'use strict'

const gql = require('graphql-tag')

function jsgql ({ type, name, variables, method, fields, types }) {
  let gqlStr = `${type} ${name}`

  gqlStr = `${gqlStr}${processName(variables, types)} {
    ${method}${processMethod(variables)} {
      ${processFields(fields)}
    }
  }`

  return gql(gqlStr)
}

function typeOf (obj) {
  let type = {}.toString.call(obj).split(' ')[1].slice(0, -1)

  return type === 'Number' ? 'Int' : type
}

function processName (variables, types = {}) {
  if (!variables) return ''
  let variablesList = []

  for (let name in variables) {
    let value = variables[name]
    let type = types[name] || typeOf(value)

    if (name.includes('id') || name.includes('Id')) type = 'ID'

    variablesList.push(`$${name}: ${type}!`)
  }

  return `(${variablesList.join(', ')})`
}

function processMethod (variables) {
  if (!variables) return ''

  let variablesList = []

  for (let name in variables) {
    variablesList.push(`${name}: $${name}`)
  }

  return `(${variablesList.join(', ')})`
}

function processFields (fields) {
  if (!fields) return ''

  return fields.reduce((fieldsStr, field) => {
    if (Array.isArray(field)) {
      let [key, subFields] = field

      fieldsStr += ` ${key} {
        ${processFields(subFields)}
      }`
    } else {
      fieldsStr += `${field}\n`
    }

    return fieldsStr
  }, '')
}

exports = module.exports = jsgql
exports.processName = processName
exports.processMethod = processMethod
exports.processFields = processFields
exports.typeOf = typeOf
exports.gql = gql
