// JavaScript Document
module.exports = function(app, express){
	app.use('/spm', express.template(path.resolve(__dirname, 'views')));
	app.use('/spm', express.bodyParse());
	
	app.get('/spm/:action?', function(req, res){
		var action = req.params.action;
		var spmPackage = require('../series_modules/spm/package.json');
		if ( !action ){
			var locals = {
				__dirname: path.relative(path.server('/'), __dirname),
				deps: require('./deps.js'),
				spmversion: spmPackage.version,
				url: spmPackage.homepage
			};
			res.render('index', locals, function(err, str){
				if ( err ){
					res.log(err.message);
				}else{
					res.log(str);
				}
			});
		}else{
			require('./' + action + '.js')(req, res);
		}
	});

}