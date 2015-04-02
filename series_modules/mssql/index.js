
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

var mssql = require('./lib/connect.js')
	,	dbo = require('./lib/dbo.js')
	,	spc = require('./lib/StoredProcedures.js')
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
