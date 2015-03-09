
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
	
// set template engine with ojs
// require ojs on series platform
// spm install ojs	

//app.use(express.template(path.resolve(__dirname, 'views')));
app.use('/spm', express.template(path.resolve(__dirname, 'series_spm', 'views')));
app.use('/spm', express.bodyParse());

app.get('/spm/:action?', function(req, res){
	var action = req.params.action;
	if ( !action ){
		var locals = {
			__dirname: __dirname + '\\series_spm'
		};
		res.render('index', locals, function(err, str){
			if ( err ){
				res.log(err.message);
			}else{
				res.log(str);
			}
		});
	}else{
		require('series_spm/' + action + '.js')(req, res);
	}
});

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