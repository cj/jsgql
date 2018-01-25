/**
 * jsgql v1.0.5
 * (c) 2018 CJ Lazell
 * @license MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('graphql-tag')) :
	typeof define === 'function' && define.amd ? define(['exports', 'graphql-tag'], factory) :
	(factory((global.jsgql = {}),global['graphql-tag']));
}(this, (function (exports,gql) { 'use strict';

gql = gql && gql.hasOwnProperty('default') ? gql['default'] : gql;

var errorMsg = {
  noFields: 'At least one field is required.',
};
var jsgql = function (ref) {
  var type = ref.type;
  var name = ref.name;
  var variables = ref.variables;
  var method = ref.method;
  var fields = ref.fields;
  var types = ref.types;
  var methodArgs = ref.methodArgs;
  var gqlStr = type + " " + name;
  var processedFields = fields ? ("{\n    " + (processFields(fields)) + "\n  }") : '';
  gqlStr = "" + gqlStr + (processName(variables, types)) + " {\n    " + method + (processMethod(variables, methodArgs)) + " " + processedFields + "\n  }";
  return gql(gqlStr)
};
var RESERVED_VALUE_KEYS = ['__variable__', '__type__'];
var valueReserved = function (value) {
  return Object.keys(value).some(function (key) { return RESERVED_VALUE_KEYS.includes(key); })
};
var processValue = function (value) {
  if (value.__variable__) { return ("$" + (value.__variable__)) }
  else if (value.__type__) { return value.__type__ }
  else { return processType(value) === 'String' ? ("\"" + value + "\"") : value }
};
var processType = function (obj) {
  var type = {}.toString.call(obj).split(' ')[1].slice(0, -1);
  return type === 'Number' ? 'Int' : type
};
var processName = function (variables, types) {
  if ( types === void 0 ) types = {};
  if (!variables) { return '' }
  var variablesList = [];
  for (var name in variables) {
    var value = variables[name];
    var type = types[name] || processType(value);
    if (name.includes('id') || name.includes('Id')) { type = 'ID'; }
    variablesList.push(("$" + name + ": " + type + "!"));
  }
  return ("(" + (variablesList.join(', ')) + ")")
};
var processMethod = function (variables, methodArgs) {
  if (!variables) { return methodArgs ? ("(" + (processMethodArgs(methodArgs)) + ")") : '' }
  var variablesList = [];
  for (var name in variables) {
    variablesList.push((name + ": $" + name));
  }
  var methodString = "(" + (variablesList.join(', '));
  if (methodArgs) { methodString += ", " + (processMethodArgs(methodArgs)); }
  methodString += ')';
  return methodString
};
var processMethodArgs = function (args) {
  if (!args) { return '' }
  var argsList = [];
  for (var name in args) {
    var value = args[name];
    if (!Array.isArray(value) && typeof value === 'object' && !valueReserved(value)) {
      argsList.push((name + ": { " + (processMethodArgs(value)) + " }"));
    } else {
      if (Array.isArray(value)) { value = "[" + (value.map(function (v) { return processValue(v); }).join(', ')) + "]"; }
      else { value = processValue(value); }
      argsList.push((name + ": " + value));
    }
  }
  return argsList.join(', ')
};
var processFields = function (fields, root) {
  if ( root === void 0 ) root = true;
  if (!fields) { return '' }
  return fields.reduce(function (fieldsStr, field) {
    if (Array.isArray(field)) {
      var key = field[0];
      var subFields = field[1];
      fieldsStr += " " + key + " {\n        " + (processFields(subFields, false)) + "\n      }";
    } else {
      fieldsStr += field + "\n";
    }
    return fieldsStr
  }, '')
};

exports.gql = gql;
exports.errorMsg = errorMsg;
exports['default'] = jsgql;
exports.valueReserved = valueReserved;
exports.processValue = processValue;
exports.processType = processType;
exports.processName = processName;
exports.processMethod = processMethod;
exports.processMethodArgs = processMethodArgs;
exports.processFields = processFields;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=jsgql.js.map
