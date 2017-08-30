/**
 * jsgql v0.0.1
 * (c) 2017 CJ Lazell
 * @license MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('graphql-tag')) :
	typeof define === 'function' && define.amd ? define(['exports', 'graphql-tag'], factory) :
	(factory((global.jsgql = {}),global['graphql-tag']));
}(this, (function (exports,graphqlTag) { 'use strict';

graphqlTag = graphqlTag && graphqlTag.hasOwnProperty('default') ? graphqlTag['default'] : graphqlTag;

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var jsgql_1 = createCommonjsModule(function (module, exports) {
'use strict';
function jsgql (ref) {
  var type = ref.type;
  var name = ref.name;
  var variables = ref.variables;
  var method = ref.method;
  var fields = ref.fields;
  var types = ref.types;
  var gqlStr = type + " " + name;
  gqlStr = "" + gqlStr + (processName(variables, types)) + " {\n    " + method + (processMethod(variables)) + " {\n      " + (processFields(fields)) + "\n    }\n  }";
  return graphqlTag(gqlStr)
}
function typeOf (obj) {
  var type = {}.toString.call(obj).split(' ')[1].slice(0, -1);
  return type === 'Number' ? 'Int' : type
}
function processName (variables, types) {
  if ( types === void 0 ) types = {};
  if (!variables) { return '' }
  var variablesList = [];
  for (var name in variables) {
    var value = variables[name];
    var type = types[name] || typeOf(value);
    if (name.includes('id') || name.includes('Id')) { type = 'ID'; }
    variablesList.push(("$" + name + ": " + type + "!"));
  }
  return ("(" + (variablesList.join(', ')) + ")")
}
function processMethod (variables) {
  if (!variables) { return '' }
  var variablesList = [];
  for (var name in variables) {
    variablesList.push((name + ": $" + name));
  }
  return ("(" + (variablesList.join(', ')) + ")")
}
function processFields (fields) {
  if (!fields) { return '' }
  return fields.reduce(function (fieldsStr, field) {
    if (Array.isArray(field)) {
      var key = field[0];
      var subFields = field[1];
      fieldsStr += " " + key + " {\n        " + (processFields(subFields)) + "\n      }";
    } else {
      fieldsStr += field + "\n";
    }
    return fieldsStr
  }, '')
}
exports = module.exports = jsgql;
exports.processName = processName;
exports.processMethod = processMethod;
exports.processFields = processFields;
exports.typeOf = typeOf;
exports.gql = graphqlTag;
});
var jsgql_2 = jsgql_1.processName;
var jsgql_3 = jsgql_1.processMethod;
var jsgql_4 = jsgql_1.processFields;
var jsgql_5 = jsgql_1.typeOf;
var jsgql_6 = jsgql_1.gql;

exports['default'] = jsgql_1;
exports.processName = jsgql_2;
exports.processMethod = jsgql_3;
exports.processFields = jsgql_4;
exports.typeOf = jsgql_5;
exports.gql = jsgql_6;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=jsgql.js.map
