var Rules = {};

Rules.SUBTYPE = {
	"Any" : [0,0],
	"SOL" : [1,4],
	"Var" : [2,2],
	"SOV" : [3,5],
	"FOL" : [4,1],
	"FOV" : [5,3],
	"Nun" : [6,6],
};

Rules.NEWTYPE = {}

Rules.TYPES = {
	"forall" : ["Var", "SOL", "SOL"],
	"exists" : ["Var", "SOL", "SOL"],
	"iff"    : ["SOL", "SOL", "SOL"],
	"then"   : ["SOL", "SOL", "SOL"],
	"or"     : ["SOL", "SOL", "SOL"],
	"and"    : ["SOL", "SOL", "SOL"],
	"not"    : ["SOL", "SOL"],
	"in"     : ["FOL", "FOL", "SOL"],
};

Rules.typeCheck = function(tree, expected, types) {
	if(expected === undefined)
		expected = "Any";
	if(types === undefined)
	{
		types = {};
		for(var k in Rules.TYPES)
			types[k] = Rules.TYPES[k];
	}
	if(tree.length == 1)
	{
		var value = tree[0];
		if(types[value] === undefined)
			types[value] = "SOV";
		types[value] = Rules.NEWTYPE[[types[value],expected]];
		return types[value];
	}
	var ftype = Rules.TYPES[tree[0]];
	if(ftype === undefined) return "Nun";
	var shadows = {};
	for(var i = 0; i < ftype.length - 1; ++i)
	{
		if(ftype[i] == "Var")
		{
			if(tree[i+1].length != 1) return false;
			var name = tree[i+1][0];
			if(shadows[name] === undefined)
				shadows[name] = [types[name]];
			types[name] = "Var";
		}
		else if(Rules.typeCheck(tree[i+1], ftype[i], types) == "Nun")
			return "Nun";
	}
	for(var k in shadows)
		types[k] = shadows[k][0];
	return Rules.NEWTYPE[[ftype.top,expected]];
};

Rules.ruleCheck = function(rule, args, rep) {
	if(rep === undefined)
		rep = {};
	if(rule.length !== args.length)
		return false;
	for(
};

Rules.equal = function(lhs, rhs, equiv) {
	if(equiv === undefined)
		equiv = {};
	if(lhs.length != rhs.length)
		return false;
	if(equiv[lhs[0]] === undefined ? lhs[0] != rhs[0] : equiv[lhs[0]] != rhs[0])
		return false;
	var ftype = Rules.TYPES[lhs[0]];
	var shadows = {};
	for(var i = 1; i < lhs.length; ++i)
	{
		if(ftype[i] == "Var")
		{
			var name = lhs[i][0];
			if(shadows[name] === undefined)
				shadows[name] = [equiv[name]];
			equiv[name] = rhs[i][0];
		} else if(!Rules.equal(lhs[i],rhs[i]))
			return false;
	}
	return true
};

Rules.subtype = function(sup, sub)
{
	for(var i = 0; i < 2; ++i)
		if(Rules.SUBTYPE[sup][i] > Rules.SUBTYPE[sub][i])
			return false;
	return true;
}

Rules.init = function() {
	for(var k1 in Rules.SUBTYPE)
	for(var k2 in Rules.SUBTYPE)
	{
		Rules.NEWTYPE[[k1,k2]] = "Nun";
		for(var k3 in Rules.SUBTYPE)
		if(Rules.subtype(k1,k3) && Rules.subtype(k2,k3) && Rules.subtype(k3,Rules.NEWTYPE[[k1,k2]]))
			Rules.NEWTYPE[[k1,k2]] = k3;
	}
	var types = {}
	for(var op in Rules.TYPES)
		types[Parser.ESCAPE[op]] = Rules.TYPES[op];
	Rules.TYPES = types;
	delete Rules.init;
}

Rules.init()

