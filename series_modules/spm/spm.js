var spmRunpix = '../../series_spm';
var spmRunner = path.resolve(__dirname, spmRunpix);

/*
 *	@ url http://...
 *	@ pather ../series_module/folder
 */
exports.downzip = function(url, pather){
	try{
		var filestream = require('filestream');
		pather = path.resolve(spmRunner, pather);
		filestream.download(url, pather + '.zip');
		if ( !fs.exist(pather) ){ fs.mkdir(pather); };
		var zip = require('zip');
		zip.unZip(pather + '.zip', pather);
		fs.unlink(pather + '.zip');
		
		var chunks = ['- % download zip success: ' + pather + '.zip'];
		var files = findDir(pather);
		for ( var i = 0 ; i < files.length ; i++ ){
			chunks.push('<pre>    <font color="#555">- % ' + files[i] + '</font></pre>');
		}
	
		return { error: 0, chunks: chunks };
	}catch(e){
		return { error: 1, message: '- # download zip file from ' + url + ' fail.' };
	}
}

exports.compress = function(pather, target, basename){
	try{
		if ( /^\./.test(pather) || /\//.test(pather) ){
			pather = path.resolve(spmRunner, pather);
		}else{
			pather = require.resolve(pather);
		};
		target = path.resolve(spmRunner, target);
		
		if ( fs.exist(pather) ){
			var compress = require('compressor');
			basename = basename ? basename : path.basename(pather, '.js');
			var content = compress(pather, basename);
			fs.writeFile(target, content);
			return { error: 0, chunks: ['- @ compress file [' + target + '] success.'] };
		}else{
			return { error: 1, message: 'can not find the file which is compressing!'};
		}
	}catch(e){
		return { error: 1, message: 'sorry, compressor catch error!' + e.message};
	}
}

exports.grunt = function(){
	try{
		var which = ['series.js']
			,	pathers = []
			,	distPather;
		
		_.each(which, function(that){
			var thatModule = require('../../src/' + that),
				content = '';
			_.each(thatModule.compressor, function(compressor){
				content += '\n\n' + '// Grunt From /src/' + compressor + '\n' + fs.readFile(path.resolve(__dirname, '../../src/' + compressor)) + '\n';
			});
			if ( thatModule.wrap ){
				var wrapContent = fs.readFile(path.resolve(__dirname, '../../src/' + thatModule.wrap));
				content = wrapContent.replace("{$wrapcontent$}", content);
			};
			var distfile = path.resolve(__dirname, '../../dist/' + thatModule.dist);
			fs.writeFile(distfile, content);
			distPather = distfile;
			pathers.push(distfile)
		});
		
		var chunks = [];
		_.each(pathers, function(pather){
			chunks.push('<pre><font color="#555">  @ ' + pather + '</font></pre>');
		});
		
		chunks.push('<font color="#069">- # grunt [' + distPather + '] success!</font>');
	
		return { error: 0, chunks: chunks };
	}catch(e){
		return { error: 1, message: 'sorry, grunt file catch error!'};
	}
}

exports.unlink = function(pather){
	pather = path.resolve(spmRunner, pather);
	fs.unlink(pather);
	return { error: 0, chunks: ['- % delete file [' + pather + '] success!'] };
}

exports.jspm = function(dir){
	var jspm = {}, add = false;
	dir = path.resolve(spmRunner, dir);
	var name = path.basename(dir);
	var packageFile = path.resolve(dir, 'package.json');

	if ( fs.exist(packageFile) ){
		var configs = require(packageFile);
		if ( configs['jspm'] ){
			var _jspmFile = path.resolve(dir, configs['jspm']);
			if ( fs.exist(_jspmFile) ){
				jspm[name] = path.relative(path.server('/'), _jspmFile);
			}
		}else{
			var __jspmFile = path.resolve(dir, 'jspm.js');
			if ( fs.exist(__jspmFile) ){
				jspm[name] = path.relative(path.server('/'), __jspmFile);
			}
		}
	}else{
		var jspmFile = path.resolve(dir, 'jspm.js');
		if ( fs.exist(jspmFile) ){
			jspm[name] = path.relative(path.server('/'), jspmFile);
		}
	}
	
	if ( jspm[name] ){
		add = true;
		jspm[name] = '/' + jspm[name].replace(/\\/g, '/');
	}
	
	return { error: 0, jspm: jspm, chunks: [add ? '- % [' + name + '] been add to global package libary.' : '- % no more [' + name + '] need been add.'] };
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