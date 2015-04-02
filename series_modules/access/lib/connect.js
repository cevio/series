/**
 * Module dependencies.
 */
var util = require('util');
var EventEmitter = require('events').EventEmitter;

/**
 * Access Connection.
 */
var connect = module.exports = function(mdb, username, password){
	EventEmitter.call(this);
	this.status = false;
	this.object = null;
	this.toString(mdb, username, password);
}

util.inherits(connect, EventEmitter);

connect.prototype.toString = function(mdb, username, password){
	var sql = ['Provider=Microsoft.Jet.OLEDB.4.0'];
	sql.push('Data Source=' + mdb);
	if ( username ){ sql.push('User Id=' + username); }
	if ( password ){ sql.push('PASSWORD=' + password); }
	this.str = sql.join(';') + ';';
}

connect.prototype.connect = function(){
	if ( !this.str ) throw new Error('you need sql setup.');
	
	var timer = new Date().getTime();
	
	try{
		var conn = new ActiveXObject('Adodb.Connection');
		conn.open(this.str);
		this.object = conn;
		this.status = true;
		this.emit('success', new Date().getTime() - timer);
	}
	catch(e){
		this.emit('error', e);
	}
	
	return this;
}

connect.prototype.destory = function(){
	if ( this.status ){
		this.object.close();
		delete this.object;
		this.status = false;
	}
}

connect.prototype.exec = function(sql){
	return this.object.Execute(sql);
}