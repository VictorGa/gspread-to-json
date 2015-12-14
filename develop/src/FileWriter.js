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
export function write(fileName, data, folder, base = GLOBAL.config.savePath)
{
	if (typeof base === 'undefined') base = './';

	let output = JSON.stringify(data, null, 2);
	let url = base + folder + '/' + fileName + '.json';
	let dirname = path.dirname(url);

	console.log(`opening folder: ${dirname}`);

	mkdirp(dirname, (err) => {
		if(err)
		{
			console.log(err);
		}
		else
		{
			//console.log(`Creating file for: ${url}`.underline.bold.blue);
			console.log(`Creating file for: ${url}`);
			try {
				fs.writeFileSync(url, output, {encoding: config.encoding});
			}
			catch (e) {
				console.log(e)
			}
		}
	});

	return {path: url, name: fileName + '.json'};
};

/**
 * Create json files
 * @param files
 */
export function writeAll(files, folder = '')
{
	let urls = [];
	Object.keys(files).forEach(fileName =>
	{
		urls.push(write(fileName, files[fileName], folder));
	});

	return urls;
};

