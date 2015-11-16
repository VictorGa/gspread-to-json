import Parsers from './Parsers';

const tabInclude = 'tabInclude';
const tabFrom = 'tabFrom';

export function parseRelations(relations)
{

    let relationsParsed = relations.map(relation =>{
        let relParsed = Object.assign({},relation);
        let rel = relation.relation.split('->').map(r => Parsers.camelize(Parsers.cleanSpaces(r)));
        relParsed.relation = rel;
        return relParsed;
    })
    console.log('>>>', relationsParsed);

    return relationsParsed;
}

export function applyRelation(relation, tabs)
{

}

export function applyRelations(relations, tabs)
{
    relations.forEach(relation => {

        let tabA = tabs[relation.tabA];
        let tabB = tabs[relation.tabB];
        let [keyA, keyB] = relation.relation;

        if(typeof tabA === 'undefinded' || typeof tabB === 'undefinded')
        {
            console.error('Relation ' + relation.tabA + '->' + relation.tabB  +' does not exist');
        }
        //TabA includes element from TabB
        tabA.rows = tabA.rows.map(row => {
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