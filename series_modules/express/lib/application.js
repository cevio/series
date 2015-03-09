/**
 * Module dependencies.
 */

var Router = require('./router');
var util = require('./utils.js');
var methods = require('./methods.js');
var View = require('./view.js');
var midware = require('./midware.js');

/**
 * Application prototype.
 */

var app = exports = module.exports = {};

/**
 * Module variables.
 */
var slice = Array.prototype.slice;

/**
 * Application Settings.
 */
 
app.settings = {
	"title": null,
	"version": null,
	"env": null,
	"jsonp callback name": null,
	"json replacer JSON replacer": null,
	"default file": null,
	"case sensitive routing": null,
	"strict routing": null,
	"view cache": null,
	"view engine": null,
	"views": null,
	"render engine": null,
	"render engine ext": null,
	"engines": null,
	"cache": null,
	"view": null,
	"x-powered-by": null
};

/**
 * Initialize the server.
 *
 *   - setup default configuration
 *   - setup default middleware
 *   - setup route reflection methods
 *
 * @api private
 */

app.init = function(){
  this.cache = {};
  this.settings = {};
  this.engines = {};
  this.defaultConfiguration();
};

/**
 * Initialize application configuration.
 *
 * @api private
 */

app.defaultConfiguration = function(){
  // default settings
  this.set('title', 'Series Express');
  this.set('version', '1.0.105');
  var env = process.env.SERIES_ENV || 'development';
  this.set('env', env);
	this.set('jsonp callback name', 'jsonp');
  this.set('default file', 'default.asp');
  this.disable('case sensitive routing');
	this.disable('strict routing');
	this.enable('view cache');
	this.set('view engine', 'ejs');
	this.set('views', path.resolve('views'));
	this.set('render engine ext', '.ejs');
	this.set('engines', {});
	this.set('cache', {});
	this.set('view', View);
	this.enable('x-powered-by');

  if (env === 'production') {
    this.enable('view cache');
  };

};

app.on = function(ev, fn){
	if ( !this.evs ) this.evs = {};
	if ( !this.evs[ev] ) this.evs[ev] = [];
	this.evs[ev].push(fn);
}

app.emit = function(){
	var ev = arguments[0];
	var argvs = [].concat(slice.call(arguments, 1));
	if ( this.evs && this.evs[ev] && _.isArray(this.evs[ev]) ){
		_.each(this.evs[ev], function(fn){
			if ( _.isFunction(fn) ){
				fn.apply(null, argvs);
			}
		});
	}
}

/**
 * Dispatch a req, res pair into the application. Starts pipeline processing.
 *
 * If no _done_ callback is provided, then default error handlers will respond
 * in the event of an error bubbling through the stack.
 *
 * @api private
 */

app.handle = function(req, res, done) {
  var router = this._router;
  if (!router) { done(); return; };	
  router.handle(req, res);
	done();
};

/**
 * lazily adds the base router if it has not yet been added.
 *
 * We cannot add the base router in the defaultConfiguration because
 * it reads app settings which might be set after that has run.
 *
 * @api private
 */
app.lazyrouter = function() {
  if (!this._router) {
    this._router = new Router({
      caseSensitive: this.enabled('case sensitive routing'),
      strict: this.enabled('strict routing')
    });
		
    this._router.use(midware.init(this));
  }
};

/**
 * Assign `setting` to `val`, or return `setting`'s value.
 *
 *    app.set('foo', 'bar');
 *    app.get('foo');
 *    // => "bar"
 *
 * Mounted servers inherit their parent server's settings.
 *
 * @param {String} setting
 * @param {*} [val]
 * @return {Server} for chaining
 * @api public
 */
app.set = function(setting, val){
  if (arguments.length === 1) {
    // app.get(setting)
    return this.settings[setting];
  }

  // set value
  this.settings[setting] = val;

  return this;
};

app.locals = function(key, value){
	var that = this;
	if ( !value ){
		_.each(key, function(b, a){
			that.locals[a] = b;
		});
	}else{
		that.locals[key] = value;
	}
}

/**
 * Check if `setting` is enabled (truthy).
 *
 *    app.enabled('foo')
 *    // => false
 *
 *    app.enable('foo')
 *    app.enabled('foo')
 *    // => true
 *
 * @param {String} setting
 * @return {Boolean}
 * @api public
 */

