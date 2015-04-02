// ojs module
// -----------------------------
(function (mod) {
    if (typeof exports == "object" && typeof module == "object"){ module.exports = mod(true); }
    else if (typeof define == "function" && define.amd){ return define([], mod); }
    else { window.ojs = mod(); }
})(function( isSeriesJs ){
	
	var 
		blank = '',
		map = {},
		ojs = new Class(function(options){
			this.property('configs', _.extend(this['private']('defaults'), options));
		}),
		htmlDecode = function(code){
			return code
				.replace(/\&quot\;/g, '"')
				.replace(/\&\#39\;/g, '\'')
				.replace(/\&gt\;/g, '>')
				.replace(/\&lt\;/g, '<')
				.replace(/\&amp\;/g, '&')
		};
		
	isSeriesJs = !!isSeriesJs;
	
	ojs.property('defaults', { 
		open: '<' + blank + '%', 
		close: '%' + blank + '>', 
		encoding: typeof Response !== 'undefined' && Response.Charset ? Response.Charset : 'utf-8'
	});
	
	ojs.property('stack', function(str, type){
		this.buffer.push({
			str: str,
			type: type
		});
	});
	ojs.property('cutSplitBuffer', function(str){
		var sep_open = this.configs.open,
			sep_close = this.configs.close;
			
		var index = str.indexOf(sep_open), _index = -1;
		
		if ( index > -1 ){
			this.stack(str.substring(0, index), 'html');
			str = str.substring(index + sep_open.length);
			_index = str.indexOf(sep_close);
			if ( _index > -1 ){
				var escapeText = str.substring(0, _index);
				if ( /^\=/.test(escapeText) ){
					this.stack(escapeText.substr(1), 'escape');
				}else if ( /^\-/.test(escapeText) ){
					this.stack(escapeText.substr(1), 'unescape');
				}else{
					this.stack(escapeText, 'code');
				};
				str = str.substring(_index + sep_close.length);
				if ( str.indexOf(sep_open) > -1 ){
					this.cutSplitBuffer(str);
				}else{
					this.stack(str, 'html');
				}
			}else{
				// 标签未闭合
				throw new Error('ojs compile error: can not find the sep.close selector');
			}
		}else{
			this.stack(str, 'html');
		}
	});

	ojs.property('parse', function(str, data, filename){
		var that = this;
		var ext = ojs.__express.ext;		
		var escapeFactory = function(html){
			return String(html)
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/'/g, '&#39;')
				.replace(/"/g, '&quot;');
		};
		
		var imports = function(pather){
			if ( pather && pather.length > 0 ){
				pather = path.resolve(path.dirname(__filename), pather + (__isServer__ ? '.' + __ext__ : ''));
				_ojs = new __ojs__(__that__.configs);
				return _ojs.render(pather, __object__);
			}else{
				throw new Error("ojs catch error: ojs template include error: no pather or pather is empty.");
			}
		};

		var h = 'var __ojsbuf__ = [];var __ext__ = "' + ext + '";var __isServer__ = ' + ( isSeriesJs ? true : false ) + ';';
		h += 'var escape = ' + escapeFactory.toString() + ';';
		
		if ( isSeriesJs ){
			h += 'var __filename = \"' + filename + '\";';
		};
		
		h += 'var __imports = ' + imports.toString() + ';';
		h += '\nwith(__object__){\n';

		this.cutSplitBuffer(str);
	
		_.each(this.buffer, function(object){
			if ( object.type !== 'html' ){
				object.str = object.str ? object.str.trim() : object.str;
			};
			
			if ( object.type === 'escape' ){
				h += '__ojsbuf__.push(escape(' + object.str + '));';
			}else if ( object.type === 'unescape' ){
				h += '__ojsbuf__.push(' + object.str + ');';
			}else if ( object.type === 'code' ){
				var pather, _ojs;
				if ( /^include/i.test(object.str) ){
					object.str = object.str.replace(/\s+/g, ' ');
					pather = object.str.split(' ').slice(1).join(' ');
					
					if ( pather && pather.length > 0 ){
						pather = path.resolve(path.dirname(filename), pather + (__isServer__ ? '.' + ext : ''));
						_ojs = new ojs(that.configs);
						h += '__ojsbuf__.push(' + JSON.stringify(_ojs.render(pather, data)) + ');';
					}else{
						throw new Error('ojs catch error: ojs template include error: no pather or pather is empty.');
					}

				}
				else if ( /^import/i.test(object.str) ){
					object.str = object.str.replace(/\s+/g, ' ');
					pather = object.str.split(' ').slice(1).join(' ');
					h += '__ojsbuf__.push(__imports(' + pather + '));';
				}
				else{
					h += object.str;
				}
			}else{
				h += '__ojsbuf__.push(' + JSON.stringify(object.str) + ');';
			}
		});
		
		h += '\n};\nreturn __ojsbuf__.join("");\n';

		return (new Function('__object__', '__ojs__', '__that__', h))(data, ojs, this);
	});
	
	ojs.define('getCache', function(key){
		return map[key];
	});
	ojs.define('setCache', function(key, value){
		map[key] = value;
	});
	
	ojs.define('clear', function(key){
		if ( map[key] ) {
			delete map[key];
		};
	});
	
	ojs.define('clearCache', function(){
		this.property('buffer', []);
	});
	
	ojs.define('render', function(str, data){
		var 
			filename = str;
			filename = filename.replace(/\\/g, '\\\\');
		
		if ( this.getCache(filename) ){
			return this.compile(this.getCache(filename), data, isSeriesJs ? filename : undefined);
		}else{
			if ( isSeriesJs ){ str = fs.readFile(str, { encoding: this['private']('configs').encoding }); }
			else{ str = htmlDecode(document.getElementById(str).innerHTML); };
			if ( this['private']('configs').cache ){ this.setCache(filename, str); };
			return this.compile(str, data, isSeriesJs ? filename : undefined);
		};
	});
	
	ojs.define('compile', function(str, data, filename){
		this.clearCache();
		return this['private']('parse')(str, data, filename);
	});
	
	ojs.__cache = function(pather){
		if ( isSeriesJs ){
			map[pather] = fs.readFile(pather);
		}else{
			map[pather] = htmlDecode(document.getElementById(pather).innerHTML);
		};
	};
	
	ojs.__express = function(pather, options, fn){		
		if ('function' == typeof options) {
			fn = options, options = {};
		}
		
		options.filename = pather;
		
		var data = _.clone(options.locals || {});
		delete options.locals;
		
		var _ojs = new ojs(options);

		var str;

		try {
			str = _ojs.render(pather, data);
		} catch (err) {
			_.isFunction(fn) && fn(err);
			return;
		};
		
		_.isFunction(fn) && fn(null, str);
	};
	
	ojs.__express.ext = 'ojs';
	
	return ojs;
	
});