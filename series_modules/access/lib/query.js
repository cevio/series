/**
 * Module dependencies.
 */
var utils = require('./utils');

var SqlQuery = module.exports = function(dbo){
	this.dbo = dbo;
}

SqlQuery.prototype.exist = function(){
	return !this.dbo.Bof && !this.dbo.Eof;
}

SqlQuery.prototype.each = function(fn){
	if ( this.exist() ){
		utils.each(this.dbo, fn, this);
	}
	return this;
}

SqlQuery.prototype.map = function(fn){
	var maps = [];
	this.each(function(obj){
		maps.push(fn.call(this, obj));
	});
	return maps;
}

SqlQuery.prototype.filter = function(fn){
	var maps = [];
	this.each(function(obj){
		var r = fn.call(this, obj);
		r && maps.push(r);
	});
	return maps;
}

SqlQuery.prototype.toJSON = function(){
	return this.map(function(object){
		var json = {};
		for ( var i = 0; i < object.fields.count ; i++ ) {
			json[object.fields(i).name] = object.fields(i).value;
		}
		return json;
	});
}

SqlQuery.prototype.toArray = function(){
	var dbo = this.dbo
		,	tempArr = dbo.GetRows().toArray(); 
			
	return getRows(tempArr, dbo.Fields.Count);
}

SqlQuery.prototype.close = function(){
	this.dbo.close();
}

SqlQuery.prototype.use = function(cb){
	if ( _.isFunction(cb) ){
		cb.call(this, this.dbo);
	}
}

function getRows( arr, fieldslen ){
	var len = arr.length / fieldslen, data=[], sp; 

	for( var i = 0; i < len ; i++ ) { 
		data[i] = new Array(); 
		sp = i * fieldslen; 
		for( var j = 0 ; j < fieldslen ; j++ ) { data[i][j] = arr[sp + j] ; } 
	}

	return data; 
}