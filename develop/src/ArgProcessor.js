'use strict';

/**
 * Parse entry arguments to spreadsheet config
 * @returns {Array}
 */
export function processEnv()
{
	let _config = GLOBAL.config.spreadsheets;
	let nameIdx = -1;
	let spreadsheetConfigs = [];

	process.argv.forEach((val, index, array) =>
	{
		if(val === '-n')
		{
			nameIdx = index;
		}
	});

	//Just processed if found
	if(nameIdx !== -1)
	{
		//Get all names
		let spreadsheetNames = process.argv.splice(nameIdx + 1, process.argv.length);

		// Get spreadsheet config (id, name)
		spreadsheetNames.forEach(spreadsheetName =>
		{
			let spreadsheetConfig = _config.find(({name}) => spreadsheetName === name);

			if(typeof spreadsheetConfig === 'undefined')
			{
				console.log(`No configuration found for ${spreadsheetName}`.bgRed.white);
			}
			else
			{
				spreadsheetConfigs.push(spreadsheetConfig);
			}
		});
	}

	return spreadsheetConfigs;
}