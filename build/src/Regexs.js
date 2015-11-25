'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _regexs;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _RegexNames = require('./RegexNames');

var _RegexNames2 = _interopRequireDefault(_RegexNames);

var _Parsers = require('./Parsers');

var _Parsers2 = _interopRequireDefault(_Parsers);

/**
 * Regular expressions and parser for each
 * @type {{}}
 */
var regexs = (_regexs = {}, _defineProperty(_regexs, _RegexNames2['default'].ARRAY, { regex: /^[\[][\w,;_ ]*[\]]$/gi, parser: _Parsers2['default'].toArray }), _defineProperty(_regexs, _RegexNames2['default'].DOT_SEPARATED, { regex: /^\w+(\.\w+)+$/gm, parser: _Parsers2['default'].deepen }), _defineProperty(_regexs, _RegexNames2['default'].OBJECT, { regex: /{([^}]+)}/, parser: JSON.parse }), _regexs);

exports['default'] = regexs;
module.exports = exports['default'];
//# sourceMappingURL=Regexs.js.map