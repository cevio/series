
// ajax module
// ----------------------------------

var 
	ajax = module.exports = new Class(function(){
		this.ajaxResponseCompileError(function(e, object, context){
			throw new Error('ajaxResponseCompileError: ' + e.message);
		});
	}),
	ResponseDataTypes = {},
	ajaxModules = {};
	
ajax.instance(event).extend(event);
ajax.property('object', new ActiveXObject("Microsoft.XMLHTTP"));

var scriptModule = function(dir){
	this.dirname = dir;
}

scriptModule.prototype.resolve = function(pather){
	return path.resolve(this.dirname, pather).replace(/\\/g, '/');
}

scriptModule.prototype.require = function(pather){
	pather = this.resolve(pather);
	if ( ajaxModules[pather] ){
		return ajaxModules[pather];
	}
	var inquire = (new script(pather));
	return inquire.main;
}

var script = function(text, url){
	this.filename = url;
	this.dirname = path.dirname(url.replace(/\#.+/, '').replace(/\?.+/, '')).replace(/\\/g, '/');
	this.text = text;
	
	this.handle();
}

script.prototype.handle = function(){
	var series = new scriptModule(this.dirname);
	var exports = series.exports = {};
	var _require = series.require.bind(series);
	_require.resolve = series.resolve.bind(series);
	
	var methods = ['exports', 'require', 'module', '__filename', '__dirname'];
	var wrapper = ['return function (' + methods.join(',') + '){', this.text, '};'].join("\n");
	var bag = (new Function(wrapper))();
	
	bag(exports, _require, series, this.filename, this.dirname);
	ajaxModules[this.filename] = series.exports;
	
	this.main = series.exports;
}

function toURLQueryString(keyCode){
	if ( _.isUndefined(keyCode) || _.isNull(keyCode) || keyCode === false || keyCode === 0 || keyCode === '' ){
		return null;
	};
	
	if ( typeof keyCode === "object" ){
		var ret = [], i;

		for ( i in keyCode ){
			ret.push(i + "=" + keyCode[i]);
		}

		return ret.join("&");
	}else{
		return keyCode;
	}
};

function modifyDataResponse(object, type, charset, url){
	return _.isFunction(ResponseDataTypes[type]) ? ResponseDataTypes[type].call(ResponseDataTypes, object, charset, url) : null;
};

function BinaryToString(text, charset){
	var obj = new ActiveXObject("Adodb.Stream"), 
		ret;
		obj.Type = 1;
		obj.Mode = 3;
		obj.Open;
		obj.Write(text);
		obj.Position = 0;
		obj.Type = 2;
		obj.Charset = charset;
		ret = obj.ReadText;
		obj.Close;

	return ret;
}

ResponseDataTypes.html = ResponseDataTypes.text = function(object, charset){
	return BinaryToString(object.responseBody, charset);
};

ResponseDataTypes.json = function(object, charset){
	return JSON.parse(BinaryToString(object.responseBody, charset));
};

ResponseDataTypes.binary = function(object, charset){
	return object.responseBody;
};
ResponseDataTypes.xml = function(object, charset){
	var text = BinaryToString(object.responseBody, charset)
		,	xml = require('xml')
		, $;
		
	try{ $ = xml.load(text);}catch(e){};
	
	return $;
}

ResponseDataTypes.script = function(object, charset, url){
	var code = BinaryToString(object.responseBody, charset);
	return (new script(code, url)).main;
};

ajax.property('defaults', {
	type: 'GET',
	accepts: null,
	data: null,
	dataType: 'text', // text xml html json binary script
	url: '',
	scriptCharset: Response.Charset || 'utf-8',
	async: false,
	success: null,
	error: null,
	complete: null,
	beforeSend: null,
	statusCode: {},
	cache: true,
	contents: null,
	contentType: null,
	contents: {}, // undo
	context: null,
	converters: '{"* text": window.String, "text html": true, "text json": JSON.parse, "text xml": JSON.parseXML}', // undo
	global: true,
	headers: {},
	timeout: 60 * 1000,
	xhr: null
});

ajax.define('main', function(options){
	var 
		that = this,
		object = this['private']('object'),
		defaults = _.clone(this['private']('defaults')),
		context = object,
		timer = new Date().getTime(),
		ResponseData = null;
	
	options = _.extend(defaults, options);

	if ( options.dataType === 'script' && options.type === 'GET' && ajaxModules[options.url] ){
		return ajaxModules[options.url];
	}
	
	
	if ( options.xhr ){
		object = options.xhr;
	};
	
	if ( /^get$/i.test(options.type) && options.data ){
		var param = toURLQueryString(options.data);
		if ( param !== null && param.length > 0 ){
			options.url = options.url.indexOf('?') > -1 ? options.url + '&' + param : options.url + '?' + param;
			options.data = null;
		}
	};
	
	if ( options.context ){
		context = options.context;
	};

	object.open( options.type.toUpperCase(), options.url, options.async );

	_.each(options.headers, function(value, key){
		object.setRequestHeader(key, value);
	});
	
	if ( options.type.toUpperCase() === 'POST' ){
		object.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}else{
		if ( options.contentType ){
			object.setRequestHeader("Content-Type", options.contentType);
		};
	}
	
	if ( options.accepts && options.accepts.length > 0 ){
		object.setRequestHeader("Accept", options.accepts);
	};
	
	if ( options.cache === false ){
		object.setRequestHeader("Cache-Control", "no-cache, must-revalidate");
	}else{
		object.setRequestHeader("Cache-Control", "max-age=30");
	};

	object.onreadystatechange = function() {
		if ( options.global ){
			try{that.emit('ajaxSend', object, object.status)}catch(e){}
		}
		
		if ( options.statusCode && options.statusCode.length ){
			_.each(options.statusCode, function(fn, code){
				if ( Number(code) === object.status ){
					_.isFunction(fn) && fn.call(context, object);
				}
			});
		}
		
		if ( new Date().getTime() - timer >= options.timeout ){
			if ( options.global ){
				try{that.emit('ajaxStop', object, context);}catch(e){}
			}
			object.abort();
		};
		
		if (object.readyState === 4) {
			if (object.status === 200){
				try{
					ResponseData = modifyDataResponse(object, options.dataType, options.scriptCharset, options.url);
				}catch(e){ 
					if ( options.global ){
						try{
							that.emit('ajaxResponseCompileError', e, object, context)
						}catch(e){}
					}
				}
				
			 	if ( options.global ){
				 	try{
						that.emit('ajaxSuccess', ResponseData, object, context)
					}catch(e){}
				}
				
				if ( _.isFunction(options.success) ){
					options.success.call(context, ResponseData, object);
				};
			}
		}
	};
	
	options.global && this.emit('ajaxStart', object, context);
	_.isFunction(options.beforeSend) && options.beforeSend.call(context, object);
	
	if ( options.type.toUpperCase() === 'POST' ){
		object.send(toURLQueryString(options.data));
	}else{
		object.send(null);
	};
	
	if ( object.status !== 200 && _.isFunction(options.error) ){
		options.global && this.emit('ajaxError', object, object.status);
		options.error.call(context, object, object.status);
	};
	
	options.global && this.emit('ajaxComplete', ResponseData, object, context);
	_.isFunction(options.complete) && options.complete.call(context, object);

	return ResponseData;
});

_.each(['ajaxComplete', 'ajaxError', 'ajaxSend', 'ajaxStart', 'ajaxStop', 'ajaxSuccess', 'ajaxResponseCompileError'], function( name ){
	ajax.define(name, function( fn ){
		this.one(name, fn);
	});
});

ajax.define('ajaxSetup', function(options){
	var defaults = _.clone(this['private']('defaults'));
	options = _.extend(defaults, options);
	this.property('defaults', options);
});

var methods = {
	get: ['GET', 'text'],
	getJSON: ['GET', 'json'],
	getScript: ['GET', 'script'],
	getBinary: ['GET', 'binary'],
	post: ['POST', 'text'],
	postJSON: ['POST', 'json'],
	postScript: ['POST', 'script'],
	postBinary: ['POST', 'binary']
};

_.each(methods, function(arr, name){
	ajax.define(name, function(){
		var url, data, callback;
		_.each(arguments, function(arg){
			if ( _.isString(arg) ){ url = arg; }
			else if ( _.isFunction(arg) ){ callback = arg; }
			else{ data = arg; }
		});
		
		var defaults = { url: url, type: arr[0], dataType: arr[1] };
		
		if ( data ) defaults.data = data;
		if ( callback ) defaults.success = callback;
		
		return this.main(defaults);
	});
});