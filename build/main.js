'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.filterTabNames = filterTabNames;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _srcSpreadsheetController = require('./src/SpreadsheetController');

var _srcSpreadsheetController2 = _interopRequireDefault(_srcSpreadsheetController);

var _srcRelationParser = require('./src/RelationParser');

var _srcTabUtils = require('./src/TabUtils');

var _srcFileWriter = require('./src/FileWriter');

var _srcParsers = require('./src/Parsers');

var _srcParsers2 = _interopRequireDefault(_srcParsers);

require("babel-core/polyfill");
var config = require('../config.json');
var fs = require('fs');
var colors = require('colors');
var Promise = require('native-or-bluebird');

var relationKey = '__relation__';

function filterTabNames(tabName) {
	return tabName !== relationKey;
}

Promise.all((0, _srcSpreadsheetController.loadSpreadsheets)(config.spreadsheets)).then(function (results) {
	//Build Id links
	results.forEach(function (data) {
		//Get relations if exists
		var relations = undefined;
		var spreadsheet = data.results;
		var tabKeys = Object.keys(spreadsheet);

		//Check if there is a relation tab
		if (tabKeys.includes(relationKey)) {
			relations = (0, _srcRelationParser.parseRelations)(spreadsheet[relationKey].rows);

			//Remove it from keys
			var idx = tabKeys.indexOf(relationKey);
			tabKeys.splice(idx, 1);
		}

		//Parse tabs regular tabs
		var parsedTabs = tabKeys.map(_srcTabUtils.parseTab.bind(undefined, spreadsheet));

		//Merge tabs
		parsedTabs = Object.assign.apply(Object, _toConsumableArray(parsedTabs));

		//Once we have all well parsed, let's check relations
		if (typeof relations !== 'undefined') {
			(0, _srcRelationParser.applyRelations)(relations, parsedTabs);
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
					rows.forEach(_srcTabUtils.convertRowToDict.bind(undefined, dict));
					tab = _srcParsers2['default'].cleanDict(tabName);
					rows = dict;
				} else if (parsedTabs[tabName].isObjParse) {
					tab = _srcParsers2['default'].cleanObjParse(tabName);
				}

				files[data.title][tab] = rows;
			}
		});

		//Save all files
		(0, _srcFileWriter.writeAll)(files);
	});
});
//# sourceMappingURL=main.js.map