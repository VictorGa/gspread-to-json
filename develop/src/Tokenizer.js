import Regexs from './Regexs';
import RegexNames from './RegexNames';
import Parsers from './Parsers';

class Tokenizer {

	/**
	 * Check if regex match
	 * @param element
	 * @param regexs
	 * @param regexName
	 * @returns {*}
	 */
	static discoverRegex(element, regexs, regexName)
	{
		if(element.match(regexs[regexName].regex))
		{
			return {regexName, element};
		}

		return {element};
	}

	/**
	 * Apply correct regex
	 * @param regexElementCouple
	 * @returns {*}
	 */
	static parseElementByRegex(regexElementCouple)
	{
		let result = regexElementCouple.element;

		if(Regexs[regexElementCouple.regexName])
		{
			result = Regexs[regexElementCouple.regexName].parser(regexElementCouple.element);
		}

		return result;
	}

}

/**
 * Check which rule to apply for the current element
 * @param element
 * @returns {*}
 */
export function parse(element)
{
	let parsed = Object.keys(Regexs).
				map(Tokenizer.discoverRegex.bind(this, element, Regexs)).
				filter(({regexName}) => typeof regexName !== 'undefined').
				map(Tokenizer.parseElementByRegex.bind(this));

	if(parsed.length === 0)
	{
		console.log(`No regex found for ${element}`);
	}

	return parsed[0];
}

export default Tokenizer;