/**
 * Module dependencies.
 */
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var utils = require('./utils');
var query = require('./query');

var dbo = module.exports = function(connect){
	EventEmitter.call(this);
	this.connect = connect;
	this.dbo = new ActiveXObject('ADODB.RECORDSET');
}

util.inherits(dbo, EventEmitter);

dbo.prototype.insert = function(table, datas){
	this.dbo.open('SELECT * FROM ' + table, this.connect, 1, 2);
	
	var that = this;
	var insert = function(data){
		try{
			that.emit('DBO_INSERT_PENDING', data);
			that.dbo.AddNew();
			that.emit('DBO_INSERT_ADDNEW', that);
			_.each(data, function( value, key ){ 
				that.dbo(key) = value; 
			});
			that.dbo.Update();
			that.emit('DBO_INSERT_RESOLVE', that);
		}catch(e){
			that.emit('DBO_INSERT_REJECT', e);
		}
	};
	_.each(_.isArray(datas) ? datas : [datas], insert);
	
	return this;
}

dbo.prototype.update = function(sql, datas){
	this.dbo.open(sql, this.connect, 1, 3);

	var that = this;
	var update = function(obj, data){
		try{
			that.emit('DBO_UPDATE_PENDING', data);
			_.each(data, function( value, key ){ 
				obj(key) = value; 
			});
			obj.Update();
			that.emit('DBO_UPDATE_RESOLVE', that);
		}catch(e){
			that.emit('DBO_UPDATE_REJECT', e);
		}
	};
	
	var count = this.dbo.RecordCount;
	
	if ( count > 1 ){
		utils.each(this.dbo, function(obj){
			update(obj, _.clone(datas));
		});
	}
	else if ( count === 1 ){
		update(this.dbo, _.clone(datas));
	}
	
	return this;
}

dbo.prototype.close = function(){
	this.dbo.close();
}

dbo.prototype.query = function(sql, type){
	this.dbo.open(sql, this.connect, 1, type ? type : 1);
	return new query(this.dbo);
}