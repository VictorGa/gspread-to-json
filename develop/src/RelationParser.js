import Parsers from './Parsers';

const tabInclude = 'tabInclude';
const tabFrom = 'tabFrom';

export const type = {
	RIGHT: '->',
	LEFT: '<-',
	BOTH: '<->'
};

/**
 * Parse relation tab to a object
 * @param relations
 * @returns {Array}
 */
export function parseRelations(relations)
{
	let relationsParsed = relations.map(relation =>
	{
		let relParsed = Object.assign({}, relation);
		let relationType = type.RIGHT;
		if(relation.relation.indexOf(type.LEFT) !== -1)
		{
			relationType = type.LEFT;
		}
		else if(relation.relation.indexOf(type.BOTH) !== -1)
		{
			relationType = type.BOTH;
		}

		let rel = relation.relation.split(relationType).map(r => Parsers.camelize(Parsers.cleanSpaces(r)));
		relParsed.relation = rel;
		relParsed.type = relationType;

		return relParsed;
	});

	return relationsParsed;
}

/**
 * Based on relation object, create relations
 * populating the right tab with the objects related to
 * @param relations
 * @param tabs
 */
export function applyRelations(relations, tabs)
{
	relations.forEach(relation =>
	{

		let tabA = tabs[relation.tabA];
		let tabB = tabs[relation.tabB];
		let [keyA, keyB] = relation.relation;

		if(typeof tabA === 'undefined' || typeof tabB === 'undefined')
		{
			console.error('Relation ' + relation.tabA + '->' + relation.tabB + ' does not exist');
		}

		//TabA includes element from TabB
		tabA.rows = tabA.rows.map(row =>
		{
			let keys = row[keyA];
			let keyObjects;

			if(typeof keys === 'Array')
			{
				keyObjects = keys.map(key => tabB.rows.find(row => row[keyB] === key)).filter(row => typeof row !== 'undefined');
			}
			else
			{
				keyObjects = tabB.rows.find(row => row[keyB] === keys);
			}

			row[keyA] = keyObjects;

			return row;
		});

		tabs[relation.tabA] = tabA;
	});
}