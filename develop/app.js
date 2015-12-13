require("babel-core/polyfill");

GLOBAL.config = require('../gspreadfile.js');
GLOBAL.colors = require('colors');

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