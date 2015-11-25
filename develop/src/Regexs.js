import RegexNames from './RegexNames';
import Parsers from './Parsers';

/**
 * Regular expressions and parser for each
 * @type {{}}
 */
let regexs = {
    [RegexNames.ARRAY]: {regex:/^[\[][\w,;_ ]*[\]]$/gi, parser:Parsers.toArray},
    [RegexNames.DOT_SEPARATED]: {regex: /^\w+(\.\w+)+$/gm, parser:Parsers.deepen},
    [RegexNames.OBJECT]: {regex: /{([^}]+)}/, parser:JSON.parse}
}

export default regexs;

