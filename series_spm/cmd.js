
var spm = require('spm');

module.exports = function(req, res){
	var body = req.body.cmd;
	if ( body ){
		body = body.replace(/\s+/g, ' ').trim();
		var rets = spm.apply(spm, body.split(' '));
		if ( rets ){
			res.json(rets);
		}else{
			res.json({ error: 1, message: 'can not find the namespace for this command.' });
		}
	}else{
		res.json({ error: 1, message: 'unknow command.' });
	}
};