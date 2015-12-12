'use strict';

import {execute} from './src/main';

let express = require('express');
let app = express();

app.listen(process.env.PORT || 3412);

function download(url, res, urls)
{
	if(urls.length)
	{
		res.download(url, 'test', () => {
			download(urls.pop, res, urls);
		});
	}
}

app.get('/parse/:id', function(req, res) {
	let spreadsheet = [{id: req.params.id, name: 'test', cleanSpaces: false}];
	execute(spreadsheet, (fileUrls)=>{
		//fileUrls.forEach(url => res.download(url, 'test')); // Set disposition and send it.)
		download(fileUrls.pop(), res, fileUrls);
	});
});