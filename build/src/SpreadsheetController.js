'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.fecthSpreadsheet = fecthSpreadsheet;
exports.loadSpreadsheets = loadSpreadsheets;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Parsers = require('./Parsers');

var _Parsers2 = _interopRequireDefault(_Parsers);

var config = require('../../gspreadfile');
var GoogleSpreadsheet = require("google-spreadsheet");
var Promise = require('native-or-bluebird');

/**
 * Controller fetching spreadsheet data
 * Parsing data keeping non needed key words out
 */

var SpreadsheetController = (function () {
	function SpreadsheetController(id, name, onReady) {
		_classCallCheck(this, SpreadsheetController);

		this._incompatibleTags = ['_links', 'save', 'del', 'content', '_xml'];

		this.sheet = new GoogleSpreadsheet(id);
		this.sheet.useServiceAccountAuth(config.googleauth, this.init.bind(this, onReady));
		this.name = name;
	}

	/**
  * Fetch spreadsheet
  * @param spId
  * @param cleanSpaces
  * @returns {exports|module.exports}
  */

	_createClass(SpreadsheetController, [{
		key: 'init',
		value: function init(onReady) {
			var _this = this;

			this.sheet.getInfo(function (err, sheet_info) {
				_this.data = sheet_info;
				onReady();
			});
		}
	}, {
		key: 'getAll',
		value: function getAll() {
			var _this2 = this;

			var clean = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

			return new Promise(function (resolve, reject) {
				var iterables = _this2.data.worksheets.map(function (element, index) {
					return _this2.getRow(element, clean);
				});

				Promise.all(iterables).then(function (results) {
					//results is an array of objects, each object being a worksheet
					//now we merge all in one object
					var title = typeof _this2.name === 'undefined' ? _this2.data.title : _this2.name;
					resolve({ title: title, results: Object.assign.apply(Object, _toConsumableArray(results)) });
				}, function (error) {
					reject(error);
				});
			});
		}
	}, {
		key: 'getRow',
		value: function getRow(element, clean) {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				element.getRows(function (err, rows) {
					if (err) {
						reject(err);
					} else {
						resolve(_defineProperty({}, element.title, _this3.filter(rows, clean)));
					}
				});
			});
		}
	}, {
		key: 'filter',
		value: function filter(rows, clean) {
			var filtered = [];
			var filteredRow = {};
			var locales = {};

			for (var i = 0; i < rows.length; i++) {
				filteredRow = {};

				for (var key in rows[i]) {
					if (rows[i].hasOwnProperty(key) && this._incompatibleTags.indexOf(key) === -1) {
						var filteredKey = undefined;
						var locale = undefined;
						var value = clean ? _Parsers2['default'].cleanSpaces(rows[i][key]) : rows[i][key];

						//Check if property is localized
						if (key.indexOf('-locale-') === -1) {
							filteredKey = _Parsers2['default'].camelize(_Parsers2['default'].cleanSpaces(key));
							filteredRow[filteredKey] = value;
						} else {
							filteredKey = _Parsers2['default'].camelize(_Parsers2['default'].cleanLocale(_Parsers2['default'].cleanSpaces(key)));
							locale = this.extractLocale(key);
							if (!locales.hasOwnProperty(locale)) {
								locales[locale] = _defineProperty({}, filteredKey, []);
							}

							locales[locale][filteredKey].push(value);
						}
					}
				}

				filtered.push(filteredRow);
			}

			return { rows: filtered, locales: locales };
		}
	}, {
		key: 'extractLocale',
		value: function extractLocale(propertyName) {
			//Check if locale is present property name
			return propertyName.split('-').pop();
		}
	}, {
		key: 'getCellsByWorksheetId',
		value: function getCellsByWorksheetId(worksheetId, onReady) {
			for (var i = 0; i < this.data.worksheets.length; i++) {
				if (this.data.worksheets[i].title === worksheetId) {
					this.data.worksheets[i].getCells(this.data.worksheets[i].id, function (off, data) {
						onReady(data);
					});
					return;
				}
			}
		}
	}]);

	return SpreadsheetController;
})();

function fecthSpreadsheet(spId, name) {
	var cleanSpaces = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

	console.log(('Fetching data from ' + spId).bgBlue.white);
	return new Promise(function (resolve, reject) {
		var spreadsheet = new SpreadsheetController(spId, name, function () {
			spreadsheet.getAll(cleanSpaces).then(function (data) {
				return resolve(data);
			}, function (error) {
				return reject(error);
			});
		});
	});
}

;

/**
 * Create a list of promises for spreadsheets
 * @param list
 * @returns {Array}
 */

function loadSpreadsheets(list) {

	var metadata = [];
	list.forEach(function (spreadsheet) {
		metadata.push(fecthSpreadsheet(spreadsheet.id, spreadsheet.name, JSON.parse(spreadsheet.cleanSpaces)));
	});

	return metadata;
}

;

exports['default'] = SpreadsheetController;
//# sourceMappingURL=SpreadsheetController.js.map