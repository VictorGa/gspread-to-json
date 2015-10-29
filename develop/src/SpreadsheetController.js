var UtilParser = require('./parser/UtilParser');
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
}

SpreadsheetController.prototype.getAll = function (clean = true) {

    return new Promise((resolve, reject)=>
    {
        let iterables = this.data.worksheets.map((element, index) => {
            return this.getRow(element, clean);
        });

        Promise.all(iterables).then(
            results => {
            //results is an array of objects, each object being a worksheet
            //now we merge all in one object
            resolve(Object.assign(...results));
        },
            error => {
                reject(error);
        });
    });
}

SpreadsheetController.prototype.getRow = function (element, clean) {
    return new Promise((resolve, reject) => {
        element.getRows((err, rows)=> {
            if (err) {
                reject(err);
            }
            else {
                resolve({[element.title]: this.filter(rows, clean)});
            }
        });
    })
}

SpreadsheetController.prototype.filter = function (rows, clean) {
    var filtered = [];
    var filteredRow = {};

    for (var i = 0; i < rows.length; i++) {
        filteredRow = {};

        for (var key in rows[i]) {
            if (rows[i].hasOwnProperty(key) && this._incompatibleTags.indexOf(key) === -1)
            {
                let filteredKey = '';
                if(key.indexOf('locale') === -1)
                {
                    filteredKey = UtilParser.camelize(UtilParser.cleanSpaces(key));
                }
                else
                {
                    filteredKey = UtilParser.cleanSpaces(key);
                }
                filteredRow[filteredKey] = clean ? UtilParser.cleanSpaces(rows[i][key]) : rows[i][key];
            }
        }

        filtered.push(filteredRow);
    }

    return filtered;
}

SpreadsheetController.prototype.getCellsByWorksheetId = function (worksheetId, onReady) {
    for (var i = 0; i < this.data.worksheets.length; i++) {
        if (this.data.worksheets[i].title === worksheetId) {
            this.data.worksheets[i].getCells(this.data.worksheets[i].id, function (off, data) {
                onReady(data);
            });
            return;
        }
    }
}

module.exports = SpreadsheetController;

