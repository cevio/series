
var spm = require('spm');

module.exports = function(req, res){
	var body = req.body.cmd;
	if ( body ){
		body = formatCmd(body);
		var rets = spm.apply(spm, body);
		if ( rets ){
			res.json(rets);
		}else{
			res.json({ error: 1, message: 'can not find the namespace for this command.' });
		}
	}else{
		res.json({ error: 1, message: 'unknow command.' });
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