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

Parser.ASSOC = { "UNARY" : 0, "QUANTIFIER" : 1, "LEFT" : 2, "RIGHT" : 3 }

// Order of operations
// From least precedence to most precedence
Parser.OOO = [
	["exists" ,Parser.ASSOC.QUANTIFIER],
	["forall" ,Parser.ASSOC.QUANTIFIER],
	["iff"    ,Parser.ASSOC.RIGHT],
	["then"   ,Parser.ASSOC.RIGHT],
	["or"     ,Parser.ASSOC.LEFT],
	["and"    ,Parser.ASSOC.LEFT],
	["not"    ,Parser.ASSOC.UNARY],
]

Parser.alnum = function(c) {
	return /[a-zA-Z0-9]/.test(c);
}

Parser.escape = function(s) {
	var out = '';
	for(var i = 0; i < s.length; ++i)
	{
		if(s[i] == ' ') ;
		else if(s[i] != '\\')
			out += s[i];
		else
		{
			//X should probably use substrings
			var replace = '';
			for(++i; i < s.length && Parser.alnum(s[i]); ++i)
				replace += s[i];
			//XX needs error handling
			out += Parser.ESCAPE[replace];
		}
	}
	return out;
}

Parser.toRPN = function(t) {
	var out = "";
	for(var i = t.length - 1; i > 0; i--)
		out += Parser.toRPN(t[i]);
	return out + t[0];
}

Parser.parse = function(s) {
	var LP = '(', RP = ')';
	var stack = [];
	stack.peek = function() { return stack[stack.length - 1]; }
	var val = undefined;
	for(var i = 0; i < s.length; ++i)
	{
		if(s[i] == LP)
			stack.push(s[i]);
		else if(s[i] == RP)
		{
			while(stack.peek() != LP)
				val = stack.pop().concat([val]);
			stack.pop();
		} else if(!Parser.OOO[s[i]])
			val = s[i];
		else switch(Parser.OOO[s[i]].assoc)
		{
		case Parser.ASSOC.UNARY:
			stack.push([s[i]]);
			break;
		case Parser.ASSOC.QUANTIFIER:
			stack.push([s[i],s[i+1]]);
			++i;
			break;	
		case Parser.ASSOC.LEFT:
			while(stack.length && stack.peek() != LP && Parser.OOO[stack.peek()[0]].prec >= Parser.OOO[s[i]].prec)
				val = stack.pop().concat([val])
			stack.push([s[i], val]);
			break;
		case Parser.ASSOC.RIGHT:
			while(stack.length && stack.peek() != LP && Parser.OOO[stack.peek()[0]].prec > Parser.OOO[s[i]].prec)
				val = stack.pop().concat([val])
			stack.push([s[i], val]);
			break;
		default:
			throw "Unimplemented";
		}
	}
	if(!val)
		throw "No value"
	while(stack.length > 0)
		val = stack.pop().concat([val]);
	return val;
}

Parser.init = function() {
	for(var k in Parser.ESCAPE)
		Parser.ESCAPE[k] = String.fromCharCode(Parser.ESCAPE[k]);

	var OOO = {};
	for(var i = 0; i < Parser.OOO.length; ++i)
		OOO[Parser.ESCAPE[Parser.OOO[i][0]]] = { "prec" : i, "assoc" : Parser.OOO[i][1] };
	Parser.OOO = OOO;
}

Parser.init();

