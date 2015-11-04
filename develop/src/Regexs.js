import RegexNames from './RegexNames';
import Parsers from './Parsers';

let regexs = {
    [RegexNames.ARRAY]: {regex:/^[\[][\w,;_ ]*[\]]$/gi, parser:Parsers.toArray},
    [RegexNames.DOT_SEPARATED]: {regex: /^\w+(\.\w+)+$/gm, parser:Parsers.deepen}
}

export default regexs;

