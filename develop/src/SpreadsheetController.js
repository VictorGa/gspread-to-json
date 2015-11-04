import Parsers from './Parsers';
var config = require('../../config');
var GoogleSpreadsheet = require("google-spreadsheet");
var Promise = require('native-or-bluebird');

class SpreadsheetController
{
    constructor(id, onReady)
    {
        this._incompatibleTags = ['_links', 'save', 'del', 'content', '_xml'];

        this.sheet = new GoogleSpreadsheet(id);
        this.sheet.useServiceAccountAuth(config.googleauth, this.init.bind(this, onReady));
    }

    init(onReady) {
        var self = this;
        this.sheet.getInfo(function (err, sheet_info) {
            self.data = sheet_info;
            onReady();
        });
    }

    getAll(clean = true) {

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

    getRow(element, clean) {
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

    filter(rows, clean) {
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
                        filteredKey = Parsers.camelize(Parsers.cleanSpaces(key));
                    }
                    else
                    {
                        filteredKey = Parsers.cleanSpaces(key);
                    }
                    filteredRow[filteredKey] = clean ? Parsers.cleanSpaces(rows[i][key]) : rows[i][key];
                }
            }

            filtered.push(filteredRow);
        }

        return filtered;
    }

    getCellsByWorksheetId(worksheetId, onReady) {
        for (var i = 0; i < this.data.worksheets.length; i++) {
            if (this.data.worksheets[i].title === worksheetId) {
                this.data.worksheets[i].getCells(this.data.worksheets[i].id, function (off, data) {
                    onReady(data);
                });
                return;
            }
        }
    }

}

export function fecthSpreadsheet(spId, cleanSpaces = true) {

    console.log(`Fetching data from ${spId}`.bgBlue.white);
    return new Promise((resolve, reject) => {
        let spreadsheet = new SpreadsheetController(spId, ()=> {
            spreadsheet.getAll(cleanSpaces).then(data => resolve(data), error => reject(error));
        });
    });
};

export default SpreadsheetController;

