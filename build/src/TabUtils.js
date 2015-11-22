'use strict';
Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.parseRow = parseRow;
exports.convertRowToDict = convertRowToDict;
exports.convertRowToObject = convertRowToObject;
exports.parseTab = parseTab;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _Parsers = require('./Parsers');

var _Parsers2 = _interopRequireDefault(_Parsers);

var _Tokenizer = require('./Tokenizer');

var dictKey = '__dict';
var objParseKey = '__obj_parse';

function parseRow(row) {

	var parsed = {};
	Object.keys(row).forEach(function (key) {
		parsed[key] = (0, _Tokenizer.parse)(row[key]);
	});

	return parsed;
}

function convertRowToDict(parent, row) {
	if (typeof row.id !== 'undefined') {
		var clone = Object.assign({}, row);
		delete clone.id;

		parent[row.id] = clone;
	}
}

function convertRowToObject(parent, row, value) {
	console.log('>> obj', row);
}

function parseTab(spreadsheet, tab) {
	var isDict = tab.indexOf(dictKey) !== -1;
	var isObjParse = tab.indexOf(objParseKey) !== -1;
	var rows = undefined;

	//In case is a object should be deepened
	//Just couples of id-copy
	if (isObjParse) {
		rows = {};
		spreadsheet[tab].forEach(function (row) {
			return _Parsers2['default'].deepen(row.id, row.value, rows);
		});
	} else {
		rows = spreadsheet[tab].map(function (row) {
			return parseRow(row);
		});
	}

	return _defineProperty({}, tab, { rows: rows, isDict: isDict, isObjParse: isObjParse });
}
//# sourceMappingURL=TabUtils.js.map