'use strict';
import Parsers from './Parsers';
import {parse} from './Tokenizer';

const dictKey = '__dict';
const objParseKey = '__obj_parse';

export function parseRow(row)
{

	let parsed = {};
	Object.keys(row).forEach(key =>
	{
		parsed[key] = parse(row[key]);
	});

	return parsed;
}

export function convertRowToDict(parent, row)
{
	if(typeof row.id !== 'undefined')
	{
		let clone = Object.assign({}, row);
		delete clone.id;

		parent[row.id] = clone;
	}
}

export function getLocales(rows)
{
	rows.map(row => {
		let {id} = row;
		let locale = id.split('-')
	})
}

export function convertRowToObject(parent, row, value)
{
	console.log('>> obj', row)
}

export function parseTab(spreadsheet, tab)
{
	let isDict = tab.indexOf(dictKey) !== -1;
	let isObjParse = tab.indexOf(objParseKey) !== -1;
	let rows;

	//In case is a object should be deepened
	//Just couples of id-copy
	if(isObjParse)
	{
		rows = {};
		spreadsheet[tab].forEach(row => Parsers.deepen(row.id, row.value, rows));
	}
	else
	{
		rows = spreadsheet[tab].map(row => parseRow(row));
	}

	return {[tab]: {rows, isDict, isObjParse}};
}