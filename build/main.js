'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _srcTokenizer = require('./src/Tokenizer');

var _srcTokenizer2 = _interopRequireDefault(_srcTokenizer);

var _srcRelationParser = require('./src/RelationParser');

require("babel-core/polyfill");
var SpreadsheetController = require('./src/SpreadsheetController');
var FileWriter = require('./src/FileWriter');
var config = require('../config.json');
var fs = require('fs');
var colors = require('colors');
var Promise = require('native-or-bluebird');

var tokenizer = new _srcTokenizer2['default']();
var invalidMediaProps = ['id', 'title'];
var relationKey = '__relation__';
var dictKey = '__dict';

var fecthSpreadsheet = function fecthSpreadsheet(spId) {
    var cleanSpaces = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    console.log(('Fetching data from ' + spId).bgBlue.white);
    return new Promise(function (resolve, reject) {
        var spreadsheet = new SpreadsheetController(spId, function () {
            spreadsheet.getAll(cleanSpaces).then(function (data) {
                return resolve(data);
            }, function (error) {
                return reject(error);
            });
        });
    });
};

var parseRow = function parseRow(row) {

    var parsed = {};
    Object.keys(row).forEach(function (key) {
        parsed[key] = tokenizer.parse(row[key]);
    });

    return parsed;
};

var convertRowToDict = function convertRowToDict(parent, row) {
    if (typeof row.id !== 'undefined') {
        var clone = Object.assign({}, row);
        delete clone.id;

        parent[row.id] = clone;
    }
};

var parseTab = function parseTab(spreadsheet, tab) {
    var rows = spreadsheet[tab].map(function (row) {
        return parseRow(row);
    });
    var isDict = tab.indexOf(dictKey) !== -1;

    return _defineProperty({}, tab, { rows: rows, isDict: isDict });
};

var Main = function Main() {
    var _this = this;

    var metadata = [fecthSpreadsheet(config.spreadsheetTest)];

    Promise.all(metadata).then(function (results) {
        //Build Id links
        results.forEach(function (spreadsheet) {

            //Get relations if exists
            var relations = undefined;
            var tabKeys = Object.keys(spreadsheet);
            console.log(tabKeys);
            if (tabKeys.includes(relationKey)) {
                relations = (0, _srcRelationParser.parseRelations)(spreadsheet[relationKey]);

                //Remove it from keys
                var idx = tabKeys.indexOf(relationKey);
                tabKeys.splice(idx, 1);
            }

            //Parse tabs
            var parsedTabs = tabKeys.map(parseTab.bind(_this, spreadsheet));

            //Unified tabs
            parsedTabs = Object.assign.apply(Object, _toConsumableArray(parsedTabs));

            //Once we have all well parsed, let's check relations
            if (typeof relations !== 'undefined') {
                (0, _srcRelationParser.applyRelations)(relations, parsedTabs);
            }

            Object.keys(parsedTabs).forEach(function (tabName) {
                var rows = parsedTabs[tabName].rows;

                if (parsedTabs[tabName].isDict) {
                    var dict = {};
                    rows.forEach(convertRowToDict.bind(_this, dict));
                    parsedTabs[tabName] = dict;
                } else {
                    parsedTabs[tabName] = rows;
                }
            });

            console.log(parsedTabs);
        });
    });
};

new Main();
//# sourceMappingURL=main.js.map