'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.write = write;
exports.writeAll = writeAll;
var sanitize = require("sanitize-filename");
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

/**
 * Write a json file to destination
 * @param fileName
 * @param data
 * @param base
 */

function write(fileName, data) {
	var base = arguments.length <= 2 || arguments[2] === undefined ? GLOBAL.config.savePath : arguments[2];

	if (typeof base === 'undefined') base = './';

	var output = JSON.stringify(data, null, 2);
	var dirname = path.dirname(base + fileName + '.json');
	var url = { path: base + fileName + '.json', name: fileName };

	mkdirp(dirname, function (err) {
		if (err) {
			console.log(err);
		} else {
			//console.log(`Creating file for: ${url}`.underline.bold.blue);
			fs.writeFileSync(url, output, { encoding: config.encoding });
		}
	});

	return url;
}

;

/**
 * Create json files
 * @param files
 */

function writeAll(files) {
	var urls = [];
	Object.keys(files).forEach(function (fileName) {
		urls.push(write(fileName, files[fileName]));
	});

	return urls;
}

;
//# sourceMappingURL=FileWriter.js.map