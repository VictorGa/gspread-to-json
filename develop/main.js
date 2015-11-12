require("babel-core/polyfill");
var config = require('../config.json');
var fs = require('fs');
var colors = require('colors');
var Promise = require('native-or-bluebird');

import {default as SpreadsheetController, fecthSpreadsheet}  from './src/SpreadsheetController';
import {parseRelations,applyRelations} from './src/RelationParser';
import {parseTab, parseRow, convertRowToDict} from './src/TabUtils';
import Parsers from './src/Parsers';

let invalidMediaProps = ['id', 'title'];
const relationKey = '__relation__';

export function filterTabNames(tabName)
{
	return tabName !== relationKey;
}

var Main = function()
{

	let metadata = [fecthSpreadsheet(config.spreadsheetTranslations)];

	Promise.all(metadata).then(results =>
	{
		//Build Id links
		results.forEach(data =>
		{
			//Get relations if exists
			let relations;
			let spreadsheet = data.results;
			let tabKeys = Object.keys(spreadsheet);

			if(tabKeys.includes(relationKey))
			{
				relations = parseRelations(spreadsheet[relationKey].rows);

				//Remove it from keys
				let idx = tabKeys.indexOf(relationKey);
				tabKeys.splice(idx, 1);
			}

			//Parse tabs regular tabs
			let parsedTabs = tabKeys.map(parseTab.bind(this, spreadsheet));

			console.log(parsedTabs);
			//Merge tabs
			parsedTabs = Object.assign(...parsedTabs);

			//Once we have all well parsed, let's check relations
			if(typeof relations !== 'undefined')
			{
				applyRelations(relations, parsedTabs);
			}

			let files = {};
			Object.keys(parsedTabs)
				.filter(filterTabNames)
				.forEach(tabName =>
				{
					let {rows, localizedRows} = parsedTabs[tabName];
					let locales = Object.keys(localizedRows);

					if(locales.length)
					{
						locales.forEach(locale =>{
							//Create locale
							if(typeof files[locale] === 'undefined')
							{
								files[locale] = {};
							}

							rows = rows.map((row, index) =>{
								let localized = localizedRows[locale][index];
								return Object.assign(row, localized);
							});

							parsedTabs[tabName].rows = rows;
							console.log(rows);
							files[locale][tabName] = parsedTabs[tabName].rows;
						});
					}
					else
					{
						if(typeof files[data.title] === 'undefined')
						{
							files[data.title] = {};
						}

						let tab = tabName;
						if(parsedTabs[tabName].isDict)
						{
							let dict = {};
							rows = rows.forEach(convertRowToDict.bind(this, dict));
							tab = Parsers.cleanDict(tabName);
						}
						else if(parsedTabs[tabName].isObjParse)
						{
							tab = Parsers.cleanObjParse(tabName);
						}

						files[data.title][tab] = rows;
					}

				});

			console.log(files);
		})

	})

};

new Main();
