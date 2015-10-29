'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _RegexNames = require('./RegexNames');

var _RegexNames2 = _interopRequireDefault(_RegexNames);

var regexs = _defineProperty({}, _RegexNames2['default'].ARRAY, /^[\[][\w,;_ ]*[\]]$/gi);

exports['default'] = regexs;
module.exports = exports['default'];
//# sourceMappingURL=Regexs.js.map