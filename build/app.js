'use strict';

var _srcMain = require('./src/main');

var _srcArgProcessor = require('./src/ArgProcessor');

require("babel-core/polyfill");

if (typeof module !== 'undefined' && module.exports) {
	GLOBAL.isNode = true;
}

// Check input
var spreadsheets = (0, _srcArgProcessor.processEnv)();
if (!spreadsheets.length) {
	spreadsheets = config.spreadsheets;
}

//Start
(0, _srcMain.execute)(spreadsheets);
//# sourceMappingURL=app.js.map