class Parsers
{
    constructor()
    {

    }

    static toArray(str)
    {
        str = str.substring(1,str.length).split(',');

        return str;

    }
}





export default Parsers;