'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.write = write;
var bodyParser = require('body-parser');
var sanitize = require("sanitize-filename");
var fs = require('fs');
var config = require('../../config.json');
var path = require('path');
var mkdirp = require('mkdirp');
var colors = require('colors');

function write(fileName, data, base) {
	if (base === void 0) {
		base = config.savePath;
	}

	var output = JSON.stringify(data, null, 2);
	var dirname = path.dirname(base + fileName + '.json');
	mkdirp(dirname, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log(('Creating file for: ' + (base + fileName + '.json')).underline.bold.blue);
			fs.writeFileSync(base + fileName + '.json', output, { encoding: config.encoding });
		}
	});
}
//# sourceMappingURL=FileWriter.js.map