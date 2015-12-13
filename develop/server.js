'use strict';

GLOBAL.config = require('../gspreadfile.js');

import {execute} from './src/main';

let express = require('express');
let app = express();
let Archiver = require('archiver');
let fs = require('fs');

app.listen(process.env.PORT || 3412);


app.get('/parse/:id', function(req, res)
{
	console.log(req.params.id);
	let spreadsheets = [];
	req.params.id.split(',').forEach(id => {
		spreadsheets.push({id: id, name: null, cleanSpaces: false});
	});

	// Tell the browser that this is a zip file.
	res.writeHead(200, {
		'Content-Type': 'application/zip',
		'Content-disposition': 'attachment; filename=myFile.zip'
	});

	var zip = Archiver('zip', {});

	// Send the file to the page output.
	zip.pipe(res);

	execute(spreadsheets, (fileUrls)=>{
		fileUrls.forEach(file => {
			zip.append(fs.createReadStream(file.path), {name: file.name});
		});

		zip.finalize();
	});
});