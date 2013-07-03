Util = {};

Util.init = function() {
	Array.prototype.__defineGetter__("top",function() { return this[this.length - 1]; });
	Util.init = undefined;
}

Util.init()


