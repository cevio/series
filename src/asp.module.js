;(function(){
	var ROOT = this;
	
	var systems = {
		fs: fs,
		path: path,
		underscore: _,
		promise: Promise
	}
	
	ROOT.Module = function(dirname){
		this.dirname = dirname;
		this.exports = null;
	};
	
	ROOT.Module.prototype.require = function(anothers){
		if ( systems[anothers] ){
			return systems[anothers];
		}
		return (new ROOT.Require(this.resolve(anothers))).main.exports;
	};
	
	ROOT.Module.prototype.resolve = function(anothers){
		return ROOT.Resolve.get(this.dirname, anothers);
	};
	
}).call(this);