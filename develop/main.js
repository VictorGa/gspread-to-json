require("babel-core/polyfill");
var config = require('../config.json');
var fs = require('fs');
var colors = require('colors');
var Promise = require('native-or-bluebird');

import {default as SpreadsheetController, fecthSpreadsheet, loadSpreadsheets}  from './src/SpreadsheetController';
import {parseRelations,applyRelations} from './src/RelationParser';
import {parseTab, parseRow, convertRowToDict} from './src/TabUtils';
import {write, writeAll} from './src/FileWriter';
import Parsers from './src/Parsers';

const relationKey = '__relation__';

export function filterTabNames(tabName) {
    return tabName !== relationKey;
}

export function processEnv() {
    // print process.argv
    let _config = config.spreadsheets;
    let nameIdx = -1;

    process.argv.forEach((val, index, array) => {
        if (val === '-n') {
            nameIdx = index;
        }
    });


    //Get all names
    let spreadsheetNames = process.argv.splice(nameIdx, process.argv.length);
    let spreadsheetConfigs = [];

    // Get spreadsheet config (id, name)
    spreadsheetNames.forEach(spreadsheetName =>
    {
        let spreadsheetConfig = _config.find(({name}) => spreadsheetName === name);
        console.log(spreadsheetConfig)

        if (typeof spreadsheetConfig === 'undefined')
        {
            console.log(`No configuration found for ${spreadsheetName}`.bgRed.white);
        }
        else {
            spreadsheetConfigs.push(spreadsheetConfig);
        }
    });
    return spreadsheetConfigs;
}


// Check input
let spreadsheets = processEnv();
if (!spreadsheets.length) {
    spreadsheets = config.spreadsheets;
}

//Fetch spreadsheets
let spreadsheetsLoaded = Promise.all(loadSpreadsheets(spreadsheets));

spreadsheetsLoaded.then(results => {
    //Build Id links
    results.forEach(data => {
        //Get relations if exists
        let relations;
        let spreadsheet = data.results;
        let tabKeys = Object.keys(spreadsheet);

        //Check if there is a relation tab
        if (tabKeys.includes(relationKey)) {
            relations = parseRelations(spreadsheet[relationKey].rows);

            //Remove it from keys
            let idx = tabKeys.indexOf(relationKey);
            tabKeys.splice(idx, 1);
        }

        //Parse tabs regular tabs
        let parsedTabs = tabKeys.map(parseTab.bind(this, spreadsheet));

        //Merge tabs
        parsedTabs = Object.assign(...parsedTabs);

        //Once we have all well parsed, let's check relations
        if (typeof relations !== 'undefined') {
            applyRelations(relations, parsedTabs);
        }

        //Sort by files and locales
        let files = {};
        Object.keys(parsedTabs)
            .filter(filterTabNames)
            .forEach(tabName => {
                let {rows, localizedRows} = parsedTabs[tabName];
                let locales = Object.keys(localizedRows);

                if (locales.length) {
                    locales.forEach(locale => {
                        //Create locale
                        if (typeof files[locale] === 'undefined') {
                            files[locale] = {};
                        }

                        rows = rows.map((row, index) => {
                            let localized = localizedRows[locale][index];
                            return Object.assign(row, localized);
                        });

                        parsedTabs[tabName].rows = rows;
                        files[locale][tabName] = parsedTabs[tabName].rows;
                    });
                }
                else {
                    if (typeof files[data.title] === 'undefined') {
                        files[data.title] = {};
                    }

                    let tab = tabName;
                    if (parsedTabs[tabName].isDict) {
                        let dict = {};
                        rows.forEach(convertRowToDict.bind(this, dict));
                        tab = Parsers.cleanDict(tabName);
                        rows = dict;

                    }
                    else if (parsedTabs[tabName].isObjParse) {
                        tab = Parsers.cleanObjParse(tabName);
                    }

                    files[data.title][tab] = rows;
                }
            });

        //Save all files
        writeAll(files);
    });
});
