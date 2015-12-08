require("babel-core/polyfill");



import {execute} from './src/main';
import {processEnv} from './src/ArgProcessor';

if (typeof module !== 'undefined' && module.exports)
{
	GLOBAL.isNode = true;
}

// Check input
let spreadsheets = processEnv();
if(!spreadsheets.length)
{
	spreadsheets = config.spreadsheets;
}

//Start
execute(spreadsheets);