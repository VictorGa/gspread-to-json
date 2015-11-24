'use strict';

/**
 * Collection of different parsers used in
 * spreadsheet.
 */
class Parsers
{
	constructor()
	{

	}

	/**
	 * Convert string to a array
	 * @param str
	 * @returns {Array|*}
	 */
	static toArray(str)
	{
		str = str.substring(1, str.length - 1).split(',');

		return str;
	}

	/**
	 * Parse 'x.y.z = 10' to a object as
	 * {x: {y: {z: 10}}}
	 * @param namespace
	 * @param value
	 * @param parsed
	 * @returns {*}
	 */
	static deepen(namespace, value, parsed)
	{
		var t, parts, part;
		t = parsed;
		parts = namespace.split('.');

		while(parts.length)
		{
			part = parts.shift();
			if(!parts.length)
			{
				t = t[part] = value;
			}
			else
			{
				t = t[part] = t[part] || {};
			}
		}
		return parsed;
	}

	/**
	 * Camelize dash separated string
	 * @param str
	 * @returns {string|XML|void|*}
	 */
	static camelize(str)
	{
		return str.replace(/-(.)/g, function(match, group1)
		{
			return group1.toUpperCase();
		});
	}

	/**
	 * Remove blank spaces
	 * @param str
	 * @returns {string|XML|void|*}
	 */
	static cleanSpaces(str)
	{
		return str.replace(/\s+/g, '');
	}

	/**
	 * Remove locale key from string.
	 * Rebuild the string back without -locale- and
	 * locale value itself
	 * @param str
	 * @returns {*}
	 */
	static cleanLocale(str)
	{
		let _str = str.replace('-locale-', '-');
		if(typeof _str !== 'undefined')
		{
			_str = _str.split('-');
			_str.pop();
			return _str.join('-');
		}

		return str;
	}

	/**
	 * Remove __dict key
	 * @param str
	 * @returns {string|XML|void|*}
	 */
	static cleanDict(str)
	{
		return str.replace('__dict', '');
	}

	/**
	 * Remove __obj_parse key
	 * @param str
	 * @returns {string|XML|void|*}
	 */
	static cleanObjParse(str)
	{
		return str.replace('__obj_parse', '');
	}
}

export default Parsers;