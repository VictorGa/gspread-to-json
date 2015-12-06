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

	var output = JSON.stringify(data, null, 2);
	var dirname = path.dirname(base + fileName + '.json');

	console.log(data, output);
	mkdirp(dirname, (err) => {
		if(err){
			console.log(err);
		}
		else
		{
			console.log(`Creating file for: ${base + fileName + '.json'}`.underline.bold.blue);
			fs.writeFileSync(base + fileName + '.json', output, {encoding: config.encoding});
		}
	})
};

/**
 * Create json files
 * @param files
 */
export function writeAll(files)
{
	Object.keys(files).forEach(fileName =>
	{
		write(fileName, files[fileName]);
	});
};

