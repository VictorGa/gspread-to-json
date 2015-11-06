require("babel-core/polyfill");
var config = require('../config.json');
var fs = require('fs');
var colors = require('colors');
var Promise = require('native-or-bluebird');

import {default as SpreadsheetController, fecthSpreadsheet}  from './src/SpreadsheetController';
import {parseRelations,applyRelations} from './src/RelationParser';
import {parseTab, parseRow, convertRowToDict} from './src/TabUtils';

let invalidMediaProps = ['id', 'title'];
const relationKey = '__relation__';

export function filterTabNames(tabName)
{
    return tabName !== relationKey;
}

var Main = function () {

    let metadata = [fecthSpreadsheet(config.spreadsheetTranslations) ];

    Promise.all(metadata).then(results => {
        //Build Id links
        results.forEach(spreadsheet => {

            //Get relations if exists
            let relations;
            let tabKeys = Object.keys(spreadsheet);

            if (tabKeys.includes(relationKey)) {
                relations = parseRelations(spreadsheet[relationKey]);

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

            Object.keys(parsedTabs).filter(filterTabNames).forEach(tabName => {
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

            //console.log(parsedTabs);
        })

    })

};

new Main();
