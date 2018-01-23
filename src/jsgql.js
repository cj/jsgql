import gql from 'graphql-tag'

export { gql }

export default ({ type, name='', variables, method, fields, types, methodArgs }) => {
  let gqlStr = `${type} ${name}`
  
  const filedsStr = processFields(fields)? `{
    ${processFields(fields)}
  }`: ''
  gqlStr = `${gqlStr}${processName(variables, types)} {
    ${method}${processMethod(variables, methodArgs)}${filedsStr}
  }`

  return gql(gqlStr)
}

const RESERVED_VALUE_KEYS = ['__variable__', '__type__']

export const valueReserved = value => {
  return Object.keys(value).some(key => RESERVED_VALUE_KEYS.includes(key))
}

export const processValue = value => {
  if (value.__variable__) return `$${value.__variable__}`
  else if (value.__type__) return value.__type__
  else return processType(value) === 'String' ? `"${value}"` : value
}

export const processType = obj => {
  let type = {}.toString.call(obj).split(' ')[1].slice(0, -1)

  return type === 'Number' ? 'Int' : type
}

export const processName = (variables, types = {}) => {
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

export const processMethod = (variables, methodArgs) => {
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

export const processMethodArgs = args => {
  if (!args) return ''

  let argsList = []

  for (let name in args) {
    let value = args[name]

    if (!Array.isArray(value) && typeof value === 'object' && !valueReserved(value)) {
      argsList.push(`${name}: { ${processMethodArgs(value)} }`)
    } else {
      if (Array.isArray(value)) value = `[${value.map(v => processValue(v)).join(', ')}]`
      else value = processValue(value)

      argsList.push(`${name}: ${value}`)
    }
  }

  return argsList.join(', ')
}

export const processFields = fields => {
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
