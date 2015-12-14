'use strict';

import {default as SpreadsheetController, fecthSpreadsheet, loadSpreadsheets}  from './SpreadsheetController';
import {parseRelations,applyRelations} from './RelationParser';
import {parseTab, parseRow, convertRowToDict} from './TabUtils';
import {write, writeAll} from './FileWriter';
import Parsers from './Parsers';

const Promise = require('native-or-bluebird');
const relationKey = '__relation__';

export function filterTabNames(tabName)
{
	return tabName !== relationKey;
}

export function execute(spreadsheets, callback = ()=>{})
{

	GLOBAL.isNode = false;

	console.log(GLOBAL.isNode);

	//Fetch spreadsheets
	let spreadsheetsLoaded = Promise.all(loadSpreadsheets(spreadsheets));

	spreadsheetsLoaded.then(results =>
	{
		let fileUrls = {};
		//Build Id links
		results.forEach(data =>
		{

			//Get relations if exists
			let relations;
			let {title} = data;
			let spreadsheet = data.results;
			let tabKeys = Object.keys(spreadsheet);

			console.log('>> results', tabKeys)

			//Check if there is a relation tab
			if(tabKeys.indexOf(relationKey) !== -1)
			{
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
			if(typeof relations !== 'undefined')
			{
				applyRelations(relations, parsedTabs);
			}

			//Sort by files and locales
			let files = {};
			Object.keys(parsedTabs)
				  .filter(filterTabNames)
				  .forEach(tabName =>
				  {
					  let {rows, localizedRows} = parsedTabs[tabName];
					  let locales = Object.keys(localizedRows);

					  if(locales.length)
					  {
						  locales.forEach(locale =>
						  {
							  //Create locale
							  if(typeof files[locale] === 'undefined')
							  {
								  files[locale] = {};
							  }

							  rows = rows.map((row, index) =>
							  {
								  let localized = localizedRows[locale][index];
								  return Object.assign(row, localized);
							  });

							  parsedTabs[tabName].rows = rows;
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
							  rows.forEach(convertRowToDict.bind(this, dict));
							  tab = Parsers.cleanDict(tabName);
							  rows = dict;

						  }
						  else if(parsedTabs[tabName].isObjParse)
						  {
							  tab = Parsers.cleanObjParse(tabName);
						  }

						  files[data.title][tab] = rows;
					  }
				  });

			//Save all files
			fileUrls[title] = writeAll(files, title);
		});

		callback(fileUrls);
	});
}


