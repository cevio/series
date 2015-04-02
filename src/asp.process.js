// shim for using process in browser
(function(){
	
	// process module
	// --------------------------
	var 
		ROOT = this,
		_ = this._;
		
	this.modalMaps = {
		fs: fs,
		path: path,
		underscore: _,
		promise: Promise,
		util: this.util,
		events: this.events,
		http: this.http,
		https: this.https
	};
	
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
	
	var PROCESS = function(){ Global.events.EventEmitter.call(this); };
	Global.util.inherits(PROCESS, Global.events.EventEmitter);
	process = new PROCESS();
	
	process.title = 'Series Asp Worker';
	process.browser = false;
	process.env = envs;
	process.argv = [];
	process.version = '1.1.432';
	process.platform = 'win32';
	process.modules = {};
	process.bags = 'series_modules';
	process.worker = '/';
	
	process.nextTick = function(fun){
		queue.push(fun);
		if (!draining) {
			setTimeout(drainQueue, 0);
		}
	}
	
	process.binding = function(method){
		return Global[method];
	}
	
	process.chdir = function(dir){
		this.worker = dir;
	}
	
	process.cwd = function(){
		return this.worker;
	}
	
	process.uptime = function(){
		return new Date().getTime() - timer;
	}
	
	process.createServer = function(app){
		app = path.isAbsolute(app) ? app : path.resolve(Server.MapPath('./'), app);
		if ( this.env.SERIES_ENV === 'development' ){
			(new ROOT.Require(app)).main.exports();
		}else{
			try{
				(new ROOT.Require(app)).main.exports();
			}catch(e){
				this.emit('error', e);
			}
		}
	}
	
}).call(this);