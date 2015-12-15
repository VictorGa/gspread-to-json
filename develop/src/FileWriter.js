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
	if(typeof base === 'undefined')
	{
		base = './';
	}

	let output = JSON.stringify(data, null, 2);
	let url = base + folder + '/' + fileName + '.json';
	let dirname = path.dirname(url);

	console.log(`opening folder: ${dirname}`);

	return new Promise((resolve, reject) =>
	{
		mkdirp(dirname, (err) =>
		{
			if(err)
			{
				reject(err);
			}
			else
			{
				//console.log(`Creating file for: ${url}`.underline.bold.blue);
				console.log(`Creating file for: ${url}`);
				try
				{
					process.umask(0);
					fs.writeFileSync(url, output, {encoding: config.encoding, mode: parseInt('0755', 8)});
					resolve({path: url, name: fileName + '.json'});
				}
				catch(e)
				{
					console.log(e)
				}
			}
		});
	});
};

/**
 * Create json files
 * @param files
 */
export function writeAll(files, folder = '')
{
	let urls = [];
	let promiseFiles = [];
	Object.keys(files).forEach(fileName =>
	{
		promiseFiles.push(write(fileName, files[fileName], folder));
	});

	return Promise.all(promiseFiles);
};

