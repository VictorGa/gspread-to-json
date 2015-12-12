'use strict';

var _srcMain = require('./src/main');

var express = require('express');
var app = express();

app.listen(process.env.PORT || 3412);

function download(url, res, urls) {
	if (urls.length) {
		res.download(url, 'test', function () {
			download(urls.pop, res, urls);
		});
	}
}

app.get('/parse/:id', function (req, res) {
	var spreadsheet = [{ id: req.params.id, name: 'test', cleanSpaces: false }];
	(0, _srcMain.execute)(spreadsheet, function (fileUrls) {
		//fileUrls.forEach(url => res.download(url, 'test')); // Set disposition and send it.)
		download(fileUrls.pop(), res, fileUrls);
	});
});
//# sourceMappingURL=server.js.map