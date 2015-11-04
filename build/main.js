'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _srcSpreadsheetController = require('./src/SpreadsheetController');

var _srcSpreadsheetController2 = _interopRequireDefault(_srcSpreadsheetController);

var _srcTokenizer = require('./src/Tokenizer');

var _srcTokenizer2 = _interopRequireDefault(_srcTokenizer);

var _srcRelationParser = require('./src/RelationParser');

var _srcTabUtils = require('./src/TabUtils');

require("babel-core/polyfill");

var FileWriter = require('./src/FileWriter');
var config = require('../config.json');
var fs = require('fs');
var colors = require('colors');
var Promise = require('native-or-bluebird');

var tokenizer = new _srcTokenizer2['default']();
var invalidMediaProps = ['id', 'title'];
var relationKey = '__relation__';
var dictKey = '__dict';
var objParseKey = '__obj_parse';

var Main = function Main() {
    var _this = this;

    var metadata = [(0, _srcSpreadsheetController.fecthSpreadsheet)(config.spreadsheetTranslations)];

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

            //Parse tabs regular tabs
            var parsedTabs = tabKeys.map(_srcTabUtils.parseTab.bind(_this, spreadsheet));

            //Merge tabs
            parsedTabs = Object.assign.apply(Object, _toConsumableArray(parsedTabs));

            //Once we have all well parsed, let's check relations
            if (typeof relations !== 'undefined') {
                (0, _srcRelationParser.applyRelations)(relations, parsedTabs);
            }

            Object.keys(parsedTabs).forEach(function (tabName) {
                var rows = parsedTabs[tabName].rows;

                if (parsedTabs[tabName].isDict) {
                    var dict = {};
                    rows.forEach(_srcTabUtils.convertRowToDict.bind(_this, dict));
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