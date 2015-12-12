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
export function write(fileName, data, base = GLOBAL.config.savePath)
{
	if (typeof base === 'undefined') base = './';

	let output = JSON.stringify(data, null, 2);
	let dirname = path.dirname(base + fileName + '.json');
	let url = base + fileName + '.json';

	mkdirp(dirname, (err) => {
		if(err)
		{
			console.log(err);
		}
		else
		{
			//console.log(`Creating file for: ${url}`.underline.bold.blue);
			console.log(`Creating file for: ${url}`);
			fs.writeFileSync(url, output, {encoding: config.encoding});
		}
	});

	return {path: url, name: fileName + '.json'};
};

/**
 * Create json files
 * @param files
 */
export function writeAll(files)
{
	let urls = [];
	Object.keys(files).forEach(fileName =>
	{
		urls.push(write(fileName, files[fileName]));
	});

	return urls;
};

