'use strict'

const gql = require('graphql-tag')

function jsgql ({ type, name, variables, method, fields, types, methodArgs }) {
  let gqlStr = `${type} ${name}`

  gqlStr = `${gqlStr}${processName(variables, types)} {
    ${method}${processMethod(variables, methodArgs)} {
      ${processFields(fields)}
    }
  }`

  return gql(gqlStr)
}

function processValue (value) {
  return processType(value) === 'String' ? `"${value}"` : value
}

function processType (obj) {
  let type = {}.toString.call(obj).split(' ')[1].slice(0, -1)

  return type === 'Number' ? 'Int' : type
}

function processName (variables, types = {}) {
  if (!variables) return ''
  let variablesList = []

  for (let name in variables) {
    let value = variables[name]
    let type = types[name] || processType(value)

    if (name.includes('id') || name.includes('Id')) type = 'ID'

    variablesList.push(`$${name}: ${type}!`)
  }

  return `(${variablesList.join(', ')})`
}

function processMethod (variables, methodArgs) {
  if (!variables) return methodArgs ? `(${processMethodArgs(methodArgs)})` : ''

  let variablesList = []

  for (let name in variables) {
    variablesList.push(`${name}: $${name}`)
  }

  let methodString = `(${variablesList.join(', ')}`

  if (methodArgs) methodString += `, ${processMethodArgs(methodArgs)}`

  methodString += ')'

  return methodString
}

function processMethodArgs (args) {
  if (!args) return ''

  let argsList = []

  for (let name in args) {
    let value = args[name]

    if (!Array.isArray(value) && typeof value === 'object' && !value.__variable__) {
      argsList.push(`${name}: { ${processMethodArgs(value)} }`)
    } else {
      if (Array.isArray(value)) value = `[${value.map(v => processValue(v)).join(', ')}]`
      else if (typeof value === 'object') value = `$${value.__variable__}`
      else value = processValue(value)

      argsList.push(`${name}: ${value}`)
    }
  }

  return argsList.join(', ')
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
exports.processMethodArgs = processMethodArgs
exports.processFields = processFields
exports.processType = processType
exports.processValue = processValue
exports.gql = gql
