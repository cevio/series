;(function(){
	var ROOT = this;
	
	ROOT.Module = function(dirname){
		this.dirname = dirname;
		this.exports = null;
	};
	
	ROOT.Module.prototype.require = function(anothers){
		return (new ROOT.Require(this.resolve(anothers))).main.exports;
	};
	
	ROOT.Module.prototype.resolve = function(anothers){
		return ROOT.Resolve.get(this.dirname, anothers);
	};
	
}).call(this);