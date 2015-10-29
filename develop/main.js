require("babel-core/polyfill");
var SpreadsheetController = require('./src/SpreadsheetController');
var FileWriter = require('./src/FileWriter');
var config = require('../config.json');
var fs = require('fs');
var colors = require('colors');
var Promise = require('native-or-bluebird');

import Tokenizer from './src/Tokenizer';

let tokenizer = new Tokenizer();
let invalidMediaProps = ['id', 'title'];

let fecthSpreadsheet = (spId, cleanSpaces = true) => {

    console.log(`Fetching data from ${spId}`.bgBlue.white);
    return new Promise((resolve, reject) => {
        let spreadsheet = new SpreadsheetController(spId, ()=> {
            spreadsheet.getAll(cleanSpaces).then(data => resolve(data), error => reject(error));
        });
    });
};

let parseCell = (cell) => {
   let parsed = Object.keys(cell).map(key => {
        return tokenizer.parse(cell[key]);
    });

    console.log(parsed);
}


var Main = function () {

    let metadata = [fecthSpreadsheet(config.spreadsheetTest)];

    Promise.all(metadata).then(results => {
        //Build Id links

        results.forEach(spreadsheet => {
            Object.keys(spreadsheet).forEach(tab => {
                spreadsheet[tab].forEach(element => parseCell(element))
            })
        })

    })

};

new Main();
