!(function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        var f;
        "undefined" != typeof window ? f = window: "undefined" != typeof global ? f = global: "undefined" != typeof self && (f = self),
        f['express'] = e()
    }
})(function() {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    throw new Error("Cannot find module '" + o + "'")
                }
                var f = n[o] = {
                    exports: {}
                };
                t[o][0].call(f.exports,
                function(e) {
                    var n = t[o][1][e];
                    return s(n ? n: e)
                },
                f, f.exports, e, t, n, r)
            }
            return n[o].exports
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    })(
		{1:[function(_dereq_, module, exports){
var url=new Class();url.property("resolve",function(a){if(a.length===0){return}else{if(a.length===1){return a[0]}else{return a}}});url.define("get",function(a){return this["private"]("resolve")(_.enumerate(Request.QueryString(a)))});url.define("form",function(a){return this["private"]("resolve")(_.enumerate(Request.Form(a)))});url.define("getAll",function(){var a={},b=this;_.each(_.enumerate(Request.QueryString),function(c){a[c]=b.get(c)});return a});url.define("formAll",function(){var a={},b=this;_.each(_.enumerate(Request.Form),function(c){a[c]=b.form(c)});return a});url.define("host",process.env.HTTP_HOST);url.define("agent",process.env.HTTP_USER_AGENT);var ref=String(Request.ServerVariables("HTTP_REFERER"));if(ref&&ref.length>0&&ref!="undefined"){}else{ref=false}url.define("referer",ref);module.exports=url;
},{}],2:[function(_dereq_, module, exports){
var 
	url = _dereq_('url'),
	req = module.exports = new url();

req.params = {};
req.query = {};

req.protocol = process.env.SERVER_PORT;
req.ip = process.env.LOCAL_ADDR || process.env.REMOTE_ADDR || process.env.REMOTE_HOST;
req.agent = process.env.HTTP_USER_AGENT;
req.method = process.env.REQUEST_METHOD.toLowerCase();
},{"url":1}],3:[function(_dereq_, module, exports){
(function(a){if(typeof exports=="object"||typeof exports==="function"&&typeof module=="object"){module.exports=a()}else{if(typeof define=="function"&&define.amd){return define(["jquery"],a)}else{window.md5=a(jQuery)}}})(function(j){var g=false;if(!j){var n=j={},g=true;j.isFunction=function(o){return typeof o==="function"};j.isArray=function(o){return typeof o==="array"};var f=Object.prototype.hasOwnProperty,d=Object.prototype.toString,m=function(p){if(!p||d.call(p)!=="[object Object]"||p.nodeType||p.setInterval){return false}if(p.constructor&&!f.call(p,"constructor")&&!f.call(p.constructor.prototype,"isPrototypeOf")){return false}var o;for(o in p){}return o===undefined||f.call(p,o)};j.isPlainObject=m;j.extend=function(){var t=arguments[0]||{},s=1,r=arguments.length,v=false,w,q,o,p;if(typeof t==="boolean"){v=t;t=arguments[1]||{};s=2}if(typeof t!=="object"&&!n.isFunction(t)){t={}}if(r===s){t=this;--s}for(;s<r;s++){if((w=arguments[s])!=null){for(q in w){o=t[q];p=w[q];if(t===p){continue}if(v&&p&&(n.isPlainObject(p)||n.isArray(p))){var u=o&&(n.isPlainObject(o)||n.isArray(o))?o:n.isArray(p)?[]:{};t[q]=n.extend(v,u,p)}else{if(p!==undefined){t[q]=p}}}}}return t};var l={}}else{var n=j}var h=/\+/g;function k(o){return e.raw?o:encodeURIComponent(o)}function a(o){return e.raw?o:decodeURIComponent(o)}function i(o){return k(e.json?JSON.stringify(o):String(o))}function c(o){if(o.indexOf('"')===0){o=o.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")}try{o=decodeURIComponent(o.replace(h," "));return e.json?JSON.parse(o):o}catch(p){}}function b(p,o){var q=e.raw?p:c(p);return j.isFunction(o)?o(q):q}var e=j.cookie=function(w,v,A){if(v!==undefined&&!j.isFunction(v)){A=j.extend({},e.defaults,A);if(typeof A.expires==="number"){var x=A.expires,z=A.expires=new Date();z.setDate(z.getDate()+x)}if(!A.httponly){A.httponly=true}var u=[k(w),"=",i(v),A.expires?"; expires="+A.expires.toUTCString():"",A.path?"; path="+A.path:"",A.domain?"; domain="+A.domain:"",A.secure?"; secure":""].join("");if(g){u=u.replace(/\;$/,"");if(A.httponly){u+="; HttpOnly"}Response.AddHeader("Set-Cookie",u);return u}else{window.document.cookie=u;return u}}var B=w?undefined:{};var y;if(g){y=String(Request.ServerVariables("HTTP_COOKIE"))||"";if(y=="undefined"){y=""}y=y&&y.length>0?y.split("; "):[]}else{y=l.cookie?l.cookie.split("; "):[]}for(var s=0,q=y.length;s<q;s++){var r=y[s].split("=");var o=a(r.shift());var p=r.join("=");if(w&&w===o){B=b(p,v);break}if(!w&&(p=b(p))!==undefined){B[o]=p}}return B};e.defaults={};j.removeCookie=function(p,o){if(j.cookie(p)===undefined){return false}j.cookie(p,"",j.extend({},o,{expires:-1}));return !j.cookie(p)};if(g){return j}});
},{}],4:[function(_dereq_, module, exports){
var 
	$ = _dereq_('cookie'),
	res = module.exports = new Global.watcher();
	
res.buffers = [];
res.handles = [];
res._jsons = {};
	
res.cookie = function(){
	return $.cookie.apply($, arguments);
};

res.clearCookie = function(){
	return $.removeCookie.apply($, arguments);
};

res.get = function(key){
	return process.env[key];
}

res.set = function(key, value){
	var that = this;
	if ( !value ){
		_.each(key, function(b, a){
			that.set(a, b);
		});
	}else{
		Response.AddHeader(key, value);
	}
	return this;
};

res.charset = function(charset){
	Response.Charset = charset;
};

res.log = function(){
	res.buffers.push(Array.prototype.slice.call(arguments, 0).join(''));
};

res.json = function(data){
	res._jsons = _.extend(res._jsons, data);
};

res.clear = function(){
	res.buffers = [];
};

res.end = function(callback){
	var str;
	if ( _.isFunction(callback) ){
		callback.call(this, this.buffers);
	}
	else if ( _.isString(callback) ){
		this.log(callback);
	}
	else if ( _.isObject(callback) ){
		this.json(callback);
	}
	else{
		str = this.buffers.join('');
		if ( res.handles.length > 0 ){
			_.each(res.handles, function(fn){
				if ( _.isFunction(fn) ){
					var _str = fn(res.req, res);
					if ( _str ) str = _str;
				}
			});
		}
		if ( !str ){
			str = JSON.stringify(res._jsons);
		}
	};
	str && str.length > 0 && console.log(str);
}
},{"cookie":3}],5:[function(_dereq_, module, exports){
var isArray = _.isArray;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
  // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
  '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',
  // Match regexp special characters that are always escaped.
  '([.+*?=^!:${}()[\\]|\\/])'
].join('|'), 'g');

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1');
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re;
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {String}
 */
function flags (options) {
  return options.sensitive ? '' : 'i';
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {RegExp} path
 * @param  {Array}  keys
 * @return {RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name:      i,
        delimiter: null,
        optional:  false,
        repeat:    false
      });
    }
  }

  return attachKeys(path, keys);
}

/**
 * Transform an array into a regexp.
 *
 * @param  {Array}  path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));
  return attachKeys(regexp, keys);
}

/**
 * Replace the specific tags with regexp strings.
 *
 * @param  {String} path
 * @param  {Array}  keys
 * @return {String}
 */
function replacePath (path, keys) {
  var index = 0;

  function replace (_, escaped, prefix, key, capture, group, suffix, escape) {
    if (escaped) {
      return escaped;
    }

    if (escape) {
      return '\\' + escape;
    }

    var repeat   = suffix === '+' || suffix === '*';
    var optional = suffix === '?' || suffix === '*';

    keys.push({
      name:      key || index++,
      delimiter: prefix || '/',
      optional:  optional,
      repeat:    repeat
    });

    prefix = prefix ? ('\\' + prefix) : '';
    capture = escapeGroup(capture || group || '[^' + (prefix || '\\/') + ']+?');

    if (repeat) {
      capture = capture + '(?:' + prefix + capture + ')*';
    }

    if (optional) {
      return '(?:' + prefix + '(' + capture + '))?';
    }

    // Basic parameter support.
    return prefix + '(' + capture + ')';
  }

  return path.replace(PATH_REGEXP, replace);
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 [keys]
 * @param  {Object}                [options]
 * @return {RegExp}
 */
function pathToRegexp (path, keys, options) {
  keys = keys || [];

  if (!isArray(keys)) {
    options = keys;
    keys = [];
  } else if (!options) {
    options = {};
  }

  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys, options);
  }

  if (isArray(path)) {
    return arrayToRegexp(path, keys, options);
  }

  var strict = options.strict;
  var end = options.end !== false;
  var route = replacePath(path, keys);
  var endsWithSlash = path.charAt(path.length - 1) === '/';

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithSlash ? '' : '(?=\\/|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys);
}

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp;
},{}],6:[function(_dereq_, module, exports){
/**
 * Module dependencies.
 */
var pathRegexp = _dereq_('path-to-regexp');

/**
 * Module variables.
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

function Layer(path, options, fn) {
  if (!(this instanceof Layer)) {
    return new Layer(path, options, fn);
  }

  options = options || {};

  this.handle = fn;
  this.name = fn.name || '<anonymous>';
  this.params = undefined;
  this.path = undefined;
  this.regexp = pathRegexp(path, this.keys = [], options);

  if (path === '/' && options.end === false) {
    this.regexp.fast_slash = true;
  }
}

/**
 * Handle the error for the layer.
 *
 * @param {Error} error
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @api private
 */

Layer.prototype.handle_error = function handle_error(error, req, res, next) {
  var fn = this.handle;

  if (fn.length !== 4) {
    // not a standard error handler
    return next(error);
  }

  try {
    fn(error, req, res, next);
  } catch (err) {
    next(err);
  }
};

/**
 * Handle the request for the layer.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @api private
 */

Layer.prototype.handle_request = function handle(req, res, next) {
  var fn = this.handle;

  if (fn.length > 3) {
    // not a standard request handler
    return next();
  }

  try {
    fn(req, res, next);
  } catch (err) {
    next(err);
  }
};

/**
 * Check if this route matches `path`, if so
 * populate `.params`.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

Layer.prototype.match = function match(path) {
  if (path == null) {
    // no path, nothing matches
    this.params = undefined;
    this.path = undefined;
    return false;
  }

  if (this.regexp.fast_slash) {
    // fast path non-ending match for / (everything matches)
    this.params = {};
    this.path = '';
    return true;
  }

  var m = this.regexp.exec(path);

  if (!m) {
    this.params = undefined;
    this.path = undefined;
    return false;
  }

  // store values
  this.params = {};
  this.path = m[0];

  var keys = this.keys;
  var params = this.params;
  var prop;
  var n = 0;
  var key;
  var val;

  for (var i = 1, len = m.length; i < len; ++i) {
    key = keys[i - 1];
    prop = key
      ? key.name
      : n++;
    val = decode_param(m[i]);

    if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
      params[prop] = val;
    }
  }

  return true;
};

/**
 * Decode param value.
 *
 * @param {string} val
 * @return {string}
 * @api private
 */

function decode_param(val){
  if (typeof val !== 'string') {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (e) {
    var err = new TypeError("Failed to decode param '" + val + "'");
    err.status = 400;
    throw err;
  }
};

/**
 * Expose `Layer`.
 */

module.exports = Layer;

},{"path-to-regexp":5}],7:[function(_dereq_, module, exports){
module.exports=["get","post","put","head","delete","options","trace","copy","lock","mkcol","move","purge","propfind","proppatch","unlock","report","mkactivity","checkout","merge","m-search","notify","subscribe","unsubscribe","patch","search","connect"];
},{}],8:[function(_dereq_, module, exports){
/**
 * Module dependencies.
 */

var Layer = _dereq_('layer');
var methods = _dereq_('../methods.js');
var utils = _;

/**
 * Expose `Route`.
 */

module.exports = Route;

/**
 * Initialize `Route` with the given `path`,
 *
 * @param {String} path
 * @api private
 */

function Route(path) {
  this.path = path;
  this.stack = [];

  // route handlers for various http methods
  this.methods = {};
}

/**
 * @api private
 */

Route.prototype._handles_method = function _handles_method(method) {
  if (this.methods._all) {
    return true;
  }

  method = method.toLowerCase();

  if (method === 'head' && !this.methods['head']) {
    method = 'get';
  }

  return Boolean(this.methods[method]);
};

/**
 * @return {Array} supported HTTP methods
 * @api private
 */

Route.prototype._options = function _options() {
  var methods = Object.keys(this.methods);

  // append automatic head
  if (this.methods.get && !this.methods.head) {
    methods.push('head');
  }

  for (var i = 0; i < methods.length; i++) {
    // make upper case
    methods[i] = methods[i].toUpperCase();
  }

  return methods;
};

/**
 * dispatch req, res into this route
 *
 * @api private
 */

Route.prototype.dispatch = function(req, res, done){
  var idx = 0;
  var stack = this.stack;
  if (stack.length === 0) {
    return done();
  }

  var method = req.method.toLowerCase();
  if (method === 'head' && !this.methods['head']) {
    method = 'get';
  }

  req.route = this;

  next();

  function next(err) {
    if (err && err === 'route') {
      return done();
    }

    var layer = stack[idx++];
    if (!layer) {
      return done(err);
    }

    if (layer.method && layer.method !== method) {
      return next(err);
    }

    if (err) {
      layer.handle_error(err, req, res, next);
    } else {
      layer.handle_request(req, res, next);
    }
  }
};

/**
 * Add a handler for all HTTP verbs to this route.
 *
 * Behaves just like middleware and can respond or call `next`
 * to continue processing.
 *
 * You can use multiple `.all` call to add multiple handlers.
 *
 *   function check_something(req, res, next){
 *     next();
 *   };
 *
 *   function validate_user(req, res, next){
 *     next();
 *   };
 *
 *   route
 *   .all(validate_user)
 *   .all(check_something)
 *   .get(function(req, res, next){
 *     res.send('hello world');
 *   });
 *
 * @param {function} handler
 * @return {Route} for chaining
 * @api public
 */

Route.prototype.all = function(){
  var callbacks = utils.flatten([].slice.call(arguments));
  callbacks.forEach(function(fn) {
    if (typeof fn !== 'function') {
      var type = {}.toString.call(fn);
      var msg = 'Route.all() requires callback functions but got a ' + type;
      throw new Error(msg);
    }

    var layer = Layer('/', {}, fn);
    layer.method = undefined;

    this.methods._all = true;
    this.stack.push(layer);
  }, this);

  return this;
};

methods.forEach(function(method){
  Route.prototype[method] = function(){
    var callbacks = utils.flatten([].slice.call(arguments));

    callbacks.forEach(function(fn) {
      if (typeof fn !== 'function') {
        var type = {}.toString.call(fn);
        var msg = 'Route.' + method + '() requires callback functions but got a ' + type;
        throw new Error(msg);
      }

      var layer = Layer('/', {}, fn);
      layer.method = method;

      this.methods[method] = true;
      this.stack.push(layer);
    }, this);
    return this;
  };
});

},{"layer":6,"../methods.js":7}],9:[function(_dereq_, module, exports){
/**
 * mixin support.
 *
 * @old target object
 * @my source object
 * @bOverwrite can been writen
 */
exports.mixin = function( my, old, bOverwrite ) {
	var my = my || {},
		key,
		bOverwrite = bOverwrite || false;  

	for ( key in old ) {
		if ( old.hasOwnProperty(key) ) {
			if( typeof my[key] != 'undefined' && bOverwrite ){
				continue;
			}
			var fn = old[key];
			my[key] = fn;
		}
	}
	
	return my;
}

/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *
 *     merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api public
 */

exports.merge = function(a, b, c){
  if (a && b) {
    for (var key in b) {
      a[key] = _.isFunction(b[key]) && c ? b[key].bind(c) : b[key];
    }
  }
  return a;
};

/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 * @api private
 */

exports.escapeHTML = function(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

},{}],10:[function(_dereq_, module, exports){

/**
 * Module dependencies.
 */

var Route = _dereq_('./route.js');
var Layer = _dereq_('layer');
var methods = _dereq_('../methods.js');
var util = _dereq_('../utils.js');

/**
 * Module variables.
 */

var objectRegExp = /^\[object (\S+)\]$/;
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

/**
 * Initialize a new `Router` with the given `options`.
 *
 * @param {Object} options
 * @return {Router} which is an callable function
 * @api public
 */

var proto = module.exports = function(options) {
  options = options || {};

  function router(req, res, next) {
    router.handle(req, res, next);
  }

  // mixin Router class functions
	router = util.mixin(router, proto);

  router.params = {};
  router._params = [];
  router.caseSensitive = options.caseSensitive;
  router.mergeParams = options.mergeParams;
  router.strict = options.strict;
  router.stack = [];

  return router;
};


/**
 * Dispatch a req, res into the router.
 *
 * @api private
 */

proto.handle = function(req, res, done) {
  var self = this;

  var search = 1 + req.url.indexOf('?');
  var pathlength = search ? search - 1 : req.url.length;
  var fqdn = req.url[0] !== '/' && 1 + req.url.substr(0, pathlength).indexOf('://');
  var protohost = fqdn ? req.url.substr(0, req.url.indexOf('/', 2 + fqdn)) : '';
  var idx = 0;
  var removed = '';
  var slashAdded = false;
  var paramcalled = {};

  // store options for OPTIONS request
  // only used if OPTIONS request
  var options = [];

  // middleware and routes
  var stack = self.stack;

  // manage inter-router variables
  var parentParams = req.params;
  var parentUrl = req.baseUrl || '';
  done = restore(done, req, 'baseUrl', 'next', 'params');

  // setup next layer
  req.next = next;

  // for options requests, respond with a default if nothing else responds
  if (req.method === 'OPTIONS') {
    done = wrap(done, function(old, err) {
      if (err || options.length === 0) return old(err);
      sendOptionsResponse(res, options, old);
    });
  }

  // setup basic req values
  req.baseUrl = parentUrl;
  req.originalUrl = req.originalUrl || req.url;

  next();

  function next(err) {
    var layerError = err === 'route'
      ? null
      : err;

    // remove added slash
    if (slashAdded) {
      req.url = req.url.substr(1);
      slashAdded = false;
    }

    // restore altered req.url
    if (removed.length !== 0) {
      req.baseUrl = parentUrl;
      req.url = protohost + removed + req.url.substr(protohost.length);
      removed = '';
    }

    // no more matching layers
    if (idx >= stack.length) {
      setImmediate(done, layerError);
      return;
    }

    // get pathname of request
    var path = req.path || req.host;
    if (path == null) {
      return done(layerError);
    }

    // find next matching layer
    var layer;
    var match;
    var route;

    while (match !== true && idx < stack.length) {
      layer = stack[idx++];

      match = matchLayer(layer, path);
      route = layer.route;

      if (typeof match !== 'boolean') {
        // hold on to layerError
        layerError = layerError || match;
      }

      if (match !== true) {
        continue;
      }

      if (!route) {
        // process non-route handlers normally
        continue;
      }

      if (layerError) {
        // routes do not match with a pending error
        match = false;
        continue;
      }

      var method = req.method;
      var has_method = route._handles_method(method);

      // build up automatic options response
      if (!has_method && method === 'OPTIONS') {
        appendMethods(options, route._options());
      }

      // don't even bother matching route
      if (!has_method && method !== 'HEAD') {
        match = false;
        continue;
      }
    }

    // no match
    if (match !== true) {
      return done(layerError);
    }

    // store route for dispatch on change
    if (route) {
      req.route = route;
    }

    // Capture one-time layer values
    req.params = self.mergeParams
      ? mergeParams(layer.params, parentParams)
      : layer.params;
    var layerPath = layer.path;

    // this should be done for the layer
    self.process_params(layer, paramcalled, req, res, function (err) {
      if (err) {
        return next(layerError || err);
      }

      if (route) {
        return layer.handle_request(req, res, next);
      }

      trim_prefix(layer, layerError, layerPath, path);
    });
  }

  function trim_prefix(layer, layerError, layerPath, path) {
    var c = path[layerPath.length];
    if (c && '/' !== c && '.' !== c) return next(layerError);

     // Trim off the part of the url that matches the route
     // middleware (.use stuff) needs to have the path stripped
    if (layerPath.length !== 0) {
      removed = layerPath;
      req.url = protohost + req.url.substr(protohost.length + removed.length);

      // Ensure leading slash
      if (!fqdn && req.url[0] !== '/') {
        req.url = '/' + req.url;
        slashAdded = true;
      }

      // Setup base URL (no trailing slash)
      req.baseUrl = parentUrl + (removed[removed.length - 1] === '/'
        ? removed.substring(0, removed.length - 1)
        : removed);
    }

    if (layerError) {
      layer.handle_error(layerError, req, res, next);
    } else {
      layer.handle_request(req, res, next);
    }
  }
};


/**
 * Use the given middleware function, with optional path, defaulting to "/".
 *
 * Use (like `.all`) will run for any http METHOD, but it will not add
 * handlers for those methods so OPTIONS requests will not consider `.use`
 * functions even if they could respond.
 *
 * The other difference is that _route_ path is stripped and not visible
 * to the handler function. The main effect of this feature is that mounted
 * handlers can operate without any code changes regardless of the "prefix"
 * pathname.
 *
 * @api public
 */

proto.use = function use(fn) {
  var offset = 0;
  var path = '/';

  // default path to '/'
  // disambiguate router.use([fn])
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

  var callbacks = _.flatten(slice.call(arguments, offset));

  if (callbacks.length === 0) {
    throw new TypeError('Router.use() requires middleware functions');
  }

  callbacks.forEach(function (fn) {
    if (typeof fn !== 'function') {
      throw new Error('Router.use() requires middleware function but got a ' + (typeof fn));
    }

    var layer = new Layer(path, {
      sensitive: this.caseSensitive,
      strict: false,
      end: false
    }, fn);

    layer.route = undefined;

    this.stack.push(layer);
  }, this);

  return this;
};

/**
 * Map the given param placeholder `name`(s) to the given callback.
 *
 * Parameter mapping is used to provide pre-conditions to routes
 * which use normalized placeholders. For example a _:user_id_ parameter
 * could automatically load a user's information from the database without
 * any additional code,
 *
 * The callback uses the same signature as middleware, the only difference
 * being that the value of the placeholder is passed, in this case the _id_
 * of the user. Once the `next()` function is invoked, just like middleware
 * it will continue on to execute the route, or subsequent parameter functions.
 *
 * Just like in middleware, you must either respond to the request or call next
 * to avoid stalling the request.
 *
 *  app.param('user_id', function(req, res, next, id){
 *    User.find(id, function(err, user){
 *      if (err) {
 *        return next(err);
 *      } else if (!user) {
 *        return next(new Error('failed to load user'));
 *      }
 *      req.user = user;
 *      next();
 *    });
 *  });
 *
 * @param {String} name
 * @param {Function} fn
 * @return {app} for chaining
 * @api public
 */

proto.param = function param(name, fn) {
  // param logic
  if (typeof name === 'function') {
    this._params.push(name);
    return;
  }

  // apply param functions
  var params = this._params;
  var len = params.length;
  var ret;

  if (name[0] === ':') {
    name = name.substr(1);
  }

  for (var i = 0; i < len; ++i) {
    if (ret = params[i](name, fn)) {
      fn = ret;
    }
  }

  // ensure we end up with a
  // middleware function
  if ('function' != typeof fn) {
    throw new Error('invalid param() call for ' + name + ', got ' + fn);
  }

  (this.params[name] = this.params[name] || []).push(fn);
  return this;
};

/**
 * Process any parameters for the layer.
 *
 * @api private
 */

proto.process_params = function(layer, called, req, res, done) {
  var params = this.params;

  // captured parameters from the layer, keys and values
  var keys = layer.keys;

  // fast track
  if (!keys || keys.length === 0) {
    return done();
  }

  var i = 0;
  var name;
  var paramIndex = 0;
  var key;
  var paramVal;
  var paramCallbacks;
  var paramCalled;

  // process params in order
  // param callbacks can be async
  function param(err) {
    if (err) {
      return done(err);
    }

    if (i >= keys.length ) {
      return done();
    }

    paramIndex = 0;
    key = keys[i++];

    if (!key) {
      return done();
    }

    name = key.name;
    paramVal = req.params[name];
    paramCallbacks = params[name];
    paramCalled = called[name];

    if (paramVal === undefined || !paramCallbacks) {
      return param();
    }

    // param previously called with same value or error occurred
    if (paramCalled && (paramCalled.error || paramCalled.match === paramVal)) {
      // restore value
      req.params[name] = paramCalled.value;

      // next param
      return param(paramCalled.error);
    }

    called[name] = paramCalled = {
      error: null,
      match: paramVal,
      value: paramVal
    };

    paramCallback();
  }

  // single param callbacks
  function paramCallback(err) {
    var fn = paramCallbacks[paramIndex++];

    // store updated value
    paramCalled.value = req.params[key.name];

    if (err) {
      // store error
      paramCalled.error = err;
      param(err);
      return;
    }

    if (!fn) return param();

    try {
      fn(req, res, paramCallback, paramVal, key.name);
    } catch (e) {
      paramCallback(e);
    }
  }

  param();
};

/**
 * Create a new Route for the given path.
 *
 * Each route contains a separate middleware stack and VERB handlers.
 *
 * See the Route api documentation for details on adding handlers
 * and middleware to routes.
 *
 * @param {String} path
 * @return {Route}
 * @api public
 */

proto.route = function(path){
  var route = new Route(path);

  var layer = new Layer(path, {
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  }, route.dispatch.bind(route));

  layer.route = route;

  this.stack.push(layer);
  return route;
};

// create Router#VERB functions
methods.concat('all').forEach(function(method){
  proto[method] = function(path){
    var route = this.route(path);
    route[method].apply(route, slice.call(arguments, 1));
    return this;
  };
});

// append methods to a list of methods
function appendMethods(list, addition) {
  for (var i = 0; i < addition.length; i++) {
    var method = addition[i];
    if (list.indexOf(method) === -1) {
      list.push(method);
    }
  }
}

// get type for error message
function gettype(obj) {
  var type = typeof obj;

  if (type !== 'object') {
    return type;
  }

  // inspect [[Class]] for objects
  return toString.call(obj)
    .replace(objectRegExp, '$1');
}

/**
 * Match path to a layer.
 *
 * @param {Layer} layer
 * @param {string} path
 * @private
 */

function matchLayer(layer, path) {
  try {
    return layer.match(path);
  } catch (err) {
    return err;
  }
}

// merge params with parent params
function mergeParams(params, parent) {
  if (typeof parent !== 'object' || !parent) {
    return params;
  }

  // make copy of parent for base
  var obj = mixin({}, parent);

  // simple non-numeric merging
  if (!(0 in params) || !(0 in parent)) {
    return mixin(obj, params);
  }

  var i = 0;
  var o = 0;

  // determine numeric gaps
  while (i === o || o in parent) {
    if (i in params) i++;
    if (o in parent) o++;
  }

  // offset numeric indices in params before merge
  for (i--; i >= 0; i--) {
    params[i + o] = params[i];

    // create holes for the merge when necessary
    if (i < o) {
      delete params[i];
    }
  }

  return mixin(parent, params);
}

// restore obj props after function
function restore(fn, obj) {
  var props = new Array(arguments.length - 2);
  var vals = new Array(arguments.length - 2);

  for (var i = 0; i < props.length; i++) {
    props[i] = arguments[i + 2];
    vals[i] = obj[props[i]];
  }

  return function(err){
    // restore vals
    for (var i = 0; i < props.length; i++) {
      obj[props[i]] = vals[i];
    }

    return fn.apply(this, arguments);
  };
}

// send an OPTIONS response
function sendOptionsResponse(res, options, next) {
  try {
    var body = options.join(',');
    res.set('Allow', body);
    res.send(body);
  } catch (err) {
    next(err);
  }
}

// wrap a function
function wrap(old, fn) {
  return function proxy() {
    var args = new Array(arguments.length + 1);

    args[0] = old;
    for (var i = 0, len = arguments.length; i < len; i++) {
      args[i + 1] = arguments[i];
    }

    fn.apply(this, args);
  };
}
},{"./route.js":8,"layer":6,"../methods.js":7,"../utils.js":9}],11:[function(_dereq_, module, exports){
/**
 * Module variables.
 * @private
 */

var dirname = path.dirname;
var basename = path.basename;
var extname = path.extname;
var join = path.join;
var resolve = path.resolve;

/**
 * Expose `View`.
 */

module.exports = View;

/**
 * Initialize a new `View` with the given `name`.
 *
 * Options:
 *
 *   - `defaultEngine` the default template engine name
 *   - `engines` template engine require() cache
 *   - `root` root path for view lookup
 *
 * @param {String} name
 * @param {Object} options
 * @api private
 */

function View(name, options) {
  options = options || {};
  this.name = name;
  this.root = options.root;
  var engines = options.engines;
  this.defaultEngine = options.defaultEngine;
  var ext = this.ext = extname(name);
  if (!ext && !this.defaultEngine) throw new Error('No default engine was specified and no extension was provided.');
  if (!ext) name += (ext = this.ext = ('.' != this.defaultEngine[0] ? '.' : '') + this.defaultEngine);
  this.engine = engines[ext] || (engines[ext] = require(ext.slice(1)).__express);
  this.path = this.lookup(name);
}

/**
 * Lookup view by the given `name`
 *
 * @param {String} name
 * @return {String}
 * @api private
 */

View.prototype.lookup = function lookup(name) {
  var pather;
  var roots = [].concat(this.root);

  for (var i = 0; i < roots.length && !pather; i++) {
    var root = roots[i];

    // resolve the path
    var loc = resolve(root, name);
    var dir = dirname(loc);
    var file = basename(loc);

    // resolve the file
    pather = this.resolve(dir, file);
  }

  return pather;
};

/**
 * Render with the given `options` and callback `fn(err, str)`.
 *
 * @param {Object} options
 * @param {Function} fn
 * @api private
 */

View.prototype.render = function render(options, fn) {
  this.engine(this.path, options, fn);
};

/**
 * Resolve the file within the given directory.
 *
 * @param {string} dir
 * @param {string} file
 * @private
 */

View.prototype.resolve = function resolve(dir, file) {
  var ext = this.ext;
  var pather;
  var stat;

  // <path>.<ext>
  pather = resolve(dir, file);
	if ( !/^\w:\\/.test(pather) ) pather = path.server(pather);
  stat = tryStat(pather);

  if (stat && stat.isFile()) {
    return pather;
  }

  // <path>/index.<ext>
  pather = resolve(dir, basename(file, ext), 'index' + ext);
  stat = tryStat(pather);

  if (stat && stat.isFile()) {
    return pather;
  }
};

/**
 * Return a stat, maybe.
 *
 * @param {string} path
 * @return {fs.Stats}
 * @private
 */

function tryStat(path) {
  try {
    return fs.stats(path);
  } catch (e) {
    return undefined;
  }
}

},{}],12:[function(_dereq_, module, exports){
/**
 * Initialization middleware, exposing the
 * request and response to each other, as well
 * as defaulting the X-Powered-By header field.
 *
 * @param {Function} app
 * @return {Function}
 * @api private
 */

var util = _dereq_('./utils.js');

exports.init = function(app){
  return function expressInit(req, res, next){
    if (app.enabled('x-powered-by')) res.set('X-Powered-By', 'Express');
    req.res = res;
    res.req = req;
    req.next = next;
		
		util.merge(req, app.request);
		util.merge(res, app.response);
		
		res.locals = app.locals;
		res.render = app.render.bind(app);
    next();
  };
};


},{"./utils.js":9}],13:[function(_dereq_, module, exports){
/**
 * Module dependencies.
 */

var Router = _dereq_('./router');
var util = _dereq_('./utils.js');
var methods = _dereq_('./methods.js');
var View = _dereq_('./view.js');
var midware = _dereq_('./midware.js');

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
},{"./router":10,"./utils.js":9,"./methods.js":7,"./view.js":11,"./midware.js":12}],14:[function(_dereq_, module, exports){
module.exports = function(){
	var argvs = arguments;
	return function(req, res, next){
		var views = res.app.get('views');
		for ( var i = 0 ; i < argvs.length ; i++ ){
			var pather = argvs[i];
			if ( !/^\w:\\/.test(pather) ){ pather = path.server(pather); };
			if ( fs.exist(pather) ){ views = argvs[i]; };
		}
		res.app.set('views', views);
		next();
	}
}
},{}],15:[function(_dereq_, module, exports){
module.exports = function(){
	return function(req, res, next){
		parseSession(req, res);
		req.sessions = getSessions();
		next();
	}
}

function getSessions(){
	var contents = new Object();
	_.enumerate(Session.Contents, function(key){
		contents[key] = Session(key);
	});
	return contents;
}

function parseSession(req, res){
	res.session = function(key, value){
		if ( _.isObject(key) ){
			_.each(key, function(b, a){
				res.session(a, b);
			});
		}else{
			if ( !value ){
				return Session(key);
			}else{
				Session(key) = value;
				req.sessions = getSessions();
			}
		}
	}
	
	res.session.timeout = function(time){ // s
		Session.Timeout = time || 20;
	}
	
	res.session.end = function(){
		Session.Abandon();
	}
	
	res.session.remove = function(key){
		try{
			Session.Contents.Remove(key);
			req.sessions = getSessions();
		}catch(e){}
	}
	
	res.session.destory = function(){
		Session.Contents.RemoveAll();
		req.sessions = getSessions();
	}
	
	res.session.count = function(){
		return Session.Contents.Count;
	}
}
},{}],16:[function(_dereq_, module, exports){
module.exports = function(){
	return function(req, res, next){
		parseApplication(req, res);
		req.applications = getApplications();
		next();
	}
}

function getApplications(){
	var contents = new Object();
	_.enumerate(Application.Contents, function(key){
		contents[key] = Application(key);
	});
	return contents;
}

function parseApplication(req, res){
	res.application = function(key, value){
		if ( _.isObject(key) ){
			_.each(key, function(b, a){
				res.application(a, b);
			});
		}else{
			if ( !value ){
				return Application(key);
			}else{
				Application(key) = value;
				req.applications = getApplications();
			}
		}
	}
	
	res.application.lock = function(time){ // s
		Application.Lock();
	}
	
	res.application.unlock = function(){
		Application.Unlock();
	}
	
	res.application.remove = function(key){
		try{
			Application.Contents.Remove(key);
			req.applications = getApplications();
		}catch(e){}
	}
	
	res.application.destory = function(){
		Application.Contents.RemoveAll();
		req.applications = getApplications();
	}
	
	res.application.count = function(){
		return Application.Contents.Count;
	}
}
},{}],17:[function(_dereq_, module, exports){
var $ = _dereq_('cookie');

module.exports = function(){
	var cookie, httponly = false, exps, options = {};
	
	for ( var i = 0 ; i < arguments.length ; i++ ){
		if ( _.isBoolean(arguments[i]) ){
			httponly = arguments[i];
		}else if ( _.isString(arguments[i]) ){
			cookie = arguments[i];
		}else if ( _.isNumber(arguments[i]) ){
			exps = new Date(new Date().getTime() + arguments[i]);
		}else if ( _.isDate(arguments[i]) ){
			exps = arguments;
		}else if ( _.isObject(arguments[i]) ){
			options = arguments[i];
		}
	}
	
	var settings = options;
	
	if ( httponly )	settings.httponly = httponly;
	if ( exps ) settings.expires = exps;

	return function(req, res, next){
		setCookie(req, res, cookie, settings);
		getCookies(req, res, cookie);
		next();
	}
};


function getCookies(req, res, cookie){
	req.cookies = parseCookie(cookie) || {};
}

function parseCookie(cookie){
	if ( cookie ){
		var _cookie = $.cookie(cookie);
		if ( _cookie ){
			return _.fromQuery(_cookie);
		}else{
			return {};
		}
	}else{
		var ps = {};
		_.each($.cookie(), function(value, key){
			if ( value.indexOf('=') > -1 ){
				ps[key] = _.fromQuery(value);
			}else{
				ps[key] = value;
			};
		});
		return ps;
	};
}

function setCookie(req, res, cookie, settings){
	res.cookie = function(key, value){
		if ( _.isObject(key) ){
			_.each(key, function(b, a){
				res.cookie(a, b);
			})
		}else{
			if ( _.isUndefined(value) || _.isNull(value) ){
				return req.cookies[key];
			}else{
				value = String(value) || value;
				if ( value.length === 0 ){
					delete req.cookies[key];
				}else{
					req.cookies[key] = value;
				}
				
				if ( cookie ){
					$.cookie(cookie, _.toQuery(req.cookies), settings);
				}else{
					$.cookie(key, value, settings);
				}
			}
		}
	}
	
	res.cookie.remove = function(key){
		if ( !req.cookies[key] ) {
				return true;
		}
		
		var _exp = settings.expires;
		settings.expires = -1;
		res.cookie(key, '');
		if ( req.cookies[key] ){
			delete req.cookies[key];
		}
		settings.expires = _exp;
		
		return !req.cookies[key];
	}
	
	res.cookie.destory = function(key){
		$.removeCookie(key, settings);
		if ( req.cookies[key] ){
			delete req.cookies[key];
		}
	}
	
	
}
},{"cookie":3}],18:[function(_dereq_, module, exports){
// JavaScript Document
module.exports = function(){
	return function(req, res, next){
		req.body = req.formAll();
		next();
	}
};
},{}],19:[function(_dereq_, module, exports){
module.exports = function(options){
	if ( _.isUndefined(options) ){ options = {}; };
	if ( _.isString(options) ){ options = { jsonp: options }; };
	if ( _.isFunction(options) ){ options = { jsonpCallback: options }; };

	return function(req, res, next){
		var app = req.app;
		if ( _.isString(options.jsonp) ){ app.set('jsonp callback name', options.jsonp); };
		if ( _.isFunction(options.jsonpCallback) ){ app.set('json replacer JSON replacer', options.jsonpCallback); };
		var jsonpCallback = app.get('json replacer JSON replacer');
		var jsonp = app.get('jsonp callback name');

		if ( _.isString(jsonp) && _.isFunction(jsonpCallback) ){
			jsonp = jsonpCallback(jsonp);
		}
		
		jsonp = req.query[jsonp];
		
		if ( jsonp ){
			res.handles.push(function(req, res){
				res.set('Content-Type', 'application/json; Charset=utf-8');
				return jsonp + '(' + JSON.stringify(res._jsons) + ')';
			});
		};
		next();
	};
};
},{}],20:[function(_dereq_, module, exports){
/**
 * Module dependencies.
 */
var req = _dereq_('./request.js');
var res = _dereq_('./response.js');
var proto = _dereq_('./application.js');
var util = _dereq_('./utils.js');

/**
 * Expose `createApplication()`.
 */
exports = module.exports = createApplication;

/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */
function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };
	
	app.request = req;
	app.response = res;	
	app.request.app = app.response.app = app;

  util.merge(app, proto);
	app.init();
	req.path = app.parseURL(req);
  
  return app;
}

/**
 * Expose the prototypes.
 */

exports.application = proto;
exports.request = req;
exports.response = res;

/**
 * mixin middlewares.
 */
createApplication.template = _dereq_('./middlewares/template.js');
createApplication.sessionParse = _dereq_('./middlewares/sessionParse.js');
createApplication.applicationParse = _dereq_('./middlewares/applicationParse.js');
createApplication.cookieParse = _dereq_('./middlewares/cookieParse.js');
createApplication.bodyParse = _dereq_('./middlewares/bodyParse.js');
createApplication.jsonpParse = _dereq_('./middlewares/jsonpParse.js');

/*var middlewares = ['template', 'sessionParse', 'applicationParse', 'cookieParse', 'bodyParse', 'jsonpParse'];

_.each(middlewares, function(ware){
	createApplication[ware] = function(){
		var middleware = require('./middlewares/' + ware + '.js');
		if ( _.isFunction(middleware) ){
			return middleware.apply(null, arguments);
		}
	}
});*/
},{"./request.js":2,"./response.js":4,"./application.js":13,"./utils.js":9,"./middlewares/template.js":14,"./middlewares/sessionParse.js":15,"./middlewares/applicationParse.js":16,"./middlewares/cookieParse.js":17,"./middlewares/bodyParse.js":18,"./middlewares/jsonpParse.js":19}],21:[function(_dereq_, module, exports){
module.exports = _dereq_('./lib/express.js');
},{"./lib/express.js":20}]}
		,{},[21])(21)
});