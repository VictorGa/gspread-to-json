'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _srcTokenizer = require('./src/Tokenizer');

var _srcTokenizer2 = _interopRequireDefault(_srcTokenizer);

require("babel-core/polyfill");
var SpreadsheetController = require('./src/SpreadsheetController');
var FileWriter = require('./src/FileWriter');
var config = require('../config.json');
var fs = require('fs');
var colors = require('colors');
var Promise = require('native-or-bluebird');

var tokenizer = new _srcTokenizer2['default']();
var invalidMediaProps = ['id', 'title'];

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

var parseCell = function parseCell(cell) {
    var parsed = Object.keys(cell).map(function (key) {
        return tokenizer.parse(cell[key]);
    });

    console.log(parsed);
};

var Main = function Main() {

    var metadata = [fecthSpreadsheet(config.spreadsheetTest)];

    Promise.all(metadata).then(function (results) {
        //Build Id links

        results.forEach(function (spreadsheet) {
            Object.keys(spreadsheet).forEach(function (tab) {
                spreadsheet[tab].forEach(function (element) {
                    return parseCell(element);
                });
            });
        });
    });
};

new Main();
//# sourceMappingURL=main.js.map