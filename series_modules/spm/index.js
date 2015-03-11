// JavaScript Document
/*
 *	SPM SERVER ENGINE:
 *	Command Types:
 *		- spm
 *		- sys
 *		- 
 */
var slice = Array.prototype.slice;
var sys = ['Global', 'console', 'fs', 'process', 'path', '_'];

function html_escape(code){
	return String(code)
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/'/g, '&#39;')
				.replace(/"/g, '&quot;');
};

var spm = exports = module.exports = function(){
	var factory = spm.cmd.apply(spm, arguments);
	var fns = spm.handle(factory);
	if ( fns && fns.fn && fns.context ){
		if ( _.isFunction(fns.fn) ){
			var ret = fns.fn.apply(fns.context, factory.args);
			if ( ret && ret.error === 0 ){
				return ret;
			}else{
				if ( ret && ret.error ){
					return ret;
				}else{
					return { error: 0, chunks: ['- # ' + html_escape(JSON.stringify(ret))] };
				}
			}
		}else{
			return fns.fn;
		}
	};
}

spm.handle = function(factory){
	var localmodule = null
		,	localmethod = null;
		
	if ( factory ){
		if ( factory.name === 'spm' ){
			localmodule = require('./spm.js');
			if ( localmodule[factory.method] ){
				localmethod = localmodule[factory.method];
			}
		}else if ( sys.indexOf(factory.name) > -1 ){
			localmodule = (new Function('return ' + factory.name))();
			if ( localmodule[factory.method] ){
				localmethod = localmodule[factory.method];
			}
		}else{
			var folder = path.resolve(__dirname, '..', factory.name);
			if ( fs.exist(folder) ){
				var packageFile = path.resolve(folder, 'package.json');
				var spmFile = path.resolve(folder, 'spm.js');
				if ( fs.exist(packageFile) ){
					var configs = require(packageFile);
					if ( configs.spm ){
						spmFile = path.resolve(folder, configs.spm);
					}
				}
				
				if ( fs.exist(spmFile) ){
					localmodule = require(spmFile);
					if ( localmodule[factory.method] ){
						localmethod = localmodule[factory.method];
					}
				}
			}
			
			if ( !localmethod ){
				var selfPather = path.resolve(spm.defaults.pather, factory.name + '.js');
				if ( fs.exist(selfPather) ){
					localmodule = require(selfPather);
					if ( localmodule[factory.method] ){
						localmethod = localmodule[factory.method];
					}
				}
			}
		}
	}
	
	return { fn: localmethod, context: localmodule };
}

spm.cmd = function(){
	if ( arguments.length < 2 ){
		return;
	}
	
	var ModuleName = arguments[0]
		,	ModuleMethod = arguments[1]
		,	ModuleArguemnts = slice.call(arguments, 2) || [];

	return {
		name: ModuleName,
		method: ModuleMethod,
		args: ModuleArguemnts
	}
}

spm.defaults = {
	pather: path.resolve(__dirname, '../series_spm/lib')
}