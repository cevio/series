// JavaScript Document

var access = module.exports = function(mdb, username, password){
	return function(req, res, next){
		var msAccess = new access.connect(mdb, username, password);
		msAccess.connect();
		if ( msAccess.status ){
			res.handles.push(function(){ msAccess.destory(); });
			res.connect = {};
			res.connect.conn = msAccess.object;
			res.connect.conc = msAccess;
			res.connect.dbo = access.dbo;
			res.connect.query = access.query;
			AccessBinditions(req, res);
			next();
		}else{
			res.log('database connect error');
		}
	}
}

access.dbo = require('./lib/dbo');
access.connect = require('./lib/connect');
access.query = require('./lib/query');

function AccessBinditions(req, res){
	res.connect.carry = function(fn){
		if ( _.isFunction(fn) ){
			return fn.call(res.connect.conc, res.connect.conn);
		}
	}
	res.connect.insert = function(){
		var acc = new access.dbo(res.connect.conn);
		acc.insert.apply(acc, arguments);
		acc.close();
	}
	res.connect.update = function(){
		var acc = new access.dbo(res.connect.conn);
		acc.update.apply(acc, arguments);
		acc.close();
	}
	res.connect.querys = function(){
		var acc = new access.dbo(res.connect.conn);
		return acc.query.apply(acc, arguments);
	}
	res.connect.use = function(){
		var acc = new access.dbo(res.connect.conn);
		var arg1 = Array.prototype.slice.call(arguments, 0, -1);
		var arg2 = Array.prototype.slice.call(arguments, -1);
		var _query = acc.query.apply(acc, arg1);
		var ret = _query.use.apply(_query, arg2);
		acc.close();
		return ret;
	}
}