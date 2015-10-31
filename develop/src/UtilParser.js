function UtilParser(){

}

UtilParser.toArray = function(str)
{
	if(str.length)
	{
		return str.split(',');
	}

	return [];
}


UtilParser.toCoordinates = function(str)
{
	var coordinateArray = UtilParser.toArray(str);
	return {lat: parseFloat(coordinateArray[0]), lng: parseFloat(coordinateArray[1])};
}

UtilParser.toPosition = function(str)
{
	var coordinateArray = UtilParser.toArray(str);
	return {x: parseFloat(coordinateArray[0]), y: parseFloat(coordinateArray[1])};
}

UtilParser.camelize = function(str)
{
	return str.replace(/-(.)/g, function(match, group1) {
		return group1.toUpperCase();
	});
}

UtilParser.cleanSpaces = function(str)
{
	return str.replace(/\s+/g, '');
}

UtilParser.deepen = function(namespace, value, parsed) {
	var t, parts, part;
	t = parsed;
	parts = namespace.split('.');

	while (parts.length) {
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



module.exports = UtilParser;