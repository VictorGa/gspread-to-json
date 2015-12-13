'use strict';

const Vue = require('vue');
const $ = require('Jquery');

new Vue({
	// the root element that will be compiled
	el: '.app',

	data: {
		ids: [],
		newSpreadsheetId: '',
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
			var value = this.newSpreadsheetId && this.newSpreadsheetId.trim();
			if (!value) {
				return;
			}
			this.ids.push({ id: value });
			this.newSpreadsheetId = '';
		},

		fetchSpreadsheets: function()
		{
			location.href = 'http://localhost:3412/parse/' + this.ids.map((value) => value.id).join(',');
		},

		remove: function(sp)
		{
			this.ids.$remove(sp);
		}
	}
});