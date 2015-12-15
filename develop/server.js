'use strict';

GLOBAL.config = require('../gspreadfile.js');

import {execute} from './src/main';

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let Archiver = require('archiver');
let fs = require('fs');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.listen(process.env.PORT || 3412);


app.get('/parse/:id', function(req, res)
{
	let data = JSON.parse(req.params.id);

	// Tell the browser that this is a zip file.
	res.writeHead(200, {
		'Content-Type': 'application/zip',
		'Content-disposition': 'attachment; filename=gspread.zip'
	});

	var zip = Archiver('zip', {});

	// Send the file to the page output.
	zip.pipe(res);

	execute(data, (results)=>{
		let fileUrls = Object.assign({}, ...results);

		Object.keys(fileUrls).forEach(folder => {
			fileUrls[folder].forEach(file => {
				zip.append(fs.createReadStream(file.path), {name: folder + '/' + file.name});
			});
		});

		zip.finalize();
	});
});

//app.post('/parse',function(req,res){
//
//	let {data} = req.body;
//
//	res.setHeader('Access-Control-Allow-Origin','*');
//	// Tell the browser that this is a zip file.
//	res.writeHead(200, {
//		'Content-Type': 'application/zip',
//		'Content-disposition': 'attachment; filename=gspread.zip'
//	});
//
//	var zip = Archiver('zip', {});
//
//	// Send the file to the page output.
//	zip.pipe(res);
//
//	execute(data, (fileUrls)=>{
//		Object.keys(fileUrls).forEach(folder => {
//			fileUrls[folder].forEach(file =>{
//				zip.append(fs.createReadStream(file.path), {name: folder + '/' + file.name});
//			});
//		});
//
//		zip.finalize();
//	});
//});