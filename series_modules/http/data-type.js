// JavaScript Document

var utils = require('./utils');
var util = require('util');
var remote = require('./remote-module');
var EventEmitter = require('events').EventEmitter;

var mod = module.exports = function(xhr, href){
	EventEmitter.call(this);
	this.statusCode = xhr.status;
	this.href = href;
	this.xhr = xhr;
}

// 继承事件绑定
util.inherits(mod, EventEmitter);

mod.prototype.listen = function(){
	this.emit('data', new builder(this.xhr.responseBody, this.href));
	this.emit('end');
}

var builder = function(buffer, href){
	this.buffer = buffer;
	this.href = href;
}

builder.prototype.toString = function(charset){
	return utils.b2s(this.buffer, charset);
}

builder.prototype.toHTML = function(charset){
	return utils.b2s(this.buffer, charset);
}

builder.prototype.toBinary = function(){
	return this.buffer;
}

builder.prototype.toJSON = function(charset){
	return JSON.parse(utils.b2s(this.buffer, charset));
}

builder.prototype.toXML = function(charset){
	return require('xml').load(utils.b2s(this.buffer, charset));
}

builder.prototype.toScript = function(charset){
	return remote(this.href, utils.b2s(this.buffer, charset));
}