
/*!
 * Express Application FrameWork.
 * Use for build a new app.
 * Down from http://series.webkits.cn/modules/express
 * Copyright (c) 2014-2015 Evio Shen <evio@vip.qq.com>
 */

// ----------------------------------------------------------------
// Module dependencies. 
var 
	express = require('express'),
	app = express();

require('./series_spm/use.js')(app, express);
app.get('/', function(req, res){
	res.render('index', {}, function(err, str){
		if ( err ){
			res.log(err.message);
		}else{
			res.log(str);
		}
	});
});

module.exports = app.listen.bind(app);