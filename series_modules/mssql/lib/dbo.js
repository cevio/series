
// dbo module
// ----------------------
var 
	transaction = require('./transation.js'),
	query = require('./query.js'),
	MsSql = module.exports = new Class(function( connect ){
		this.property('connect', connect);
	});

MsSql.property('dbo', new ActiveXObject('ADODB.RECORDSET'));
MsSql.instance(event).extend(event);

MsSql.define('insert', function(table, datas, callback){
	var 
		that = this,
		dbo = this['private']('dbo'),
		connect = this['private']('connect'),
		values = [];
		
	dbo.open('SELECT * FROM ' + table, connect, 1, 2);
	
	var insert = function(data){
		dbo.AddNew();
		_.each(data, function( value, key ){ dbo(key) = value; });
		dbo.Update();
		
		if ( _.isFunction(callback) ){
			var value = callback.call(that, dbo, connect);
			if ( !_.isUndefined(value) ){
				values.push(value);
			}
		}
	};
	
	if ( _.isArray(datas) ){
		_.each(datas, function(data){
			insert(data);
		});
	}else{
		insert(datas);
	}
	
	if ( values.length === 1 ){
		return values[0];
	}else if ( values.length > 1 ){
		return values;
	}
});

MsSql.define('update', function(table, factor, data, callback){
	var 
		that = this,
		dbo = this['private']('dbo'),
		connect = this['private']('connect'),
		values = [];
		
	var sql = 'SELECT * FROM ' + table;
	
	if ( !_.isNull(factor) ){
		sql += ' WHERE ' + factor;
	};
	
	dbo.open('SELECT * FROM ' + table, connect, 2, 3);
	
	var count = dbo.RecordCount;
	
	if ( count > 0 ){
		if ( count > 1 ){
			dbo.MoveFirst();
			while ( !dbo.Eof ){
				if ( _.isFunction(callback) ){
					var value = callback.call(that, dbo, connect);
					if ( !_.isUndefined(value) ){
						values.push(value);
					}
				}
				_.each(data, function( value, key ){ dbo(key) = value; });
				dbo.Update();
				dbo.MoveNext();
			}
		}else{
			if ( _.isFunction(callback) ){
				var value = callback.call(that, dbo, connect);
				if ( !_.isUndefined(value) ){
					values.push(value);
				}
			}
			_.each(data, function( value, key ){ dbo(key) = value; });
			dbo.Update();
		}
	};
	
	if ( values.length === 1 ){
		return values[0];
	}else if ( values.length > 1 ){
		return values;
	}
});

MsSql.define('remove', function(table, factor, callback){
	var 
		that = this,
		dbo = this['private']('dbo'),
		connect = this['private']('connect'),
		values = [];
		
	var sql = 'SELECT * FROM ' + table;
	
	if ( !_.isNull(factor) ){
		sql += ' WHERE ' + factor;
	};
	
	dbo.open('SELECT * FROM ' + table, connect, 2, 3);
	
	var count = dbo.RecordCount;
	
	if ( count > 0 ){
		if ( count > 1 ){
			dbo.MoveFirst();
			while ( !dbo.Eof ){
				if ( _.isFunction(callback) ){
					var value = callback.call(that, dbo, connect);
					if ( !_.isUndefined(value) ){
						values.push(value);
					}
				};
				dbo.Delete();
				dbo.MoveNext();
			}
		}else{
			if ( _.isFunction(callback) ){
				var value = callback.call(that, dbo, connect);
				if ( !_.isUndefined(value) ){
					values.push(value);
				}
			};
			dbo.Delete();
		}
	};
	
	if ( values.length === 1 ){
		return values[0];
	}else if ( values.length > 1 ){
		return values;
	}
});

MsSql.define('destory', function(){
	this['private']('dbo').close();
});

MsSql.define('transaction', function(){
	return new transaction(this);
});

MsSql.define('query', function(sql, type){
	return new query(this, sql, type);
});