'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Parsers = (function () {
	function Parsers() {
		_classCallCheck(this, Parsers);
	}

	_createClass(Parsers, null, [{
		key: 'toArray',
		value: function toArray(str) {
			str = str.substring(1, str.length - 1).split(',');

			return str;
		}
	}, {
		key: 'deepen',
		value: function deepen(namespace, value, parsed) {
			var t, parts, part;
			t = parsed;
			parts = namespace.split('.');

			while (parts.length) {
				part = parts.shift();
				if (!parts.length) {
					t = t[part] = value;
				} else {
					t = t[part] = t[part] || {};
				}
			}
			return parsed;
		}
	}, {
		key: 'camelize',
		value: function camelize(str) {
			return str.replace(/-(.)/g, function (match, group1) {
				return group1.toUpperCase();
			});
		}
	}, {
		key: 'cleanSpaces',
		value: function cleanSpaces(str) {
			return str.replace(/\s+/g, '');
		}
	}, {
		key: 'cleanLocale',
		value: function cleanLocale(str) {
			var _str = str.replace('-locale-', '-');
			if (typeof _str !== 'undefined') {
				_str = _str.split('-');
				_str.pop();
				return _str.join('-');
			}

			return str;
		}
	}, {
		key: 'cleanDict',
		value: function cleanDict(str) {
			return str.replace('__dict', '');
		}
	}, {
		key: 'cleanObjParse',
		value: function cleanObjParse(str) {
			return str.replace('__obj_parse', '');
		}
	}]);

	return Parsers;
})();

exports['default'] = Parsers;
module.exports = exports['default'];
//# sourceMappingURL=Parsers.js.map