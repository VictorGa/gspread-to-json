import Parsers from './Parsers';
var config = require('../../gspreadfile');
var GoogleSpreadsheet = require("google-spreadsheet");
var Promise = require('native-or-bluebird');

/**
 * Controller fetching spreadsheet data
 * Parsing data keeping non needed key words out
 */
class SpreadsheetController {
	constructor (id, name, onReady) {
		this._incompatibleTags = ['_links', 'save', 'del', 'content', '_xml', 'app:edited', 'reference'];

		this.sheet = new GoogleSpreadsheet(id);
		this.sheet.useServiceAccountAuth(config.googleauth, this.init.bind(this, onReady));
		this.name = name;
	}

	init (onReady) {
		this.sheet.getInfo((err, sheet_info) => {
			this.data = sheet_info;
			onReady();
		});
	}

	getAll (clean = true) {

		return new Promise((resolve, reject)=> {
			let iterables = this.data.worksheets.map((element, index) => {
				return this.getRow(element, clean);
			});
			
			Promise.all(iterables).then(
				results => {
					//results is an array of objects, each object being a worksheet
					//now we merge all in one object
					let title = typeof this.name === 'undefined' || this.name == null ? this.data.title : this.name;
					resolve({title: title, results: Object.assign(...results)});
				},
				error => {
					reject(error);
				});
		});
	}

	getRow (element, clean) {
		return new Promise((resolve, reject) => {
			element.getRows((err, rows)=> {
				if (err) {
					reject(err);
				}
				else {
					resolve({[element.title]: this.filter(rows, clean)});
				}
			});
		})
	}

	filter (rows, clean) {
		let filtered = [];
		let filteredRow = {};
		let locales = {};

		for (var i = 0; i < rows.length; i++) {
			filteredRow = {};

			for (var key in rows[i]) {
				if (rows[i].hasOwnProperty(key) && this._incompatibleTags.indexOf(key) === -1) {
					let filteredKey;
					let locale;
					let value = clean ? Parsers.cleanSpaces(rows[i][key]) : rows[i][key];

					//Check if property is localized
					if (key.indexOf('-locale-') === -1) {
						filteredKey = Parsers.camelize(Parsers.cleanSpaces(key));
						filteredRow[filteredKey] = value;
					}
					else {
						filteredKey = Parsers.camelize(Parsers.cleanLocale(Parsers.cleanSpaces(key)));
						locale = this.extractLocale(key);
						if (!locales.hasOwnProperty(locale)) {
							locales[locale] = {[filteredKey]: []};
						}

						locales[locale][filteredKey].push(value);
					}
				}
			}
			filtered.push(filteredRow);
		}

		return {rows: filtered, locales};
	}

	extractLocale (propertyName) {
		//Check if locale is present property name
		return propertyName.split('-').pop();
	}

	getCellsByWorksheetId (worksheetId, onReady) {
		for (var i = 0; i < this.data.worksheets.length; i++) {
			if (this.data.worksheets[i].title === worksheetId) {
				this.data.worksheets[i].getCells(this.data.worksheets[i].id, function (off, data) {
					onReady(data);
				});
				return;
			}
		}
	}
}

/**
 * Fetch spreadsheet
 * @param spId
 * @param cleanSpaces
 * @returns {exports|module.exports}
 */
export function fecthSpreadsheet (spId, name, cleanSpaces = true) {

	//console.log(`Fetching data from ${spId}`.bgBlue.white);
	return new Promise((resolve, reject) => {
		let spreadsheet = new SpreadsheetController(spId, name, ()=> {
			spreadsheet.getAll(cleanSpaces).then(data => resolve(data), error => reject(error));
		});
	});
};

/**
 * Create a list of promises for spreadsheets
 * @param list
 * @returns {Array}
 */
export function loadSpreadsheets (list) {

	let metadata = [];

	list.forEach(spreadsheet => {
		metadata.push(fecthSpreadsheet(spreadsheet.id, spreadsheet.name, JSON.parse(spreadsheet.cleanSpaces)));
	});

	return metadata;
};

export default SpreadsheetController;

