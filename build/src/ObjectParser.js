'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.parseTab = parseTab;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _UtilParser = require('./UtilParser');

var _UtilParser2 = _interopRequireDefault(_UtilParser);

function parseTab(rows) {
	var objectRows = {};
	rows.forEach(function (row) {
		if (typeof row.id === 'undefined') {
			throw 'In object parse must be id';
		}

		_UtilParser2['default'].deepen(row.id);
	});
}
//# sourceMappingURL=ObjectParser.js.map