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
	var fns = spm.handle(factory), ret;
	if ( fns && fns.fn && fns.context ){
		if ( _.isFunction(fns.fn) ){
			ret = fns.fn.apply(fns.context, factory.args);
			if ( ret ){
				if ( sys.indexOf(factory.name) > -1 ){
					return ['log', html_escape(JSON.stringify(ret))]
				}else{
					return ret;
				}
			}else{
				return ['success', html_escape(JSON.stringify(ret))];
			}
		}else{
			return fns.fn;
		}
	}else{
		if ( fns && !fns.fn && fns.context ){
			var n = {
				"-v": "version",
				"-d": "description"
			};
			
			var get = false, values;

			if ( fns.method && fns.configs ){
				for ( var o in n  ){
					if ( new RegExp('^' + o + '$', 'i').test(fns.method) ){
						values = fns.configs[n[o]] || 'not defined';
						get = true;
						break;
					}
				}
			}
			
			if ( get ){
				return ['info', values];
			}
			
			if ( _.isFunction(fns.context.help) ){
				ret = fns.help.apply(fns.context, factory.args);
				if ( ret ){
					return ret;
				}else{
					return ['list', 'no match method, you can use ' + factory.name + ' help', spm.list(fns.context, factory.name)];
				}
			}else{
				return ['list', 'no match method, you can use ' + factory.name + ' help', spm.list(fns.context, factory.name)];
			}
		}
	}
}

spm.list = function(modal, name){
	var chunks = [];
	for ( var i in modal ){
		chunks.push('<strong>' + i + '</strong>: &lt; ' + name + ' ' + i + ' [-args...] &gt;');
	}
	return chunks;
}

spm.handle = function(factory){
	var localmodule = null
		,	localmethod = null
		,	packages = null;
		
	if ( factory ){
		if ( factory.name === 'spm' ){
			localmodule = require('./spm.js');
			if ( localmodule[factory.method] ){
				localmethod = localmodule[factory.method];
			}
			if ( fs.exist(path.resolve(__dirname, './package.json')) ){
				packages = require('./package.json');
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
					packages = configs;
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
	
	return { fn: localmethod, context: localmodule, configs: packages, method: factory.method };
}

spm.cmd = function(){
	if ( arguments.length < 2 ){
		return;
	}
	
	var ModuleName = arguments[0]
		,	ModuleMethod = arguments[1]
		,	ModuleArguemnts = slice.call(arguments, 2) || [];
		
	if ( /^\-h$/i.test(ModuleMethod) ){
		ModuleMethod = 'help';
	}

	return {
		name: ModuleName,
		method: ModuleMethod,
		args: ModuleArguemnts
	}
}

spm.defaults = {
	pather: path.resolve(__dirname, '../series_spm/lib')
}