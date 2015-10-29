import Regexs from './Regexs';
import RegexNames from './RegexNames';
import Parsers from './Parsers';

class Tokenizer {

    constructor() {

    }

    parse(element) {
       return Object.keys(Regexs).
                            map(this.discoverRegex.bind(this, element, Regexs)).
                            filter(regexElement => typeof regexElement !== 'undefined').
                            map(this.parseElementByRegex.bind(this));


    }

    discoverRegex(element, regexs, regexName) {
        if(element.match(regexs[regexName]))
        {
            return {regexName, element};
        }

    }

    parseElementByRegex(regexElementCouple)
    {
        let result;
        switch (regexElementCouple.regexName)
        {
            case RegexNames.ARRAY:
                result = Parsers.toArray(regexElementCouple.element);
                break;
        }

        return result;
    }
}


export default Tokenizer;