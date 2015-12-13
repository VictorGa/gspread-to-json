'use strict';

var _srcMain = require('./src/main');

GLOBAL.config = require('../gspreadfile.js');

var express = require('express');
var app = express();
var Archiver = require('archiver');
var fs = require('fs');

app.listen(process.env.PORT || 3412);

app.get('/parse/:id', function (req, res) {
	console.log(req.params.id);
	var spreadsheets = [];
	req.params.id.split(',').forEach(function (id) {
		spreadsheets.push({ id: id, name: null, cleanSpaces: false });
	});

	// Tell the browser that this is a zip file.
	res.writeHead(200, {
		'Content-Type': 'application/zip',
		'Content-disposition': 'attachment; filename=myFile.zip'
	});

	var zip = Archiver('zip', {});

	// Send the file to the page output.
	zip.pipe(res);

	(0, _srcMain.execute)(spreadsheets, function (fileUrls) {
		fileUrls.forEach(function (file) {
			zip.append(fs.createReadStream(file.path), { name: file.name + '.json' });
		});

		zip.finalize();
	});
});
//# sourceMappingURL=server.js.map