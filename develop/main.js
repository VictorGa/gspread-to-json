require("babel-core/polyfill");
var SpreadsheetController = require('./src/SpreadsheetController');
var FileWriter = require('./src/FileWriter');
var config = require('../config.json');
var fs = require('fs');
var colors = require('colors');
var Promise = require('native-or-bluebird');

import Tokenizer from './src/Tokenizer';
import {parseRelations,applyRelations} from './src/RelationParser';

let tokenizer = new Tokenizer();
let invalidMediaProps = ['id', 'title'];
const relationKey = '__relation__';
const dictKey = '__dict';

let fecthSpreadsheet = (spId, cleanSpaces = true) => {

    console.log(`Fetching data from ${spId}`.bgBlue.white);
    return new Promise((resolve, reject) => {
        let spreadsheet = new SpreadsheetController(spId, ()=> {
            spreadsheet.getAll(cleanSpaces).then(data => resolve(data), error => reject(error));
        });
    });
};

let parseRow = (row) => {

    let parsed = {};
    Object.keys(row).forEach(key => {
        parsed[key] = tokenizer.parse(row[key]);
    });

    return parsed;
}

let convertRowToDict = (parent, row) => {
    if (typeof row.id !== 'undefined') {
        let clone = Object.assign({}, row);
        delete clone.id;

        parent[row.id] = clone;
    }

}

let parseTab = (spreadsheet, tab) => {
    let rows = spreadsheet[tab].map(row => parseRow(row));
    let isDict = tab.indexOf(dictKey) !== -1;

    return {[tab]: {rows, isDict}}
}

var Main = function () {

    let metadata = [fecthSpreadsheet(config.spreadsheetTest)];

    Promise.all(metadata).then(results => {
        //Build Id links
        results.forEach(spreadsheet => {

            //Get relations if exists
            let relations;
            let tabKeys = Object.keys(spreadsheet);
            console.log(tabKeys);
            if (tabKeys.includes(relationKey)) {
                relations = parseRelations(spreadsheet[relationKey]);

                //Remove it from keys
                let idx = tabKeys.indexOf(relationKey);
                tabKeys.splice(idx, 1);
            }

            //Parse tabs
            let parsedTabs = tabKeys.map(parseTab.bind(this, spreadsheet));

            //Unified tabs
            parsedTabs = Object.assign(...parsedTabs);

            //Once we have all well parsed, let's check relations
            if (typeof relations !== 'undefined') {
                applyRelations(relations, parsedTabs);
            }

            Object.keys(parsedTabs).forEach(tabName => {
                let {rows} = parsedTabs[tabName];

                if (parsedTabs[tabName].isDict) {
                    let dict = {};
                    rows.forEach(convertRowToDict.bind(this, dict));
                    parsedTabs[tabName] = dict;
                }
                else
                {
                    parsedTabs[tabName] = rows;
                }
            });

            console.log(parsedTabs);
        })

    })

};

new Main();
