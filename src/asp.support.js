/*
 * @overview Global series Scripts Loader - a tiny implementation of Promises/A+ and CommonJS contributors.
 * @copyright Copyright (c) 2014 evio studio and series iis node
 * @license   Licensed under MIT license
 *            See https://github.com/cevio/series
 * @version   1.1.348
 */
Response.Buffer = true;
Server.ScriptTimeOut = 999;
Session.CodePage = 65001;
Session.LCID = 2052;
Response.Charset = 'utf-8';

var Global = new Object(), Promise, polyfill, Class, console, fs = {}, event, process, path = {}, JSON = new Object(), Map, Set, WeakMap, WeakSet;

// https://github.com/lifesinger/dew/blob/master/lib/es5-safe/src/es5-safe.js
// es5-safe
// ----------------
// Provides compatibility shims so that legacy JavaScript engines behave as
// closely as possible to ES5.
//
// Thanks to:
//  - http://es5.github.com/
//  - http://kangax.github.com/es5-compat-table/
//  - https://github.com/kriskowal/es5-shim
//  - http://perfectionkills.com/extending-built-in-native-objects-evil-or-not/
//  - https://gist.github.com/1120592
//  - https://code.google.com/p/v8/

(function(){
	var OP = Object.prototype;
	var AP = Array.prototype;
	var FP = Function.prototype;
	var SP = String.prototype;
	var hasOwnProperty = OP.hasOwnProperty;
	var slice = AP.slice;
	
	
	/*---------------------------------------*
	 * Function
	 *---------------------------------------*/
	
	// ES-5 15.3.4.5
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
	FP.bind || (FP.bind = function(that) {
		var target = this;
	
		// If IsCallable(func) is false, throw a TypeError exception.
		if (typeof target !== 'function') {
			throw new TypeError('Bind must be called on a function');
		}
	
		var boundArgs = slice.call(arguments, 1);
	
		function bound() {
			// Called as a constructor.
			if (this instanceof bound) {
				var self = createObject(target.prototype);
				var result = target.apply(
						self,
						boundArgs.concat(slice.call(arguments))
				);
				return Object(result) === result ? result : self;
			}
			// Called as a function.
			else {
				return target.apply(
						that,
						boundArgs.concat(slice.call(arguments))
				);
			}
		}
	
		// NOTICE: The function.length is not writable.
		//bound.length = Math.max(target.length - boundArgs.length, 0);
	
		return bound;
	});
	
	
	// Helpers
	function createObject(proto) {
		var o;
	
		if (Object.create) {
			o = Object.create(proto);
		}
		else {
			/** @constructor */
			function F() {
			}
	
			F.prototype = proto;
			o = new F();
		}
	
		return o;
	}
	
	
	/*---------------------------------------*
	 * Object
	 *---------------------------------------*/
	// http://ejohn.org/blog/ecmascript-5-objects-and-properties/
	
	// ES5 15.2.3.14
	// http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
	// https://developer.mozilla.org/en/ECMAScript_DontEnum_attribute
	// http://msdn.microsoft.com/en-us/library/adebfyya(v=vs.94).aspx
	Object.keys || (Object.keys = (function() {
		var hasDontEnumBug = !{toString: ''}.propertyIsEnumerable('toString');
		var DontEnums = [
			'toString',
			'toLocaleString',
			'valueOf',
			'hasOwnProperty',
			'isPrototypeOf',
			'propertyIsEnumerable',
			'constructor'
		];
		var DontEnumsLength = DontEnums.length;
	
		return function(o) {
			if (o !== Object(o)) {
				throw new TypeError(o + ' is not an object');
			}
	
			var result = [];
	
			for (var name in o) {
				if (hasOwnProperty.call(o, name)) {
					result.push(name);
				}
			}
	
			if (hasDontEnumBug) {
				for (var i = 0; i < DontEnumsLength; i++) {
					if (hasOwnProperty.call(o, DontEnums[i])) {
						result.push(DontEnums[i]);
					}
				}
			}
	
			return result;
		};
	
	})());
	
	
	/*---------------------------------------*
	 * Array
	 *---------------------------------------*/
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array
	// https://github.com/kangax/fabric.js/blob/gh-pages/src/util/lang_array.js
	
	// ES5 15.4.3.2
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
	Array.isArray || (Array.isArray = function(obj) {
		return OP.toString.call(obj) === '[object Array]';
	});
	
	
	// ES5 15.4.4.18
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach
	AP.forEach || (AP.forEach = function(fn, context) {
		for (var i = 0, len = this.length >>> 0; i < len; i++) {
			if (i in this) {
				fn.call(context, this[i], i, this);
			}
		}
	});
	
	
	// ES5 15.4.4.19
	// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
	AP.map || (AP.map = function(fn, context) {
		var len = this.length >>> 0;
		var result = new Array(len);
	
		for (var i = 0; i < len; i++) {
			if (i in this) {
				result[i] = fn.call(context, this[i], i, this);
			}
		}
	
		return result;
	});
	
	
	// ES5 15.4.4.20
	// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
	AP.filter || (AP.filter = function(fn, context) {
		var result = [], val;
	
		for (var i = 0, len = this.length >>> 0; i < len; i++) {
			if (i in this) {
				val = this[i]; // in case fn mutates this
				if (fn.call(context, val, i, this)) {
					result.push(val);
				}
			}
		}
	
		return result;
	});
	
	
	// ES5 15.4.4.16
	// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/every
	AP.every || (AP.every = function(fn, context) {
		for (var i = 0, len = this.length >>> 0; i < len; i++) {
			if (i in this && !fn.call(context, this[i], i, this)) {
				return false;
			}
		}
		return true;
	});
	
	
	// ES5 15.4.4.17
	// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/some
	AP.some || (AP.some = function(fn, context) {
		for (var i = 0, len = this.length >>> 0; i < len; i++) {
			if (i in this && fn.call(context, this[i], i, this)) {
				return true;
			}
		}
		return false;
	});
	
	
	// ES5 15.4.4.21
	// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
	AP.reduce || (AP.reduce = function(fn /*, initial*/) {
		if (typeof fn !== 'function') {
			throw new TypeError(fn + ' is not an function');
		}
	
		var len = this.length >>> 0, i = 0, result;
	
		if (arguments.length > 1) {
			result = arguments[1];
		}
		else {
			do {
				if (i in this) {
					result = this[i++];
					break;
				}
				// if array contains no values, no initial value to return
				if (++i >= len) {
					throw new TypeError('reduce of empty array with on initial value');
				}
			}
			while (true);
		}
	
		for (; i < len; i++) {
			if (i in this) {
				result = fn.call(null, result, this[i], i, this);
			}
		}
	
		return result;
	});
	
	
	// ES5 15.4.4.22
	// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
	AP.reduceRight || (AP.reduceRight = function(fn /*, initial*/) {
		if (typeof fn !== 'function') {
			throw new TypeError(fn + ' is not an function');
		}
	
		var len = this.length >>> 0, i = len - 1, result;
	
		if (arguments.length > 1) {
			result = arguments[1];
		}
		else {
			do {
				if (i in this) {
					result = this[i--];
					break;
				}
				// if array contains no values, no initial value to return
				if (--i < 0)
					throw new TypeError('reduce of empty array with on initial value');
			}
			while (true);
		}
	
		for (; i >= 0; i--) {
			if (i in this) {
				result = fn.call(null, result, this[i], i, this);
			}
		}
	
		return result;
	});
	
	
	// ES5 15.4.4.14
	// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/indexOf
	AP.indexOf || (AP.indexOf = function(value, from) {
		var len = this.length >>> 0;
	
		from = Number(from) || 0;
		from = Math[from < 0 ? 'ceil' : 'floor'](from);
		if (from < 0) {
			from = Math.max(from + len, 0);
		}
	
		for (; from < len; from++) {
			if (from in this && this[from] === value) {
				return from;
			}
		}
	
		return -1;
	});
	
	
	// ES5 15.4.4.15
	// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/indexOf
	AP.lastIndexOf || (AP.lastIndexOf = function(value, from) {
		var len = this.length >>> 0;
	
		from = Number(from) || len - 1;
		from = Math[from < 0 ? 'ceil' : 'floor'](from);
		if (from < 0) {
			from += len;
		}
		from = Math.min(from, len - 1);
	
		for (; from >= 0; from--) {
			if (from in this && this[from] === value) {
				return from;
			}
		}
	
		return -1;
	});
	
	
	/*---------------------------------------*
	 * String
	 *---------------------------------------*/
	
	// ES5 15.5.4.20
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/trim
	// http://blog.stevenlevithan.com/archives/faster-trim-javascript
	// http://jsperf.com/mega-trim-test
	SP.trim || (SP.trim = (function() {
	
		// http://perfectionkills.com/whitespace-deviations/
		var whiteSpaces = [
	
			'\\s',
			//'0009', // 'HORIZONTAL TAB'
			//'000A', // 'LINE FEED OR NEW LINE'
			//'000B', // 'VERTICAL TAB'
			//'000C', // 'FORM FEED'
			//'000D', // 'CARRIAGE RETURN'
			//'0020', // 'SPACE'
	
			'00A0', // 'NO-BREAK SPACE'
			'1680', // 'OGHAM SPACE MARK'
			'180E', // 'MONGOLIAN VOWEL SEPARATOR'
	
			'2000-\\u200A',
			//'2000', // 'EN QUAD'
			//'2001', // 'EM QUAD'
			//'2002', // 'EN SPACE'
			//'2003', // 'EM SPACE'
			//'2004', // 'THREE-PER-EM SPACE'
			//'2005', // 'FOUR-PER-EM SPACE'
			//'2006', // 'SIX-PER-EM SPACE'
			//'2007', // 'FIGURE SPACE'
			//'2008', // 'PUNCTUATION SPACE'
			//'2009', // 'THIN SPACE'
			//'200A', // 'HAIR SPACE'
	
			'200B', // 'ZERO WIDTH SPACE (category Cf)
			'2028', // 'LINE SEPARATOR'
			'2029', // 'PARAGRAPH SEPARATOR'
			'202F', // 'NARROW NO-BREAK SPACE'
			'205F', // 'MEDIUM MATHEMATICAL SPACE'
			'3000' //  'IDEOGRAPHIC SPACE'
	
		].join('\\u');
	
		var trimLeftReg = new RegExp('^[' + whiteSpaces + ']+');
		var trimRightReg = new RegExp('[' + whiteSpaces + ']+$');
	
		return function() {
			return String(this).replace(trimLeftReg, '').replace(trimRightReg, '');
		}
	
	})());
	
	
	/*---------------------------------------*
	 * Date
	 *---------------------------------------*/
	
	// ES5 15.9.4.4
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/now
	Date.now || (Date.now = function() {
		return +new Date;
	});
	
	Object.create || (Object.create = function(proto, des) {
		var Temp = function(){};
		Temp.prototype = proto;
		var obj = new Temp();
		for (var key in des) {
				obj[key] = des[key].value;
		}
		obj.__proto__ = proto;
		obj.constructor = Object;
		return obj;
	});
	
	Object.getPrototypeOf || (Object.getPrototypeOf = function (obj) {
		var proto = obj.__proto__;
		if (proto || proto === null) {
				return proto;
		} else if (obj.constructor) {
				return obj.constructor.prototype;
		} else {
				return _objproto;
		}
	});

	AP.find || (AP.find = function(fn, context) {
			var list = Object(this);
			var l = list.length >>> 0;
			if (!l || l < 0) {
					return;
			}
			for (var i = 0, value; i < l && i in list; i++) {
					value = list[i];
					if (fn.call(context, value, i, list)) {
							return value;
					}
			}
	});
	
	AP.findIndex || (AP.findIndex = function(fn, context){
		var list = Object(this);
		var l = list.length >>> 0;
		if (!l || l < 0) {
				return -1;
		}
		for (var i = 0; i < l && i in list; i++) {
				if (fn.call(context, list[i], i, list)) {
						return i;
				}
		}
		return -1;
	});
	
	AP.fill || (AP.fill = function(value, start, end){
		var list = Object(this);
			var l = list.length >>> 0;
			start = start || 0;
			end = end || l;
			var i = start < 0 
					? Math.max(l + start, 0) : Math.min(start, l);
			for (; i < l && i < end; ++i) {
					list[i] = value;
			}
			return list;
	});
	
	AP.copyWithin || (AP.copyWithin = function(target, start /*, end*/){
		var O = Object(this);
		var len = O.length >>> 0;
		var relativeTarget = parseInt(target, 10);
		var to = relativeTarget < 0 ? Math.max(len + relativeTarget, 0)
				: Math.min(relativeTarget, len);
		var relativeStart = parseInt(start, 10);
		var from = relativeStart < 0 ? Math.max(len + relativeStart, 0)
				: Math.min(relativeStart, len);
		var end = arguments[2];
		var relativeEnd = end === undefined ? len : parseInt(end, 10);
		var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0)
				: Math.min(relativeEnd, len);
		var count = Math.min(final - from, len - to);
		if (from < to && to < (from + count)) {
				from = from + count - 1;
				to = to + count - 1;
				while (count > 0) {
						if (from in O)
								O[to] = O[from];
						else
								delete O[to];
						from--;
						to--;
						count--;
				}
		} else {
				while (count > 0) {
						if (from in O)
								O[to] = O[from];
						else
								delete O[to];
						from++;
						to++;
						count--;
				}
		}
		return O;
	});
	
	AP.of || (AP.of = function(){
		return slice.call(arguments);
	});
	
	AP.from || (AP.from = function(arrayLike){
		var to_length = function(value) {
				var number = Number(value);
				var length;
				if (number != number) { // better `isNaN`
						length = 0;
				} else if (number === 0 || !isFinite(number)) {
						length = number;
				} else {
						length = (number < 0 ? -1 : +1) 
								* Math.floor(Math.abs(number));
				}
				if (length <= 0) {
						return 0;
				}
				return Math.min(length, 0x1FFFFFFFFFFFFF);
		};
		var items = Object(arrayLike),
				mapfn = arguments.length > 1 ? arguments[1] : undefined,
				context = arguments.length > 2 ? arguments[2] : undefined,
				mapping = true;
		if (mapfn === undefined) {
				mapping = false;
		} else if (typeof mapfn != 'function') {
				throw TypeError();
		}
		var l = to_length(items.length),
				re = new Array(l),
				k = 0,
				kvalue,
				mapped_value;
		while (k < l) {
				if (k in items) {
						kvalue = items[k];
						mapped_value = mapping 
								? mapfn.call(context, kvalue, k) 
								: kvalue;
						re[k] = mapped_value;
				}
				++k;
		}
		re.length = l;
		return re;
	});
	
	SP.startsWith || (SP.startsWith = function(searchStr, startArg){
		var thisStr = String(this);
		searchStr = String(searchStr);
		var start = Math.max(parseInt(startArg, 10), 0);
		return thisStr.slice(start, start + searchStr.length) === searchStr;
	});
	
	SP.endsWith || (SP.endsWith = function(searchStr, posArg){
		var thisStr = String(this);
		searchStr = String(searchStr);
		var thisLen = thisStr.length;
		var pos = posArg === undefined ? thisLen : parseInt(posArg, 10);
		var end = Math.min(Math.max(pos, 0), thisLen);
		return thisStr.slice(end - searchStr.length, end) === searchStr;
	});
	
	SP.contains || (SP.contains = function(searchString, position){
		return SP.indexOf.call(this, searchString, position) !== -1;
	});
	
	SP.repeat || (SP.repeat = function(times){
		var repeat = function(s, times) {
				if (times < 1) {
						return '';
				}
				if (times % 2) {
						return repeat(s, times - 1) + s;
				}
				var half = repeat(s, times / 2);
				return half + half;
		};
		var thisStr = String(this);
		times = parseInt(times, 10);
		if (times < 0 || times === Infinity) {
				throw new RangeError('Invalid String#repeat value');
		}
		return repeat(thisStr, times);
	});
	
	if (!Number.MAX_SAFE_INTEGER) {
			var maxSafeInteger = Math.pow(2, 53) - 1;
			Number.MAX_SAFE_INTEGER = maxSafeInteger;
			Number.MIN_SAFE_INTEGER = -maxSafeInteger;
	}
	
	if (!Number.EPSILON) {
			Number.EPSILON = 2.220446049250313e-16;
	}
	
	if (!Number.isFinite) {
			Number.isFinite = function(value) {
					return typeof value === 'number' && isFinite(value);
			};
	}
	
	if (!Number.isInteger) {
			Number.isInteger = function(value) {
					return typeof value === "number" 
							&& isFinite(value) 
							&& value > -9007199254740992 
							&& value < 9007199254740992 
							&& Math.floor(value) === value;
			};
	}
	
	if (!Number.isSafeInteger) {
			Number.isSafeInteger = function(value) {
					return Number.isInteger(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
			};
	}
	
	if (!Number.isNaN) {
			Number.isNaN = function(value) {
					return value !== value;
			};
	}
	
	// modified from ljharb/object-is
	if (!Object.is) {
			var number_is_NaN = function(value) {
					return typeof value === 'number' && isNaN(value);
			};
			Object.is = function is(a, b) {
					if (a === 0 && b === 0) {
							return 1 / a === 1 / b;
					} else if (a === b) {
							return true;
					} else if (number_is_NaN(a) && number_is_NaN(b)) {
							return true;
					}
					return false;
			};
	}
	
	// modified from ljharb/object.assign
	if (!Object.assign) {
			var is_object = function(obj) {
					return obj && typeof obj === 'object';
			};
			Object.assign = function assign(target, source) {
					var s, i, l, props;
					if (!is_object(target)) {
							throw new TypeError('target must be an object');
					}
					for (s = 1, l = arguments.length; s < l; ++s) {
							source = arguments[s];
							if (!is_object(source)) {
									throw new TypeError('source ' + s + ' must be an object');
							}
							props = Object.keys(Object(source));
							for (i = 0, l = props.length; i < l; ++i) {
									target[props[i]] = source[props[i]];
							}
					}
					return target;
			};
	}
})();

