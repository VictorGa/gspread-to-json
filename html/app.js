'use strict';

const Vue = require('vue');
const $ = require('jquery');
const HOST = "http://localhost:3412/";

new Vue({
	// the root element that will be compiled
	el: '.app',

	data: {
		ids: [],
		newSpreadsheetId: '',
		newSpreadsheetName: '',
		editedTodo: null,
		visibility: 'all'
	},

	// computed properties
	// http://vuejs.org/guide/computed.html
	computed: {
		spreadsheetIds: function () {
			return this.ids;
		}
	},

	methods: {
		addSpreadsheetId: function()
		{
			var valueId = this.newSpreadsheetId && this.newSpreadsheetId.trim();
			var valueName = this.newSpreadsheetName && this.newSpreadsheetName.trim();
			if (!valueId) {
				return;
			}
			this.ids.push({ id: valueId , name: valueName, cleanSpaces: true});
			this.newSpreadsheetId = '';
			this.newSpreadsheetName = '';
		},

		fetchSpreadsheets: function()
		{
			location.href = HOST + 'parse/' + JSON.stringify(this.ids);
		},

		remove: function(sp)
		{
			this.ids.$remove(sp);
		}
	}
});