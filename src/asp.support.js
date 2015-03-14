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

if (typeof Array.prototype.indexOf != "function") {
  Array.prototype.indexOf = function (searchElement, fromIndex) {
    var index = -1;
    fromIndex = fromIndex * 1 || 0;

    for (var k = 0, length = this.length; k < length; k++) {
      if (k >= fromIndex && this[k] === searchElement) {
          index = k;
          break;
      }
    }
    return index;
  };
}

if (typeof Array.prototype.lastIndexOf != "function") {
  Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
    var index = -1, length = this.length;
    fromIndex = fromIndex * 1 || length - 1;

    for (var k = length - 1; k > -1; k-=1) {
        if (k <= fromIndex && this[k] === searchElement) {
            index = k;
            break;
        }
    }
    return index;
  };
}

if (typeof Array.prototype.forEach != "function") {
  Array.prototype.forEach = function (fn, context) {
    for (var k = 0, length = this.length; k < length; k++) {
      if (typeof fn === "function" && Object.prototype.hasOwnProperty.call(this, k)) {
        fn.call(context, this[k], k, this);
      }
    }
  };
}

if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun/*, thisArg*/) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
};

if ( !String.prototype.trim ){
	String.prototype.trim = function(){
		var header = this;
		if ( header && header.length > 0){
			header = header.replace(/^\s+/, '');
			if ( header && header.length > 0 ){
				header = header.replace(/\s+$/, '');
			}
		}
		return header;
	}
};

if (typeof Array.prototype.map != "function") {
  Array.prototype.map = function (fn, context) {
    var arr = [];
    if (typeof fn === "function") {
      for (var k = 0, length = this.length; k < length; k++) {      
         arr.push(fn.call(context, this[k], k, this));
      }
    }
    return arr;
  };
}

if (typeof Array.prototype.some != "function") {
  Array.prototype.some = function (fn, context) {
	var passed = false;
	if (typeof fn === "function") {
   	  for (var k = 0, length = this.length; k < length; k++) {
		  if (passed === true) break;
		  passed = !!fn.call(context, this[k], k, this);
	  }
    }
	return passed;
  };
}
if (typeof Array.prototype.every != "function") {
  Array.prototype.every = function (fn, context) {
    var passed = true;
    if (typeof fn === "function") {
       for (var k = 0, length = this.length; k < length; k++) {
          if (passed === false) break;
          passed = !!fn.call(context, this[k], k, this);
      }
    }
    return passed;
  };
}
if (typeof Array.prototype.reduce != "function") {
  Array.prototype.reduce = function (callback, initialValue ) {
     var previous = initialValue, k = 0, length = this.length;
     if (typeof initialValue === "undefined") {
        previous = this[0];
        k = 1;
     }
     
    if (typeof callback === "function") {
      for (k; k < length; k++) {
         this.hasOwnProperty(k) && (previous = callback(previous, this[k], k, this));
      }
    }
    return previous;
  };
}

if ( !Function.prototype.bind ) { 
	Function.prototype.bind = function (oThis) { 
		if (typeof this !== "function") { 
			// closest thing possible to the ECMAScript 5 internal IsCallable function 
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable"); 
		} 
		var aArgs = Array.prototype.slice.call(arguments, 1), 
			fToBind = this, 
			fNOP = function () {}, 
			fBound = function () { 
				return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, 
							aArgs.concat(Array.prototype.slice.call(arguments))); 
			}; 
			
		fNOP.prototype = this.prototype; 
		fBound.prototype = new fNOP(); 
		
		return fBound; 
	}; 
} 

var 
	Global = new Object(),
//	__filename = Server.MapPath(Request.ServerVariables("SCRIPT_NAME")),
//	__dirname = Server.MapPath("./"),
	Promise,						// Promise对象实例			ok
	polyfill,						//							ok
	
//	require,						// 模块引用函数				no
//	exports,						// 模块对外接口				no
//	module,							// 模块对象					no
//	contrast,						// 模块转换路径方法			no
//	resolve,						// 模块转换路径模块的具体方法	no
//	include,						// 模板加载方法				no
	
	Class, 							// 系统Class类定义			ok
	console, 						// 系统调试输出类定义			ok
//	task, 							// 系统任务类定义				no
	fs = {}, 						// 系统文件操作类定义			ok
	event, 							// 系统事件定义类				ok
//	http, 							// 系统环境变量类定义			no
//	ajax, 							// 系统请求类定义				no
//	connect, 						// 系统数据库连接类定义			no
//	dbo, 							// 系统数据库操作类定义			no
//	sql, 							// 系统SQL语句生成类定义		no
//	page, 							// 系统双TOP高效分页类定义		no
//	cmd,							// 系统存储过程调用类定义		no
	process,						//							ok
	path = {};						//							ok

if ( typeof JSON === 'undefined' ){ var JSON = new Object(); };