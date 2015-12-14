'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.filterTabNames = filterTabNames;
exports.execute = execute;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _SpreadsheetController = require('./SpreadsheetController');

var _SpreadsheetController2 = _interopRequireDefault(_SpreadsheetController);

var _RelationParser = require('./RelationParser');

var _TabUtils = require('./TabUtils');

var _FileWriter = require('./FileWriter');

var _Parsers = require('./Parsers');

var _Parsers2 = _interopRequireDefault(_Parsers);

var Promise = require('native-or-bluebird');
var relationKey = '__relation__';

function filterTabNames(tabName) {
	return tabName !== relationKey;
}

function execute(spreadsheets) {
	var _this = this;

	var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

	GLOBAL.isNode = false;

	console.log(GLOBAL.isNode);

	//Fetch spreadsheets
	var spreadsheetsLoaded = Promise.all((0, _SpreadsheetController.loadSpreadsheets)(spreadsheets));

	spreadsheetsLoaded.then(function (results) {
		var fileUrls = {};
		//Build Id links
		results.forEach(function (data) {

			//Get relations if exists
			var relations = undefined;
			var title = data.title;

			var spreadsheet = data.results;
			var tabKeys = Object.keys(spreadsheet);

			console.log('>> results', tabKeys);

			//Check if there is a relation tab
			if (tabKeys.indexOf(relationKey) !== -1) {
				relations = (0, _RelationParser.parseRelations)(spreadsheet[relationKey].rows);

				//Remove it from keys
				var idx = tabKeys.indexOf(relationKey);
				tabKeys.splice(idx, 1);
			}

			//Parse tabs regular tabs
			var parsedTabs = tabKeys.map(_TabUtils.parseTab.bind(_this, spreadsheet));

			//Merge tabs
			parsedTabs = Object.assign.apply(Object, _toConsumableArray(parsedTabs));

			//Once we have all well parsed, let's check relations
			if (typeof relations !== 'undefined') {
				(0, _RelationParser.applyRelations)(relations, parsedTabs);
			}

			//Sort by files and locales
			var files = {};
			Object.keys(parsedTabs).filter(filterTabNames).forEach(function (tabName) {
				var _parsedTabs$tabName = parsedTabs[tabName];
				var rows = _parsedTabs$tabName.rows;
				var localizedRows = _parsedTabs$tabName.localizedRows;

				var locales = Object.keys(localizedRows);

				if (locales.length) {
					locales.forEach(function (locale) {
						//Create locale
						if (typeof files[locale] === 'undefined') {
							files[locale] = {};
						}

						rows = rows.map(function (row, index) {
							var localized = localizedRows[locale][index];
							return Object.assign(row, localized);
						});

						parsedTabs[tabName].rows = rows;
						files[locale][tabName] = parsedTabs[tabName].rows;
					});
				} else {
					if (typeof files[data.title] === 'undefined') {
						files[data.title] = {};
					}

					var tab = tabName;
					if (parsedTabs[tabName].isDict) {
						var dict = {};
						rows.forEach(_TabUtils.convertRowToDict.bind(_this, dict));
						tab = _Parsers2['default'].cleanDict(tabName);
						rows = dict;
					} else if (parsedTabs[tabName].isObjParse) {
						tab = _Parsers2['default'].cleanObjParse(tabName);
					}

					files[data.title][tab] = rows;
				}
			});

			//Save all files
			fileUrls[title] = (0, _FileWriter.writeAll)(files, title);
		});

		callback(fileUrls);
	});
}
//# sourceMappingURL=main.js.map