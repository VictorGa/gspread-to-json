'use strict';

var _srcMain = require('./src/main');

var express = require('express');
var app = express();
var Archiver = require('archiver');
var fs = require('fs');

app.listen(process.env.PORT || 3412);

app.get('/parse/:id', function (req, res) {
	console.log(req.params.id);
	var spreadsheet = [{ id: req.params.id, name: 'test', cleanSpaces: false }];

	// Tell the browser that this is a zip file.
	res.writeHead(200, {
		'Content-Type': 'application/zip',
		'Content-disposition': 'attachment; filename=myFile.zip'
	});

	var zip = Archiver('zip', {});

	// Send the file to the page output.
	zip.pipe(res);

	(0, _srcMain.execute)(spreadsheet, function (fileUrls) {
		console.log(fileUrls);
		fileUrls.forEach(function (file) {
			zip.append(fs.createReadStream(file.path), { name: file.name + '.json' });
		});

		zip.finalize();
	});
});
//# sourceMappingURL=server.js.map