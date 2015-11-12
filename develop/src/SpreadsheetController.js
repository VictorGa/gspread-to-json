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
        this.sheet.getInfo((err, sheet_info) => {
            this.data = sheet_info;
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
                    resolve({title: this.data.title, results: Object.assign(...results)});
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

    filter(rows, clean)
    {
        let filtered = [];
        let filteredRow = {};
        let locales = {};

        for (var i = 0; i < rows.length; i++)
        {
            filteredRow = {};

            for (var key in rows[i])
            {
                if (rows[i].hasOwnProperty(key) && this._incompatibleTags.indexOf(key) === -1)
                {
                    let filteredKey;
                    let locale;
                    let value =  clean ? Parsers.cleanSpaces(rows[i][key]) : rows[i][key];

                    //Check if property is localized
                    if(key.indexOf('-locale-') === -1)
                    {
                        filteredKey = Parsers.camelize(Parsers.cleanSpaces(key));
                        filteredRow[filteredKey] = value;
                    }
                    else
                    {
                        filteredKey = Parsers.camelize(Parsers.cleanLocale(Parsers.cleanSpaces(key)));
                        locale = this.extractLocale(key);
                        if(!locales.hasOwnProperty(locale))
                        {
                            locales[locale] = {[filteredKey]: []};
                        }

                        locales[locale][filteredKey].push(value);
                    }

                    //filteredRow[filteredKey] = clean ? Parsers.cleanSpaces(rows[i][key]) : rows[i][key];
                }
            }

            filtered.push(filteredRow);
        }

        return {rows: filtered, locales};
    }

    extractLocale(propertyName)
    {
        //Check if locale is present property name
        return propertyName.split('-').pop();
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

