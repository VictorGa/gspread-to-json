'use strict';
import Parsers from './Parsers';
import {parse} from './Tokenizer';

const dictKey = '__dict';
const objParseKey = '__obj_parse';

/**
 * For each row parse content applying rules
 * @param row
 * @returns {{}}
 */
export function parseRow(row)
{
	let parsed = {};
	Object.keys(row).forEach(key =>
	{
		parsed[key] = parse(row[key]);
	});

	return parsed;
}

/**
 * Set the whole row as dictionary
 * [id] : data
 * @param parent
 * @param row
 */
export function convertRowToDict(parent, row)
{
	if(typeof row.id !== 'undefined')
	{
		let clone = Object.assign({}, row);
		delete clone.id;

		parent[row.id] = clone;
	}
}

/**
 * Parse spreadsheet tab.
 * Loop each tab's row and apply regexs
 * @param spreadsheet
 * @param tab
 * @returns {{}}
 */
export function parseTab(spreadsheet, tab)
{
	let isDict = tab.indexOf(dictKey) !== -1;
	let isObjParse = tab.indexOf(objParseKey) !== -1;
	let rows;
	let localizedRows = {};

	//In case is a object should be deepened
	//Just couples of id-copy
	if(isObjParse)
	{
		rows = {};
		spreadsheet[tab].rows.forEach(row => Parsers.deepen(row.id, row.value, rows));
	}
	else
	{
		Object.keys(spreadsheet[tab].locales).forEach(locale =>{
			if(typeof localizedRows[locale] === 'undefined')
			{
				localizedRows[locale] = [];
			}

			let values = spreadsheet[tab].locales[locale];
			Object.keys(values).forEach(propertyName =>
			{
				values[propertyName].forEach(value =>{
					localizedRows[locale].push(parseRow({[propertyName]: value}));
				})
			});
		});

		rows = spreadsheet[tab].rows.map(row => parseRow(row));
	}

	return {[tab]: {rows, isDict, isObjParse, localizedRows, isLocalized: typeof spreadsheet[tab].locales !== 'undefined'}};
}