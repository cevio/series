
var spm = require('spm');

module.exports = function(req, res){
	var body = req.body.cmd;
	if ( body ){
		// 解析命令参数为数组
		body = formatCmd(body);
		
		// 执行命令参数
		var rets = spm.apply(spm, body);
		
		if ( rets ){ res.log(JSON.stringify(rets)); }
		else{ res.log(JSON.stringify(['error', 'can not find the namespace for this command.'])); };
		
	}else{
		res.log(JSON.stringify(['error', 'unknown command.']));
	}
};

function formatCmd(str){
	var args = str.match( /"((\\")|[^"])+"|\s([^"\s]+)(?=\s)|^[^"]+?(?=\s)|\s[^"]+?$/g );
	
	for ( var i = 0; i < args.length ; i++ ) {
		args[i] = args[i].replace(/(^\s|^\"|\"$)/g, '');
		args[i] = args[i].replace(/\\"/g, '"');
		
		if ( /^\-\:/.test(args[i]) ){
			args[i] = path.resolve(__dirname, args[i].replace(/^\-\:/, ''));
		}
	}
	
	return args;
}