app.enabled = function(setting){
  return !!this.set(setting);
};

/**
 * Check if `setting` is disabled.
 *
 *    app.disabled('foo')
 *    // => true
 *
 *    app.enable('foo')
 *    app.disabled('foo')
 *    // => false
 *
 * @param {String} setting
 * @return {Boolean}
 * @api public
 */

app.disabled = function(setting){
  return !this.set(setting);
};

/**
 * Enable `setting`.
 *
 * @param {String} setting
 * @return {app} for chaining
 * @api public
 */

app.enable = function(setting){
  return this.set(setting, true);
};

/**
 * Disable `setting`.
 *
 * @param {String} setting
 * @return {app} for chaining
 * @api public
 */

app.disable = function(setting){
  return this.set(setting, false);
};

app.parseURL = function(req){
	var url = process.env.QUERY_STRING;
	var defaultFile = this.get('default file');

	if ( /^404\;/.test(url) ){
		url = url.split(';')[1].split('/');
		
		var _host;
		
		if ( url.length > 2 ){
			_host = url.slice(0, 2);
			req.host = url.slice(2, 3).join('/').replace(':80', '');
			_host.push(req.host);
			_host = _host.concat(url.slice(3));
			url = ['']. concat(url.slice(3)).join('/');
			req.url = _host.join('/');
		}else{
			req.host = url.slice(2).join('/').replace(':80', '');
			url = '/';
			req.url = url.join('/');
		}
	}else{
		url = process.env.PATH_INFO;
		req.url = 'http://' + process.env.HTTP_HOST + (process.env.SERVER_PORT == '80' ? '' : ':' + process.env.SERVER_PORT) + process.env.PATH_INFO;
		req.host = process.env.HTTP_HOST;
		if ( url.toLowerCase() === '/' + defaultFile.toLowerCase() ){
			url = '/';
		}
	};

	var querys = url.indexOf('?');
	if ( querys > -1 ){
		var _querystring = url.substring(querys + 1).replace(/^\&/, '');
		req.query = _.fromQuery(_querystring);
		url = url.substring(0, querys);
	};

	return url;
};

/**
 * Proxy `Router#use()` to add middleware to the app router.
 * See Router#use() documentation for details.
 *
 * If the _fn_ parameter is an express app, then it will be
 * mounted at the _route_ specified.
 *
 * @api public
 */

app.use = function use(fn) {
  var offset = 0;
  var path = '/';

  // default path to '/'
  // disambiguate app.use([fn])
  if (typeof fn !== 'function') {
    var arg = fn;

    while (_.isArray(arg) && arg.length !== 0) {
      arg = arg[0];
    }

    // first arg is the path
    if (typeof arg !== 'function') {
      offset = 1;
      path = fn;
    }
  }

  var fns = _.flatten(slice.call(arguments, offset));

  if (fns.length === 0) {
    throw new TypeError('app.use() requires middleware functions');
  }

  // setup router
  this.lazyrouter();
  var router = this._router;
	
  fns.forEach(function (fn) {
    // non-express app
    if ( !fn || !fn.handle || !fn.set ){
      return router.use(path, fn);
    }

    fn.mountpath = path;
    fn.parent = this;

    // restore .app property on req and res
    router.use(path, function mounted_app(req, res, next) {
      var orig = req.app;
      fn.handle(req, res, function (err) {
				req = util.mixin(req, orig.request);
				res = util.mixin(res, orig.response);
        next(err);
      });
    });
		
  }, this);

  return this;
};

/**
 * Proxy to the app `Router#route()`
 * Returns a new `Route` instance for the _path_.
 *
 * Routes are isolated middleware stacks for specific paths.
 * See the Route api docs for details.
 *
 * @api public
 */

app.route = function(path){
  this.lazyrouter();
  return this._router.route(path);
};


