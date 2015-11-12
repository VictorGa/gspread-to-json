'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.fecthSpreadsheet = fecthSpreadsheet;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Parsers = require('./Parsers');

var _Parsers2 = _interopRequireDefault(_Parsers);

var config = require('../../config');
var GoogleSpreadsheet = require("google-spreadsheet");
var Promise = require('native-or-bluebird');

var SpreadsheetController = (function () {
    function SpreadsheetController(id, onReady) {
        _classCallCheck(this, SpreadsheetController);

        this._incompatibleTags = ['_links', 'save', 'del', 'content', '_xml'];

        this.sheet = new GoogleSpreadsheet(id);
        this.sheet.useServiceAccountAuth(config.googleauth, this.init.bind(this, onReady));
    }

    _createClass(SpreadsheetController, [{
        key: 'init',
        value: function init(onReady) {
            var self = this;
            this.sheet.getInfo(function (err, sheet_info) {
                self.data = sheet_info;
                onReady();
            });
        }
    }, {
        key: 'getAll',
        value: function getAll() {
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
        }
    }, {
        key: 'getRow',
        value: function getRow(element, clean) {
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
                        var filteredKey = '';
                        var locale = undefined;

                        //Check if property is localized
                        if (key.indexOf('-locale-') === -1) {
                            filteredKey = _Parsers2['default'].camelize(_Parsers2['default'].cleanSpaces(key));
                        } else {
                            locale = this.extractLocale(key);
                            if (!locales.hasOwnProperty(locale)) {
                                locales[locale] = [];
                            }
                            filteredKey = _Parsers2['default'].camelize(_Parsers2['default'].cleanLocale(_Parsers2['default'].cleanSpaces(key)));

                            locales[locale].push(filteredKey);
                        }

                        filteredRow[filteredKey] = clean ? _Parsers2['default'].cleanSpaces(rows[i][key]) : rows[i][key];
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

function fecthSpreadsheet(spId) {
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
}

;

exports['default'] = SpreadsheetController;
//# sourceMappingURL=SpreadsheetController.js.map