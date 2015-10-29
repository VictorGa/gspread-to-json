'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

    _createClass(Tokenizer, [{
        key: 'parse',
        value: function parse(element) {
            return Object.keys(_Regexs2['default']).map(this.discoverRegex.bind(this, element, _Regexs2['default'])).filter(function (regexElement) {
                return typeof regexElement !== 'undefined';
            }).map(this.parseElementByRegex.bind(this));
        }
    }, {
        key: 'discoverRegex',
        value: function discoverRegex(element, regexs, regexName) {
            if (element.match(regexs[regexName])) {
                return { regexName: regexName, element: element };
            }
        }
    }, {
        key: 'parseElementByRegex',
        value: function parseElementByRegex(regexElementCouple) {
            var result = undefined;
            switch (regexElementCouple.regexName) {
                case _RegexNames2['default'].ARRAY:
                    result = _Parsers2['default'].toArray(regexElementCouple.element);
                    break;
            }

            return result;
        }
    }]);

    return Tokenizer;
})();

exports['default'] = Tokenizer;
module.exports = exports['default'];
//# sourceMappingURL=Tokenizer.js.map