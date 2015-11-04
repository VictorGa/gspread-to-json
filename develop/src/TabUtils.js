'use strict';

export function parseRow(row)
{

	let parsed = {};
	Object.keys(row).forEach(key =>
	{
		parsed[key] = tokenizer.parse(row[key]);
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

export function parseTab(spreadsheet, tab)
{
	let isDict = tab.indexOf(dictKey) !== -1;
	let isObjParse = tab.indexOf(objParseKey) !== -1;
	let rows;
	if(isObjParse)
	{
		//Parse with deepen
		rows = [];
		console.log(spreadsheet[tab]);
	}
	else
	{
		rows = spreadsheet[tab].map(row => parseRow(row));
	}


	return {[tab]: {rows, isDict, isObjParse}};
}