(function(){
	var _array_indexof = [].indexOf;
	
	function Map(){
			var keys = [],
					values = [];
			return Object.create(Map.prototype, {
					'get': collection_get(keys, values),
					'set': collection_set(keys, values),
					'delete': collection_del(keys, values),
					'clear': collection_clear(keys, values),
					'size': collection_size(keys),
					'forEach': collection_foreach(values, keys),
					'has': collection_has(keys, values)
			});
	}
	
	function Set(){
			var values = [],
					temp = [];
			return Object.create(Set.prototype, {
					'add': collection_add(values),
					'delete': collection_del(values, temp),
					'clear': collection_clear(values, temp),
					'size': collection_size(values),
					'forEach': collection_foreach(values, temp),
					'has': collection_has(values, temp)
			});
	}
	
	function WeakMap(){
			var keys = [],
					values = [];
			return Object.create(WeakMap.prototype, {
					'get': collection_get(keys, values, true),
					'set': collection_set(keys, values, true),
					'delete': collection_del(keys, values, true),
					'clear': collection_clear(keys, values),
					'has': collection_has(keys, values, true)
			});
	}
	
	function WeakSet(){
			var values = [],
					temp = [];
			return Object.create(WeakSet.prototype, {
					'add': collection_add(values, true),
					'delete': collection_del(values, temp, true),
					'clear': collection_clear(values, temp),
					'has': collection_has(values, temp, true)
			});
	}
	
	Map.prototype = Map();
	Set.prototype = Set();
	WeakMap.prototype = WeakMap();
	WeakSet.prototype = WeakSet();
	
	function collection_get(keys, values, only_object){
			return {
					value: function(key){
							var i = collection_check(keys, key, only_object);
							return i > -1 ? values[i] : undefined;
					}
			};
	}
	
	function collection_set(keys, values, only_object){
			return {
					value: function(key, value){
							var i = collection_check(keys, key, only_object);
							if (i > -1) {
									values[i] = value;
							} else {
									values[keys.push(key) - 1] = value;
							}
					}
			};
	}
	
	function collection_del(keys, values, only_object){
			return {
					value: function(key){
							var i = collection_check(keys, key, only_object);
							if (i > -1) {
									keys.splice(i, 1);
									values.splice(i, 1);
									return true;
							}
							return false;
					}
			};
	}
	
	function collection_has(keys, values, only_object){
			return {
					value: function(key){
							return collection_check(keys, key, only_object) > -1;
					}
			};
	}
	
	function collection_add(values, only_object){
			return {
					value: function(value){
							var i = collection_check(values, value, only_object);
							if (i === -1) {
									values.push(value);
							}
					}
			};
	}
	
	function collection_clear(keys, values){
			return {
					value: function(){
							keys.length = 0;
							values.length = 0;
					}
			};
	}
	
	function collection_size(keys){
			return {
					value: function(){
							return keys.length;
					}
			};
	}
	
	function collection_foreach(values, keys){
			return {
					value: function(fn, context){
							values.forEach(function(value, i){
									fn.call(this, value, keys[i]);
							}, context);
					}
			};
	}
	
	function collection_check(keys, key, only_object) {
			if (only_object && key !== Object(key)) {
					throw new TypeError("not a non-null object");
			}
			var i;
			if (key != key || key === 0) {
					for (i = keys.length; i--;) {
							if (Object.is(keys[i], key)) {
									break;
							}
					}
			} else {
					i = _array_indexof.call(keys, key);
			}
			return i;
	}
	
})();
// util deps
(function(exports){
	'use strict';

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'symbol': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // This could be a boxed primitive (new String(), etc.), check valueOf()
  // NOTE: Avoid calling `valueOf` on `Date` instance because it will return
  // a number which, when object has some additional user-stored `keys`,
  // will be printed out.
  var formatted;
  var raw = value;
  try {
    // the .valueOf() call can fail for a multitude of reasons
    if (!isDate(value))
      raw = value.valueOf();
  } catch (e) {
    // ignore...
  }

  if (isString(raw)) {
    // for boxed Strings, we have to remove the 0-n indexed entries,
    // since they just noisey up the output and are redundant
    keys = keys.filter(function(key) {
      return !(key >= 0 && key < raw.length);
    });
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
    // now check the `raw` value to handle boxed primitives
    if (isString(raw)) {
      formatted = formatPrimitiveNoColor(ctx, raw);
      return ctx.stylize('[String: ' + formatted + ']', 'string');
    }
    if (isNumber(raw)) {
      formatted = formatPrimitiveNoColor(ctx, raw);
      return ctx.stylize('[Number: ' + formatted + ']', 'number');
    }
    if (isBoolean(raw)) {
      formatted = formatPrimitiveNoColor(ctx, raw);
      return ctx.stylize('[Boolean: ' + formatted + ']', 'boolean');
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  // Make boxed primitive Strings look like such
  if (isString(raw)) {
    formatted = formatPrimitiveNoColor(ctx, raw);
    base = ' ' + '[String: ' + formatted + ']';
  }

  // Make boxed primitive Numbers look like such
  if (isNumber(raw)) {
    formatted = formatPrimitiveNoColor(ctx, raw);
    base = ' ' + '[Number: ' + formatted + ']';
  }

  // Make boxed primitive Booleans look like such
  if (isBoolean(raw)) {
    formatted = formatPrimitiveNoColor(ctx, raw);
    base = ' ' + '[Boolean: ' + formatted + ']';
  }

  if (keys.length === 0 && (!array || value.length === 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value)) {
    // Format -0 as '-0'. Strict equality won't distinguish 0 from -0,
    // so instead we use the fact that 1 / -0 < 0 whereas 1 / 0 > 0 .
    if (value === 0 && 1 / value < 0)
      return ctx.stylize('-0', 'number');
    return ctx.stylize('' + value, 'number');
  }
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
  // es6 symbol primitive
  if (isSymbol(value))
    return ctx.stylize(value.toString(), 'symbol');
}


function formatPrimitiveNoColor(ctx, value) {
  var stylize = ctx.stylize;
  ctx.stylize = stylizeNoColor;
  var str = formatPrimitive(ctx, value);
  ctx.stylize = stylize;
  return str;
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'")
                 .replace(/\\\\/g, '\\');
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var length = output.reduce(function(prev, cur) {
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
var isArray = exports.isArray = Array.isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

function isBuffer(arg) {
  return arg instanceof Buffer;
}
exports.isBuffer = isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}


// Deprecated old stuff.

exports.p = exports.deprecate(function() {
  for (var i = 0, len = arguments.length; i < len; ++i) {
    console.error(exports.inspect(arguments[i]));
  }
}, 'util.p: Use console.error() instead');


exports.exec = exports.deprecate(function() {
  return require('child_process').exec.apply(this, arguments);
}, 'util.exec is now called `child_process.exec`.');


exports.print = exports.deprecate(function() {
  for (var i = 0, len = arguments.length; i < len; ++i) {
    process.stdout.write(String(arguments[i]));
  }
}, 'util.print: Use console.log instead');


exports.puts = exports.deprecate(function() {
  for (var i = 0, len = arguments.length; i < len; ++i) {
    process.stdout.write(arguments[i] + '\n');
  }
}, 'util.puts: Use console.log instead');


exports.debug = exports.deprecate(function(x) {
  process.stderr.write('DEBUG: ' + x + '\n');
}, 'util.debug: Use console.error instead');


exports.error = exports.deprecate(function(x) {
  for (var i = 0, len = arguments.length; i < len; ++i) {
    process.stderr.write(arguments[i] + '\n');
  }
}, 'util.error: Use console.error instead');


exports.pump = exports.deprecate(function(readStream, writeStream, callback) {
  var callbackCalled = false;

  function call(a, b, c) {
    if (callback && !callbackCalled) {
      callback(a, b, c);
      callbackCalled = true;
    }
  }

  readStream.addListener('data', function(chunk) {
    if (writeStream.write(chunk) === false) readStream.pause();
  });

  writeStream.addListener('drain', function() {
    readStream.resume();
  });

  readStream.addListener('end', function() {
    writeStream.end();
  });

  readStream.addListener('close', function() {
    call();
  });

  readStream.addListener('error', function(err) {
    writeStream.end();
    call(err);
  });

  writeStream.addListener('error', function(err) {
    readStream.destroy();
    call(err);
  });
}, 'util.pump(): Use readableStream.pipe() instead');


var uv;
exports._errnoException = function(err, syscall, original) {
  if (isUndefined(uv)) uv = process.binding('uv');
  var errname = uv.errname(err);
  var message = syscall + ' ' + errname;
  if (original)
    message += ' ' + original;
  var e = new Error(message);
  e.code = errname;
  e.errno = errname;
  e.syscall = syscall;
  return e;
};
})(Global.util = {});