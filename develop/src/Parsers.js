class Parsers
{
    constructor()
    {

    }

    static toArray(str)
    {
        str = str.substring(1,str.length-1).split(',');

        return str;

    }

    static deepen(namespace, value, parsed) {
        var t, parts, part;
        t = parsed;
        parts = namespace.split('.');


        console.log('>>deepen', parts)
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

    static camelize(str)
    {
        return str.replace(/-(.)/g, function(match, group1) {
            return group1.toUpperCase();
        });
    }

    static cleanSpaces(str)
    {
        return str.replace(/\s+/g, '');
    }
}

export default Parsers;