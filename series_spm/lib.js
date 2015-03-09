exports.download = function(req, res, url, name){
	var filestream = require('filestream');
	var file = path.basename(url);
	var pather = path.resolve(__dirname, '../series_modules/' + file);
	filestream.download(url, pather);

	var dir = path.resolve(__dirname, '../series_modules/' + name);
	if ( !fs.exist(dir) ){ fs.mkdir(dir); };
	var zip = require('zip');
	zip.unZip(pather, dir);
	fs.unlink(pather);
	
	var chunks = ['- % download success: ' + pather];
	var files = findDir(dir);
	
	for ( var i = 0 ; i < files.length ; i++ ){
		chunks.push('<pre>    <font color="#555">- @ ' + files[i] + '</font></pre>');
	}

	res.json({ error: 0, chunks: chunks });
}

exports.compress = function(req, res, pather, target){
	pather = require.resolve(pather);
	target = require.resolve(target);
	if ( fs.exist(pather) ){
		var compress = require('compressor');
		var basename = path.basename(pather, '.js');
		var content = compress(pather, basename);
		fs.writeFile(target, content);
		res.json({ error: 0, chunks: ['- @ compress file [' + target + '] success.'] });
	}else{
		res.json({error: 1, message: 'can not find the file which is compressing!'});
	}
}

exports.grunt = function(req, res){
	var which = ['series.js']
		,	pathers = [];
	
	_.each(which, function(that){
		var thatModule = require('../src/' + that),
			content = '';
		_.each(thatModule.compressor, function(compressor){
			content += '\n\n' + '// Grunt From /src/' + compressor + '\n' + fs.readFile(path.resolve(__dirname, '../src/' + compressor)) + '\n';
		});
		if ( thatModule.wrap ){
			var wrapContent = fs.readFile(path.resolve(__dirname, '../src/' + thatModule.wrap));
			content = wrapContent.replace("{$wrapcontent$}", content);
		};
		var distfile = path.resolve(__dirname, '../dist/' + thatModule.dist);
		fs.writeFile(distfile, content);
		pathers.push(distfile)
	});
	
	var chunks = [];
	_.each(pathers, function(pather){
		chunks.push('<pre><font color="#555">  @ ' + pather + '</font></pre>');
	});
	
	chunks.push('<font color="#069">- # grunt success!</font>');

	res.json({ error: 0, chunks: chunks });
}

function findDir(dir){
	var files = [];
	var obj = fs.readDir(dir);
	_.each(obj.file, function(file){
		files.push(String(file));
	});
	_.each(obj.dir, function(folder){
		folder = String(folder);
		files = files.concat(findDir(folder));
	});
	return files;
}