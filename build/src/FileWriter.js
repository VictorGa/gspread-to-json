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

function write(fileName, data, folder) {
	var base = arguments.length <= 3 || arguments[3] === undefined ? GLOBAL.config.savePath : arguments[3];

	if (typeof base === 'undefined') base = './';

	var output = JSON.stringify(data, null, 2);
	var url = base + folder + '/' + fileName + '.json';
	var dirname = path.dirname(url);

	mkdirp(dirname, function (err) {
		if (err) {
			console.log(err);
		} else {
			//console.log(`Creating file for: ${url}`.underline.bold.blue);
			console.log('Creating file for: ' + url);
			fs.writeFileSync(url, output, { encoding: config.encoding });
		}
	});

	return { path: url, name: fileName + '.json' };
}

;

/**
 * Create json files
 * @param files
 */

function writeAll(files) {
	var folder = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	var urls = [];
	Object.keys(files).forEach(function (fileName) {
		urls.push(write(fileName, files[fileName], folder));
	});

	return urls;
}

;
//# sourceMappingURL=FileWriter.js.map