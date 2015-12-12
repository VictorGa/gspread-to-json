'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.parse = parse;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Regexs = require('./Regexs');

var _Regexs2 = _interopRequireDefault(_Regexs);

var _RegexNames = require('./RegexNames');

var _RegexNames2 = _interopRequireDefault(_RegexNames);

var _Parsers = require('./Parsers');

var _Parsers2 = _interopRequireDefault(_Parsers);

var Tokenizer = (function () {
	function Tokenizer() {
		_classCallCheck(this, Tokenizer);
	}

	/**
  * Check which rule to apply for the current element
  * @param element
  * @returns {*}
  */

	_createClass(Tokenizer, null, [{
		key: 'discoverRegex',

		/**
   * Check if regex match
   * @param element
   * @param regexs
   * @param regexName
   * @returns {*}
   */
		value: function discoverRegex(element, regexs, regexName) {
			if (element.match(regexs[regexName].regex)) {
				return { regexName: regexName, element: element };
			}

			return { element: element };
		}

		/**
   * Apply correct regex
   * @param regexElementCouple
   * @returns {*}
   */
	}, {
		key: 'parseElementByRegex',
		value: function parseElementByRegex(regexElementCouple) {
			var result = regexElementCouple.element;

			if (_Regexs2['default'][regexElementCouple.regexName]) {
				result = _Regexs2['default'][regexElementCouple.regexName].parser(regexElementCouple.element);
			}

			return result;
		}
	}]);

	return Tokenizer;
})();

function parse(element) {
	var parsed = Object.keys(_Regexs2['default']).map(Tokenizer.discoverRegex.bind(this, element, _Regexs2['default'])).filter(function (_ref) {
		var regexName = _ref.regexName;
		return typeof regexName !== 'undefined';
	}).map(Tokenizer.parseElementByRegex.bind(this));

	if (parsed.length === 0) {
		console.log('No regex found for ' + element);
	}

	return parsed[0];
}

exports['default'] = Tokenizer;
//# sourceMappingURL=Tokenizer.js.map