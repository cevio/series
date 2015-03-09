// Require Factory.
;(function(){
	
	// require module
	// ------------------------
	var 
		ROOT = this,
		_ = ROOT._;
// ----------------------------------------------------------------------		
	ROOT.Require = function(filename){
		this.filename = filename;
		this.dirname = path.dirname(filename);
		this.MakeRequire();
	};

	ROOT.Require.prototype.MakeRequire = function(){
		var filename = this.filename;
		
		if ( _.isUndefined(process.modules[filename]) ){
			this.execScript(this.wrapModule(this.loadFile()));
		}
		
		this.main = process.modules[filename];
	};
	
	ROOT.Require.prototype.loadFile = function(){
		if ( fs.exist(this.filename) ){
			return fs.readFile(this.filename);
		}else{
			process.emit('loadModule:unexist', this.filename);
			return 'module.exports={};';
		}
	};
	
	ROOT.Require.prototype.wrapModule = function( content ){
		var 
			filename = this.filename,
			isJSON = path.extname(filename).toLowerCase() === '.json',
			methods = ['require', 'exports', 'module', '__filename', '__dirname'];
		
		if ( isJSON ){ content = 'module.exports=' + content + ';';	};
		
		var wrapper = ['return function (' + methods.join(',') + '){', content, '};'].join("\n");
		
		return (new Function(wrapper))();
	};
	
	ROOT.Require.prototype.execScript = function(execNode){
		var 
			filename = this.filename,
			dirname = this.dirname,
			series = new ROOT.Module(dirname);

		var exports = series.exports = new Object();
		var require = series.require.bind(series);
			require.resolve = series.resolve.bind(series);
		
		try{
			execNode.call(exports, require, exports, series, filename, dirname );
			process.modules[filename] = series;
		}catch(e){
			//process.emit('require.compile.error', e, filename);
			throw new Error('require.compile.error:[' + filename + '] ' + e.message);
		};
	};
	
}).call(this);