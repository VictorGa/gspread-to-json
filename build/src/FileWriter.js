'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.write = write;
exports.writeAll = writeAll;
var sanitize = require("sanitize-filename");
var fs = require('fs');
var config = require('../../config.json');
var path = require('path');
var mkdirp = require('mkdirp');
var colors = require('colors');

/**
 * Write a json file to destination
 * @param fileName
 * @param data
 * @param base
 */

function write(fileName, data) {
	var base = arguments.length <= 2 || arguments[2] === undefined ? config.savePath : arguments[2];

	if (typeof base === 'undefined') base = './';

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

;

/**
 * Create json files
 * @param files
 */

function writeAll(files) {
	Object.keys(files).forEach(function (fileName) {
		write(fileName, files[fileName]);
	});
}

;
//# sourceMappingURL=FileWriter.js.map