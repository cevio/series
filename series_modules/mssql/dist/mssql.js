!(function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        var f;
        "undefined" != typeof window ? f = window: "undefined" != typeof global ? f = global: "undefined" != typeof self && (f = self),
        f['mssql'] = e()
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
    })({1:[function(_dereq_, module, exports){

// mssql.main module
// -------------------------------

var MsSql = module.exports = new Class();

MsSql
	.property('connection', new ActiveXObject('ADODB.CONNECTION'))
	.property('connectionconfig', {database: 'mssql', serverip: '127.0.0.1', username: '', password: ''});
	
MsSql.property('tryConnect', function(){
	var connectionconfig = this.connectionconfig,
		connection = this.connection,
		sqlArray = [],
		connectStatus = false;
	
	sqlArray.push([
		"Provider=sqloledb",
		"Data Source=" + 		connectionconfig.serverip,
		"Initial Catalog=" + 	connectionconfig.database,
		"User Id=" + 			connectionconfig.username,
		"Password=" + 			connectionconfig.password,
		""
	].join(";"));

	sqlArray.push([
		"Driver={SQL Server}",
		"Server=" + 			connectionconfig.serverip,
		"Database=" + 			connectionconfig.database,
		"Uid=" + 				connectionconfig.username,
		"Pwd=" + 				connectionconfig.password,
		""
	].join(";"));

	for ( var i = 0 ; i < sqlArray.length; i++ ){
		try{
			connection.open(sqlArray[i]);
			connectStatus = true;
			break;
		}catch(e){}
	};
	
	return { status: connectStatus, object: connection, cmd: connectionconfig };
});

MsSql.instance(event).extend(event);

MsSql.define('setup', function( options ){
	return this.property('connectionconfig', _.extend(_.clone(this['private']('connectionconfig')), options));
});

MsSql.define('listen', function(){
	var timer = new Date().getTime();
	var connect = this['private']('tryConnect')();
	var reduceTime = new Date().getTime() - timer;
	if ( connect.status ){ this.emit('connect.success', connect.object, reduceTime); }
	else{ this.emit('connect.error', connect.object, reduceTime, connect.cmd); };
	return this;
});

MsSql.define('destory', function(){
	var connect = this['private']('connection');
	this.emit('connect.destory', connect);
	try{ connect.Close(); }catch(e){}
});
},{}],2:[function(_dereq_, module, exports){

// trasaction module
// ------------------------------------
var Transation = module.exports = new Class(function(context){
	context['private']('connect').BeginTrans();
	this.property('context', context);
});

Transation.property('tasker', Promise.resolve());
Transation.instance(event).extend(event);

Transation.define('task', function(handler, rollback){
	var 
		context = this['private']('context'),
		tasker = this['private']('tasker'),
		dbo = this['private']('dbo'),
		connect = this['private']('connect');
		
	this.property('tasker', tasker.then(function(value){
		return new Promise(function(resolve, reject){
			try{
				if ( _.isFunction(handler) ){
					handler(resolve, reject, value);
				}else{
					resolve(value);
				}
			}catch(e){
				if ( _.isFunction(rollback) ){
					reject(rollback(e, value));
				}else{
					reject(e);
				};
			}
		});
	}));
	
	return this;
});

Transation.define('stop', function(){
	var that = this;
		
	this['private']('tasker').then(function(value){
		that['private']('context')['private']('connect').CommitTrans();
		that.emit('task.success', value);
	})['catch'](function(value){
		that['private']('context')['private']('connect').RollbackTrans();
		that.emit('task.error', value);
	});
});
},{}],3:[function(_dereq_, module, exports){

// query module
// -------------------------------
var query = module.exports = new Class(function(context, sql, type){
	var 
		dbo = context['private']('dbo'),
		connect = context['private']('connect');
	
	this.property('context', context);
	this.property('dbo', dbo);
	this.property('connect', connect);
	
	_.isString(sql) && dbo.Open(sql, connect, 1, type ? type : 1);
});

query.define('each', function(callback){
	var 
		that = this,
		dbo = this['private']('dbo'),
		i = 0,
		values = [];
		
	dbo.MoveFirst();
	while ( !dbo.Eof )
	{
		if ( _.isFunction(callback) ){
			var value = callback.call(that, dbo, i);
			if ( !_.isUndefined(value) ){
				values.push(value);
			}
		};
		i++;
		dbo.MoveNext();
	};
	
	return values;
});

query.define('toJSON', function(){
	return this.each(function(object, i){
		var json = {};
		for ( var i = 0; i < object.fields.count ; i++ ) {
			json[object.fields(i).name] = object.fields(i).value;
		}
		return json;
	});
});

query.define('toArray', function(){
	try{ 
		var 
			dbo = this['private']('dbo'),
			tempArr = dbo.GetRows().toArray(); 
			
		return getRows(tempArr, dbo.Fields.Count);
	}catch(e){
		if ( process.env.SERIES_ENV === 'development' ){
			throw new Error('Series plugin module [mssql.query] Error: ' + e.message);
		};
		return [];
	}
});

query.define('exec', function(callback){
	var dbo = this['private']('dbo');
	if ( dbo.RecordCount > 1 ){
		return this.each(callback);
	}else{
		if ( _.isFunction(callback) ){
			var value = callback.call(this, dbo, 0);
			if ( !_.isUndefined(value) ){
				return value;
			}
		};
	}
});

function getRows( arr, fieldslen ){
	var len = arr.length / fieldslen, data=[], sp; 

	for( var i = 0; i < len ; i++ ) { 
		data[i] = new Array(); 
		sp = i * fieldslen; 
		for( var j = 0 ; j < fieldslen ; j++ ) { data[i][j] = arr[sp + j] ; } 
	}

	return data; 
}
},{}],4:[function(_dereq_, module, exports){

// dbo module
// ----------------------
var 
	transaction = _dereq_('./transation.js'),
	query = _dereq_('./query.js'),
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
},{"./transation.js":2,"./query.js":3}],5:[function(_dereq_, module, exports){

// dbo.StoredProcedures module
// -----------------------------------
var query = _dereq_('./query.js');
var StoredProcedures = module.exports = new Class(function(command, connect){
	this.property('connect', connect);
	this.property('command', command);
	this['private']('cmd').ActiveConnection = connect;
	this['private']('cmd').CommandType = StoredProcedures.CommandType.STOREDPROC;
	this['private']('cmd').Prepared = true;
});

StoredProcedures.property('cmd', new ActiveXObject("Adodb.Command"));
StoredProcedures.property('params', {});
StoredProcedures.property('dbo', null);
StoredProcedures.property('geted', false);

StoredProcedures.define('addParm', function( name, value, direction ){
	var 
		params = this['private']('params'),
		cmd = this['private']('cmd');
		
	params[name] = cmd.CreateParameter(name);
	params[name].Value = value || null;
	params[name].Direction = direction || 1;
	
	return this;
});

StoredProcedures.define('addInput', function( name, value, t, size ){
	this['private']('params')[name] = this['private']('cmd').CreateParameter(name, t, StoredProcedures.ParameterDirection.INPUT, size, value);
	return this;
});

StoredProcedures.define('addInputInt', function( name, value ){
	return this.addInput(name, value, StoredProcedures.DataType.DBTYPE_I4, 4);
});

StoredProcedures.define('addInputBigInt', function( name, value ){
	return this.addInput(name, value, StoredProcedures.DataType.DBTYPE_I8, 8);
});

StoredProcedures.define('addInputVarchar', function( name, value, size ){
	return this.addInput(name, value, StoredProcedures.DataType.VARCHAR, size || 50);
});

StoredProcedures.define('addOutput', function( name, t, size ){
	this['private']('params')[name] = this['private']('cmd').CreateParameter(name, t, StoredProcedures.ParameterDirection.OUTPUT, size);
	return this;
});

StoredProcedures.define('addOutputInt', function( name ){
	return this.addOutput(name, StoredProcedures.DataType.DBTYPE_I4, 4);
});

StoredProcedures.define('addOutputBigInt', function( name ){
	return this.addOutput(name, StoredProcedures.DataType.DBTYPE_I8, 8);
});

StoredProcedures.define('addOutputVarchar', function( name, size ){
	return this.addOutput(name, StoredProcedures.DataType.VARCHAR, size || 50);
});

StoredProcedures.define('addReturn', function( name, t, size ){
	this['private']('params')[name] = this['private']('cmd').CreateParameter(name, t, StoredProcedures.ParameterDirection.RETURNVALUE, size);
	return this;
});

StoredProcedures.define('create', function(){
	var 
		cmd = this['private']('cmd'),
		params = this['private']('params');
	
	cmd.CommandText = this['private']('command');
	
	for( var i in params ){
		if( !params.hasOwnProperty(i) ) continue;
		cmd.Parameters.Append( params[i] );
	}
	
	this.property('dbo', cmd.execute());
	
	return new query(this);
});

StoredProcedures.define('destory', function(){
	this.provate('dbo').Close();
});

StoredProcedures.define('get', function(name){
	var 
		geted = this['private']('geted'),
		params = this['private']('params'),
		cmd = this['private']('cmd');
		
	if ( !geted ){
		for ( var i in params ){
			if( !params.hasOwnProperty(i) ) continue;
			if( params[i].Direction > 1 ){
				params[i].value = cmd(i).value;
			}
		}
		this.property('geted', true);
	};
	
	if( !params.hasOwnProperty(name) ) return null;
	return params[name];
});

// 静态数据配置
StoredProcedures.ParameterDirection = { INPUT:1,INPUTOUTPUT:3,OUTPUT:2,RETURNVALUE:4 };
StoredProcedures.DataType = {
	ARRAY:0x2000,DBTYPE_I8:20,DBTYPE_BYTES:128,DBTYPE_BOOL:11,DBTYPE_BSTR:8,DBTYPE_HCHAPTER:136,DBTYPE_STR:129,DBTYPE_CY:6,DBTYPE_DATE:7,DBTYPE_DBDATE:133,
	DBTYPE_DBTIME:134,DBTYPE_DBTIMESTAMP:135,DBTYPE_DECIMAL:14,DBTYPE_R8:5,DBTYPE_EMPTY:0,DBTYPE_ERROR:10,DBTYPE_FILETIME:64,DBTYPE_GUID:72,DBTYPE_IDISPATCH:9,
	DBTYPE_I4:3,DBTYPE_IUNKNOWN:13,LONGVARBINARY:205,LONGVARCHAR:201,LONGVARWCHAR:203,DBTYPE_NUMERIC:131,DBTYPE_PROP_VARIANT:138,DBTYPE_R4:4,DBTYPE_I2:2,DBTYPE_I1:16,
	DBTYPE_UI8:21,DBTYPE_UI4:19,DBTYPE_UI2:18,DBTYPE_UI1:17,DBTYPE_UDT:132,VARBINARY:204,VARCHAR:200,DBTYPE_VARIANT:12,VARNUMERIC:139,VARWCHAR:202,DBTYPE_WSTR:130
};
StoredProcedures.CommandType = {
	UNSPECIFIED:-1,TEXT:1,TABLE:2,STOREDPROC:4,UNKNOWN:8,FILE:256,TABLEDIRECT:512
};

/*
 * 调用方法实例：
var c = new MsSql.StoredProcedures('P_viewPage', connect);
var z = c
		.addInputVarchar('@TableName', 'evio')
		.addInputVarchar('@FieldList', '*')
		.addInputVarchar('@PrimaryKey', 'id')
		.addInputVarchar('@Where', 'id>10')
		.addInputVarchar('@Order', 'id asc')
		.addInputInt('@SortType', 1)
		.addInputInt('@RecorderCount', 0)
		.addInputInt('@PageSize', 10)
		.addInputInt('@PageIndex', 2)
		.addOutputInt('@TotalCount')
		.addOutputInt('@TotalPageCount')
		.create();
		
z.toJSON();
z.each(callback);
z.toArray();
z.exec(callback)
		
console.log(c.get('@TotalCount'))
console.json(z);
*/
},{"./query.js":3}],6:[function(_dereq_, module, exports){

/*
 * MsSql Database Helper
 * Author evio
 * You can download or review documents online.
 * http://series.webkits.cn/modules/mssql
 */

// -------------------------------------------

/*	// use it to carry fn.
 *	app.use(require('./modals/middlewares/connect.js')(options));
 *	app.get('/', function(req, res){
 *		res.connect.carry(function(conn, dbo, spc){
 *			var t = new dbo(conn);
 *			var query = t.query(sql);
 *			query.toArray();
 *		});
 *	});
 */

var mssql = _dereq_('./lib/connect.js')
	,	dbo = _dereq_('./lib/dbo.js')
	,	spc = _dereq_('./lib/StoredProcedures.js')
	,	connect = new mssql();

// 返回中间件	
var proto = exports = module.exports = function(config){
	return function(req, res, next){
		if ( proto.object && res.connect ){
			next();
		}else{
			if ( proto.handle(req, res, config) ){
				next();
			}
		}
	}
}

// extend proto to exports
proto.dbo = dbo; proto.spc = spc; proto.msc = mssql;

// main entrence
proto.handle = function(req, res, config){
	var status = false;

	connect.setup(config);
	connect.on('connect.success', function(ev, object, time){
			proto.object = object;
			res.connect = proto;
			status = true;
	});
	connect.listen();
	
	// 最终触发销毁数据库连接事件
	res.handles.push(function(){ connect.destory(); });

	return status;
};

// use carry to load fn
proto.carry = function(callback){
	if ( (!_.isFunction(callback)) || (!proto.object) ) return;
	callback.call(connect, proto.object, dbo, spc);
	return proto;
};

},{"./lib/connect.js":1,"./lib/dbo.js":4,"./lib/StoredProcedures.js":5}]},{},[6])(6)
});