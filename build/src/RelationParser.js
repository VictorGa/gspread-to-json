'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.parseRelations = parseRelations;
exports.applyRelations = applyRelations;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Parsers = require('./Parsers');

var _Parsers2 = _interopRequireDefault(_Parsers);

var tabInclude = 'tabInclude';
var tabFrom = 'tabFrom';

/**
 * Parse relation tab to a object
 * @param relations
 * @returns {Array}
 */

function parseRelations(relations) {

	var relationsParsed = relations.map(function (relation) {
		var relParsed = Object.assign({}, relation);
		var rel = relation.relation.split('->').map(function (r) {
			return _Parsers2['default'].camelize(_Parsers2['default'].cleanSpaces(r));
		});
		relParsed.relation = rel;
		return relParsed;
	});
	console.log('>>>', relationsParsed);

	return relationsParsed;
}

/**
 * Based on relation object, create relations
 * populating the right tab with the objects related to
 * @param relations
 * @param tabs
 */

function applyRelations(relations, tabs) {
	relations.forEach(function (relation) {

		var tabA = tabs[relation.tabA];
		var tabB = tabs[relation.tabB];

		var _relation$relation = _slicedToArray(relation.relation, 2);

		var keyA = _relation$relation[0];
		var keyB = _relation$relation[1];

		if (typeof tabA === 'undefinded' || typeof tabB === 'undefinded') {
			console.error('Relation ' + relation.tabA + '->' + relation.tabB + ' does not exist');
		}
		//TabA includes element from TabB
		tabA.rows = tabA.rows.map(function (row) {
			var keys = row[keyA];
			var keyObjects = undefined;

			if (typeof keys === 'Array') {
				keyObjects = keys.map(function (key) {
					return tabB.rows.find(function (row) {
						return row[keyB] === key;
					});
				}).filter(function (row) {
					return typeof row !== 'undefined';
				});
			} else {
				keyObjects = tabB.rows.find(function (row) {
					return row[keyB] === keys;
				});
			}

			row[keyA] = keyObjects;

			return row;
		});

		tabs[relation.tabA] = tabA;
	});
}
//# sourceMappingURL=RelationParser.js.map