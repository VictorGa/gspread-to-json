'use strict';

/**
 * Parse entry arguments to spreadsheet config
 * @returns {Array}
 */
Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.processEnv = processEnv;

function processEnv() {
	var _config = GLOBAL.config.spreadsheets;
	var nameIdx = -1;
	var spreadsheetConfigs = [];

	process.argv.forEach(function (val, index, array) {
		if (val === '-n') {
			nameIdx = index;
		}
	});

	//Just processed if found
	if (nameIdx !== -1) {
		//Get all names
		var spreadsheetNames = process.argv.splice(nameIdx + 1, process.argv.length);

		// Get spreadsheet config (id, name)
		spreadsheetNames.forEach(function (spreadsheetName) {
			var spreadsheetConfig = _config.find(function (_ref) {
				var name = _ref.name;
				return spreadsheetName === name;
			});

			if (typeof spreadsheetConfig === 'undefined') {
				//console.log(`No configuration found for ${spreadsheetName}`.bgRed.white);
			} else {
					spreadsheetConfigs.push(spreadsheetConfig);
				}
		});
	}

	return spreadsheetConfigs;
}
//# sourceMappingURL=ArgProcessor.js.map