/**
 * Register the given template engine callback `fn`
 * as `ext`.
 *
 * By default will `require()` the engine based on the
 * file extension. For example if you try to render
 * a "foo.jade" file Express will invoke the following internally:
 *
 *     app.engine('jade', require('jade').__express);
 *
 * For engines that do not provide `.__express` out of the box,
 * or if you wish to "map" a different extension to the template engine
 * you may use this method. For example mapping the EJS template engine to
 * ".html" files:
 *
 *     app.engine('html', require('ejs').renderFile);
 *
 * In this case EJS provides a `.renderFile()` method with
 * the same signature that Express expects: `(path, options, callback)`,
 * though note that it aliases this method as `ejs.__express` internally
 * so if you're using ".ejs" extensions you dont need to do anything.
 *
 * Some template engines do not follow this convention, the
 * [Consolidate.js](https://github.com/tj/consolidate.js)
 * library was created to map all of node's popular template
 * engines to follow this convention, thus allowing them to
 * work seamlessly within Express.
 *
 * @param {String} ext
 * @param {Function} fn
 * @return {app} for chaining
 * @api public
 */

app.engine = function(ext, fn){
  if ('function' != typeof fn) throw new Error('callback function required');
  if ('.' != ext[0]) ext = '.' + ext;
  this.engines[ext] = fn;
  return this;
};

/**
 * Proxy to `Router#param()` with one added api feature. The _name_ parameter
 * can be an array of names.
 *
 * See the Router#param() docs for more details.
 *
 * @param {String|Array} name
 * @param {Function} fn
 * @return {app} for chaining
 * @api public
 */

app.param = function(name, fn){
  this.lazyrouter();

  if (_.isArray(name)) {
    name.forEach(function(key) {
      this.param(key, fn);
    }, this);
    return this;
  }

  this._router.param(name, fn);
  return this;
};

/**
 * Return the app's absolute pathname
 * based on the parent(s) that have
 * mounted it.
 *
 * For example if the application was
 * mounted as "/admin", which itself
 * was mounted as "/blog" then the
 * return value would be "/blog/admin".
 *
 * @return {String}
 * @api private
 */

app.path = function(){
  return this.parent
    ? this.parent.path() + this.mountpath
    : '';
};


/**
 * Delegate `.VERB(...)` calls to `router.VERB(...)`.
 */

methods.forEach(function(method){
  app[method] = function(path){
    if ('get' == method && 1 == arguments.length) return this.set(path);

    this.lazyrouter();

    var route = this._router.route(path);
    route[method].apply(route, slice.call(arguments, 1));
    return this;
  };
});

/**
 * Special-cased "all" method, applying the given route `path`,
 * middleware, and callback to _every_ HTTP method.
 *
 * @param {String} path
 * @param {Function} ...
 * @return {app} for chaining
 * @api public
 */

app.all = function(path){
  this.lazyrouter();

  var route = this._router.route(path);
  var args = slice.call(arguments, 1);
  methods.forEach(function(method){
    route[method].apply(route, args);
  });

  return this;
};

/**
 * Render the given view `name` name with `options`
 * and a callback accepting an error and the
 * rendered template string.
 *
 * Example:
 *
 *    app.render('email', { name: 'Tobi' }, function(err, html){
 *      // ...
 *    })
 *
 * @param {String} name
 * @param {String|Function} options or fn
 * @param {Function} fn
 * @api public
 */

app.render = function(name, options, fn){
  var opts = {};
  var cache = this.cache;
  var engines = this.engines;
  var view;

  // support callback function as second arg
  if ('function' == typeof options) {
    fn = options, options = {};
  }

  // merge app.locals
  util.merge(opts, this.locals);

  // merge options._locals
  if (options._locals) {
    util.merge(opts, options._locals);
  }

  // merge options
  util.merge(opts, options);

  // set .cache unless explicitly provided
  opts.cache = null == opts.cache
    ? this.enabled('view cache')
    : opts.cache;

  // primed cache
  if (opts.cache) view = cache[name];

  // view
  if (!view) {
    view = new (this.get('view'))(name, {
      defaultEngine: this.get('view engine'),
      root: this.get('views'),
      engines: engines
    });

    if (!view.path) {
      var dirs = _.isArray(view.root) && view.root.length > 1
        ? 'directories "' + view.root.slice(0, -1).join('", "') + '" or "' + view.root[view.root.length - 1] + '"'
        : 'directory "' + view.root + '"'
      var err = new Error('Failed to lookup view "' + name + '" in views ' + dirs);
      err.view = view;
      return fn(err);
    }

    // prime the cache
    if (opts.cache) cache[name] = view;
  }

  // render
  try {
    view.render(opts, fn);
  } catch (err) {
    fn(err);
  }
};

app.listen = function(){
	var res = this.response;
	this(this.request, res, function(){ res.end(); });
	
	return this;
};