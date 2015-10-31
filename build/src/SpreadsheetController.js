'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _Parsers = require('./Parsers');

var _Parsers2 = _interopRequireDefault(_Parsers);

var config = require('../../config');
var GoogleSpreadsheet = require("google-spreadsheet");
var Promise = require('native-or-bluebird');

function SpreadsheetController(id, onReady) {
    this._incompatibleTags = ['_links', 'save', 'del', 'content', '_xml'];

    this.sheet = new GoogleSpreadsheet(id);
    this.sheet.useServiceAccountAuth(config.googleauth, this.init.bind(this, onReady));
}

SpreadsheetController.prototype.init = function (onReady) {
    var self = this;
    this.sheet.getInfo(function (err, sheet_info) {
        self.data = sheet_info;
        onReady();
    });
};

SpreadsheetController.prototype.getAll = function () {
    var _this = this;

    var clean = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    return new Promise(function (resolve, reject) {
        var iterables = _this.data.worksheets.map(function (element, index) {
            return _this.getRow(element, clean);
        });

        Promise.all(iterables).then(function (results) {
            //results is an array of objects, each object being a worksheet
            //now we merge all in one object
            resolve(Object.assign.apply(Object, _toConsumableArray(results)));
        }, function (error) {
            reject(error);
        });
    });
};

SpreadsheetController.prototype.getRow = function (element, clean) {
    var _this2 = this;

    return new Promise(function (resolve, reject) {
        element.getRows(function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(_defineProperty({}, element.title, _this2.filter(rows, clean)));
            }
        });
    });
};

SpreadsheetController.prototype.filter = function (rows, clean) {
    var filtered = [];
    var filteredRow = {};

    for (var i = 0; i < rows.length; i++) {
        filteredRow = {};

        for (var key in rows[i]) {
            if (rows[i].hasOwnProperty(key) && this._incompatibleTags.indexOf(key) === -1) {
                var filteredKey = '';
                if (key.indexOf('locale') === -1) {
                    filteredKey = _Parsers2['default'].camelize(_Parsers2['default'].cleanSpaces(key));
                } else {
                    filteredKey = _Parsers2['default'].cleanSpaces(key);
                }
                filteredRow[filteredKey] = clean ? _Parsers2['default'].cleanSpaces(rows[i][key]) : rows[i][key];
            }
        }

        filtered.push(filteredRow);
    }

    return filtered;
};

SpreadsheetController.prototype.getCellsByWorksheetId = function (worksheetId, onReady) {
    for (var i = 0; i < this.data.worksheets.length; i++) {
        if (this.data.worksheets[i].title === worksheetId) {
            this.data.worksheets[i].getCells(this.data.worksheets[i].id, function (off, data) {
                onReady(data);
            });
            return;
        }
    }
};

module.exports = SpreadsheetController;
//# sourceMappingURL=SpreadsheetController.js.map