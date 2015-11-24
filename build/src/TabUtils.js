'use strict';
Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.parseRow = parseRow;
exports.convertRowToDict = convertRowToDict;
exports.parseTab = parseTab;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _Parsers = require('./Parsers');

var _Parsers2 = _interopRequireDefault(_Parsers);

var _Tokenizer = require('./Tokenizer');

var dictKey = '__dict';
var objParseKey = '__obj_parse';

/**
 * For each row parse content applying rules
 * @param row
 * @returns {{}}
 */

function parseRow(row) {
	var parsed = {};
	Object.keys(row).forEach(function (key) {
		parsed[key] = (0, _Tokenizer.parse)(row[key]);
	});

	return parsed;
}

/**
 * Set the whole row as dictionary
 * [id] : data
 * @param parent
 * @param row
 */

function convertRowToDict(parent, row) {
	if (typeof row.id !== 'undefined') {
		var clone = Object.assign({}, row);
		delete clone.id;

		console.log('>>> ', parent);
		parent[row.id] = clone;
	}
}

/**
 * Parse spreadsheet tab.
 * Loop each tab's row and apply regexs
 * @param spreadsheet
 * @param tab
 * @returns {{}}
 */

function parseTab(spreadsheet, tab) {
	var isDict = tab.indexOf(dictKey) !== -1;
	var isObjParse = tab.indexOf(objParseKey) !== -1;
	var rows = undefined;
	var localizedRows = {};

	//In case is a object should be deepened
	//Just couples of id-copy
	if (isObjParse) {
		rows = {};
		spreadsheet[tab].rows.forEach(function (row) {
			return _Parsers2['default'].deepen(row.id, row.value, rows);
		});
	} else {
		Object.keys(spreadsheet[tab].locales).forEach(function (locale) {
			if (typeof localizedRows[locale] === 'undefined') {
				localizedRows[locale] = [];
			}

			var values = spreadsheet[tab].locales[locale];
			Object.keys(values).forEach(function (propertyName) {
				values[propertyName].forEach(function (value) {
					localizedRows[locale].push(parseRow(_defineProperty({}, propertyName, value)));
				});
			});
		});

		rows = spreadsheet[tab].rows.map(function (row) {
			return parseRow(row);
		});
	}

	return _defineProperty({}, tab, { rows: rows, isDict: isDict, isObjParse: isObjParse, localizedRows: localizedRows, isLocalized: typeof spreadsheet[tab].locales !== 'undefined' });
}
//# sourceMappingURL=TabUtils.js.map