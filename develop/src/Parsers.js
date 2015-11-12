class Parsers {
	constructor()
	{

	}

	static toArray(str)
	{
		str = str.substring(1, str.length - 1).split(',');

		return str;
	}

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

	static camelize(str)
	{
		return str.replace(/-(.)/g, function(match, group1)
		{
			return group1.toUpperCase();
		});
	}

	static cleanSpaces(str)
	{
		return str.replace(/\s+/g, '');
	}

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

	static cleanDict(str)
	{
		return str.replace('__dict', '');
	}

	static cleanObjParse(str)
	{
		return str.replace('__obj_parse', '');
	}
}

export default Parsers;