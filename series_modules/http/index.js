/**
 * modules deps.
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var url = require('url');
var Url = url.Url;
var dataType = require('./data-type');

/**
 * Client Module.
 * ajax 对象原型
 */
var client = module.exports = function(){
	EventEmitter.call(this);
}

// 继承事件绑定
util.inherits(client, EventEmitter);

// 主方法
client.prototype.send = function(options, callback){
	options = _.extend(new Url(), options || {});
	if ( options.xhr ){
		this.xhr = options.xhr;
	}else{
		this.xhr = new ActiveXObject("Microsoft.XMLHTTP");
	};
	
	if ( /^get$/i.test(options.method) && _.isObject(options.data) ){
		var param = _.toQuery(options.data);
		if ( param ){
			options.search = options.search.indexOf('?') > -1 ? options.search + '&' + param : options.search + '?' + param;
			options.data = null;
		}
	};

	options.href = url.format(options);

	var timer = new Date().getTime()
		,	xhr = this.xhr
		,	that = this
		,	res;

	try{
		xhr.open( options.method.toUpperCase(), options.href, false );
		if ( options.method.toUpperCase() === 'POST' ) 
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		_.each(options.headers, function(value, key){
			xhr.setRequestHeader(key, value);
		});
		xhr.onreadystatechange = function(){
			if ( new Date().getTime() - timer >= (options.timeout || 3 * 60 * 1000) ){
				that.emit('timeout', xhr);
				xhr.abort();
			};
			if ( xhr.readyState === 4 && xhr.status == 200 ){
				res = new dataType(xhr, options.href);
				_.isFunction(callback) && callback(res);
			}
		}
		
		if ( options.method.toUpperCase() === 'POST' ){
			xhr.send(options.data);
		}
		else{
			xhr.send(null);
		};
		
		if ( xhr.readyState === 4 && xhr.status == 200 ){
			res && res.listen();
		}else{
			this.emit('error', { message: 'xmlhttp catch error.', statusCode: xhr.status });
		}
	}catch(e){
		this.emit('error', e);
	}
}

var methods = ["get","post","put","head","delete","options","trace","copy","lock","mkcol","move","purge","propfind","proppatch","unlock","report","mkactivity","checkout","merge","m-search","notify","subscribe","unsubscribe","patch","search","connect"];

_.each(methods, function(name){
	client[name] = function(options, callback){
		var http = new client();
		if (_.isString(options)){
			options = url.parse(options);
		}
		else{
			options = util._extend({}, options);
		}
		options.method = name.toUpperCase();
		http.send(options, callback);
	}
});