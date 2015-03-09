var lib = require('./lib.js');
var proto = exports = module.exports = function(req, res){
	var body = req.body.cmd;
	if ( body ){
		body = body.replace(/\s+/g, ' ').split(' ');
		var argvs = [req, res].concat(body);
		proto.handle.apply(proto, argvs);
	}else{
		res.json({ error: 1, message: 'unknow command.' });
	}
}

proto.handle = function(){
	var req = arguments[0]
		,	res = arguments[1]
		, cmd = arguments[2]
		,	med = arguments[3]
		,	arg = Array.prototype.slice.call(arguments, 4) || [];
	
	if ( /spm/i.test(cmd) ){	
		if ( lib[med] ){
			arg = [req, res].concat(arg);
			res.json(lib[med].apply(lib, arg));
		}else{
			res.json({ error: 1, message: 'unknown command.' });
		}
	}else{
		res.json({ error: 1, message: 'no support namespace' });
	}
}