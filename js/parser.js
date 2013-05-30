var Parser = {};
Parser.ESCAPE = {
	"not"    : 0x00AC,
	"then"   : 0x2192,
	"iff"    : 0x2194,
	"forall" : 0x2200,
	"exists" : 0x2203,
	"and"    : 0x2227,
	"or"     : 0x2228,
	"true"   : 0x22A4,
	"false"  : 0x22A5,
};

Parser.ASSOC = { "UNARY" : 0, "BINARY" : 1, "LEFT" : 2, "RIGHT" : 3 }

// Order of operations
// From least precedence to most precedence
Parser.OOO = [
	"exists  : Parser.ASSOC.BINARY,
	"forall" : Parser.ASSOC.BINARY,
	"iff"    : Parser.ASSOC.RIGHT,
	"then"   : Parser.ASSOC.RIGHT,
	"or"     : Parser.ASSOC.LEFT,
	"and"    : Parser.ASSOC.LEFT,
	"not"    : Parser.ASSOC.UNARY,
]

Parser.alnum = function(c) {
	return /[a-zA-Z0-9]/.test(c);
}

Parser.escape = function(s) {
	var out = '';
	for(var i = 0; i < s.length; ++i)
	{
		if(s.charAt(i) != '\\')
			out += s.charAt(i);
		else
		{
			//X should probably use substrings
			var replace = '';
			for(++i; i < s.length && Parser.alnum(s.charAt(i)); ++i)
				replace += s.charAt(i);
			//XX needs error handling
			out += Parser.ESCAPE[replace];
		}
	}
	return out;
}

Parser.parser = function(s) {
}

Parser.init = function() {
	for(var k in Parser.ESCAPE)
		Parser.ESCAPE[k] = String.fromCharCode(Parser.ESCAPE[k]);

	var Parser.START_PREC = Parser.OOO.length - 1;
	var OOO = {};
	for(var i = 0; i < OOO.length; ++i)
		OOO[PARSER.ESCAPE[OOO[i]]] = { "prec" : i, "assoc" : OOO[i] };
	Parser.OOO = OOO;
}



