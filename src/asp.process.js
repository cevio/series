// shim for using process in browser
(function(){
	
	// process module
	// --------------------------
	var 
		ROOT = this,
		_ = this._;
	
	_.enumerate = function( object, callback ){
		var _object = new Enumerator(object),
			_ret = [];
	
		for (; !_object.atEnd() ; _object.moveNext() ) {
			if ( _.isFunction(callback) ){
				var d = callback(_object.item());
				if ( d !== null && d !== undefined ){
					_ret.push(d);
				}
			}else{
				_ret.push(_object.item());
			}
		}
	
		return _ret;
	};
	
	var 
		envs 		= {},
		queue 		= [],
		draining 	= false,
		timer		= new Date().getTime();
		
	function drainQueue() {
		if (draining) {
			return;
		}
		draining = true;
		var currentQueue;
		var len = queue.length;
		while(len) {
			currentQueue = queue;
			queue = [];
			var i = -1;
			while (++i < len) {
				currentQueue[i]();
			}
			len = queue.length;
		}
		draining = false;
	}
		
	_.enumerate(Request.ServerVariables, function(envtion){
		envs[envtion] = String(Request.ServerVariables(envtion)) || '';
	});
	
	envs.SERIES_ENV = 'production';
	
	var PROCESS = new Class();
	
	PROCESS.define('title', 'Series Asp Worker');
	PROCESS.define('browser', false);
	PROCESS.define('env', envs);
	PROCESS.define('argv', []);
	PROCESS.define('version', '1.0.0');
	PROCESS.define('platform', 'win32');
	PROCESS.define('modules', {});
	PROCESS.define('bags', 'series_modules');
	PROCESS.property('worker', '/');
	
	PROCESS.instance(event).extend(event);
	
	PROCESS.define('nextTick', function(fun){
		queue.push(fun);
		if (!draining) {
			setTimeout(drainQueue, 0);
		}
	});
	
	PROCESS.define('binding', function(method, context){
		return _.proxy(method, context);
	});
	
	PROCESS.define('chdir', function(dir){
		this.property('worker', dir)
	});
	
	PROCESS.define('cwd', function(){
		return this['private']('worker');
	});
	
	PROCESS.define('uptime', function(){
		return new Date().getTime() - timer;
	});
	
	PROCESS.define('umask', function( mask ){
		return mask || 0;
	});
	
	PROCESS.define('createServer', function( app ){
		app = path.resolve(Server.MapPath('./'), app);
		if ( this.env.SERIES_ENV === 'development' ){
			(new ROOT.Require(app)).main.exports();
		}else{
			try{
				(new ROOT.Require(app)).main.exports();
			}catch(e){
				this.emit('error', e);
			}
		}
	});
		
	process = new PROCESS();
	
}).call(this);