'use strict';

import {execute} from './src/main';

let express = require('express');
let app = express();

app.listen(process.env.PORT || 3412);

/**
 * Download file
 * @param url
 * @param res
 * @param urls
 */
function download(url, res, urls)
{
	if(urls.length)
	{
		console.log(url);
		res.download(url.path, url.name, () => {
			download(urls.pop(), res, urls)
		});
	}
}

app.get('/parse/:id', function(req, res) {
	let spreadsheet = [{id: req.params.id, name: 'test', cleanSpaces: false}];
	execute(spreadsheet, (fileUrls)=>{
		console.log(fileUrls);
		download(fileUrls.pop(), res, fileUrls);
	});
});