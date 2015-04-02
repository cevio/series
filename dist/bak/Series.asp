<%@LANGUAGE="JAVASCRIPT" CODEPAGE="65001"%>
<%
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

(function(){


// Grunt From /src/underscore.js
//     Underscore.js 1.8.2
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.2';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var isArrayLike = function(collection) {
    var length = collection != null && collection.length;
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = input && input.length; i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, 'length').length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = list && list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    var i = 0, length = array && array.length;
    if (typeof isSorted == 'number') {
      i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
    } else if (isSorted && length) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (item !== item) {
      var index = _.findIndex(slice.call(array, i), _.isNaN);
      return index >= 0 ? index + i : -1;
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    var idx = array ? array.length : 0;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    if (item !== item) {
      return _.findLastIndex(slice.call(array, 0, idx), _.isNaN);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = array != null && array.length;
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createIndexFinder(1);

  _.findLastIndex = createIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    
    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of 
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /\<\%([\s\S]+?)\%\>/g,
    interpolate : /\<\%\=([\s\S]+?)\%\>/g,
    escape      : /\<\%\-([\s\S]+?)\%\>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
  
  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));



// Grunt From /src/underscore-contrib.js
// underscore-contrib v0.3.0
// =========================

// > https://github.com/documentcloud/underscore-contrib
// > (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// > underscore-contrib may be freely distributed under the MIT license.

// Underscore-contrib (underscore.array.builders.js 0.3.0)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------
  
  // Create quick reference variables for speed access to core prototypes.
  var slice   = Array.prototype.slice,
      concat  = Array.prototype.concat;

  var existy = function(x) { return x != null; };

  // Mixing in the array builders
  // ----------------------------

  _.mixin({
    // Concatenates one or more arrays given as arguments.  If given objects and
    // scalars as arguments `cat` will plop them down in place in the result 
    // array.  If given an `arguments` object, `cat` will treat it like an array
    // and concatenate it likewise.
    cat: function() {
      return _.reduce(arguments, function(acc, elem) {
        if (_.isArguments(elem)) {
          return concat.call(acc, slice.call(elem));
        }
        else {
          return concat.call(acc, elem);
        }
      }, []);
    },

    // 'Constructs' an array by putting an element at its front
    cons: function(head, tail) {
      return _.cat([head], tail);
    },

    // Takes an array and chunks it some number of times into
    // sub-arrays of size n.  Allows and optional padding array as
    // the third argument to fill in the tail chunk when n is
    // not sufficient to build chunks of the same size.
    chunk: function(array, n, pad) {
      var p = function(array) {
        if (array == null) return [];

        var part = _.take(array, n);

        if (n === _.size(part)) {
          return _.cons(part, p(_.drop(array, n)));
        }
        else {
          return pad ? [_.take(_.cat(part, pad), n)] : [];
        }
      };

      return p(array);
    },

    // Takes an array and chunks it some number of times into
    // sub-arrays of size n.  If the array given cannot fill the size
    // needs of the final chunk then a smaller chunk is used
    // for the last.
    chunkAll: function(array, n, step) {
      step = (step != null) ? step : n;

      var p = function(array, n, step) {
        if (_.isEmpty(array)) return [];

        return _.cons(_.take(array, n),
                      p(_.drop(array, step), n, step));
      };

      return p(array, n, step);
    },

    // Maps a function over an array and concatenates all of the results.
    mapcat: function(array, fun) {
      return _.cat.apply(null, _.map(array, fun));
    },

    // Returns an array with some item between each element
    // of a given array.
    interpose: function(array, inter) {
      if (!_.isArray(array)) throw new TypeError;
      var sz = _.size(array);
      if (sz === 0) return array;
      if (sz === 1) return array;

      return slice.call(_.mapcat(array, function(elem) { 
        return _.cons(elem, [inter]);
      }), 0, -1);
    },

    // Weaves two or more arrays together
    weave: function(/* args */) {
      if (!_.some(arguments)) return [];
      if (arguments.length == 1) return arguments[0];

      return _.filter(_.flatten(_.zip.apply(null, arguments), true), function(elem) {
        return elem != null;
      });
    },
    interleave: _.weave,

    // Returns an array of a value repeated a certain number of
    // times.
    repeat: function(t, elem) {
      return _.times(t, function() { return elem; });
    },

    // Returns an array built from the contents of a given array repeated
    // a certain number of times.
    cycle: function(t, elems) {
      return _.flatten(_.times(t, function() { return elems; }), true);
    },

    // Returns an array with two internal arrays built from
    // taking an original array and spliting it at an index.
    splitAt: function(array, index) {
      return [_.take(array, index), _.drop(array, index)];
    },

    // Call a function recursively f(f(f(args))) until a second
    // given function goes falsey.  Expects a seed value to start.
    iterateUntil: function(doit, checkit, seed) {
      var ret = [];
      var result = doit(seed);

      while (checkit(result)) {
        ret.push(result);
        result = doit(result);
      }

      return ret;
    },

    // Takes every nth item from an array, returning an array of
    // the results.
    takeSkipping: function(array, n) {
      var ret = [];
      var sz = _.size(array);

      if (n <= 0) return [];
      if (n === 1) return array;

      for(var index = 0; index < sz; index += n) {
        ret.push(array[index]);
      }

      return ret;
    },

    // Returns an array of each intermediate stage of a call to
    // a `reduce`-like function.
    reductions: function(array, fun, init) {
      var ret = [];
      var acc = init;

      _.each(array, function(v,k) {
        acc = fun(acc, array[k]);
        ret.push(acc);
      });

      return ret;
    },

    // Runs its given function on the index of the elements rather than 
    // the elements themselves, keeping all of the truthy values in the end.
    keepIndexed: function(array, pred) {
      return _.filter(_.map(_.range(_.size(array)), function(i) {
        return pred(i, array[i]);
      }),
      existy);
    },

    // Accepts an array-like object (other than strings) as an argument and
    // returns an array whose elements are in the reverse order. Unlike the
    // built-in `Array.prototype.reverse` method, this does not mutate the
    // original object. Note: attempting to use this method on a string will
    // result in a `TypeError`, as it cannot properly reverse unicode strings.

    reverseOrder: function(obj) {
      if (typeof obj == 'string')
        throw new TypeError('Strings cannot be reversed by _.reverseOrder');
      return slice.call(obj).reverse();
    }
  });

})(this);

// Underscore-contrib (underscore.array.selectors.js 0.3.0)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  // Create quick reference variables for speed access to core prototypes.
  var slice   = Array.prototype.slice,
      concat  = Array.prototype.concat;

  var existy = function(x) { return x != null; };
  var truthy = function(x) { return (x !== false) && existy(x); };
  var isSeq = function(x) { return (_.isArray(x)) || (_.isArguments(x)); };

  // Mixing in the array selectors
  // ----------------------------

  _.mixin({
    // Returns the second element of an array. Passing **n** will return all but
    // the first of the head N values in the array.  The **guard** check allows it
    // to work with `_.map`.
    second: function(array, n, guard) {
      if (array == null) return void 0;
      return (n != null) && !guard ? slice.call(array, 1, n) : array[1];
    },

    // Returns the third element of an array. Passing **n** will return all but
    // the first two of the head N values in the array.  The **guard** check allows it
    // to work with `_.map`.
    third: function(array, n, guard) {
      if (array == null) return void 0;
      return (n != null) && !guard ? slice.call(array, 2, n) : array[2];
    },

    // A function to get at an index into an array
    nth: function(array, index, guard) {
      if ((index != null) && !guard) return array[index];
    },

    // Takes all items in an array while a given predicate returns truthy.
    takeWhile: function(array, pred) {
      if (!isSeq(array)) throw new TypeError;

      var sz = _.size(array);

      for (var index = 0; index < sz; index++) {
        if(!truthy(pred(array[index]))) {
          break;
        }
      }

      return _.take(array, index);
    },

    // Drops all items from an array while a given predicate returns truthy.
    dropWhile: function(array, pred) {
      if (!isSeq(array)) throw new TypeError;

      var sz = _.size(array);

      for (var index = 0; index < sz; index++) {
        if(!truthy(pred(array[index])))
          break;
      }

      return _.drop(array, index);
    },

    // Returns an array with two internal arrays built from
    // taking an original array and spliting it at the index
    // where a given function goes falsey.
    splitWith: function(array, pred) {
      return [_.takeWhile(array, pred), _.dropWhile(array, pred)];
    },

    // Takes an array and partitions it as the given predicate changes
    // truth sense.
    partitionBy: function(array, fun){
      if (_.isEmpty(array) || !existy(array)) return [];

      var fst    = _.first(array);
      var fstVal = fun(fst);
      var run    = concat.call([fst], _.takeWhile(_.rest(array), function(e) {
        return _.isEqual(fstVal, fun(e));
      }));

      return concat.call([run], _.partitionBy(_.drop(array, _.size(run)), fun));
    },

    // Returns the 'best' value in an array based on the result of a
    // given function.
    best: function(array, fun) {
      return _.reduce(array, function(x, y) {
        return fun(x, y) ? x : y;
      });
    },

    // Returns an array of existy results of a function over an source array.
    keep: function(array, fun) {
      if (!isSeq(array)) throw new TypeError("expected an array as the first argument");

      return _.filter(_.map(array, function(e) {
        return fun(e);
      }), existy);
    }
  });

})(this);

// Underscore-contrib (underscore.collections.walk.js 0.3.0)
// (c) 2013 Patrick Dubroy
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  // An internal object that can be returned from a visitor function to
  // prevent a top-down walk from walking subtrees of a node.
  var stopRecursion = {};

  // An internal object that can be returned from a visitor function to
  // cause the walk to immediately stop.
  var stopWalk = {};

  var notTreeError = 'Not a tree: same object found in two different branches';

  // Implements the default traversal strategy: if `obj` is a DOM node, walk
  // its DOM children; otherwise, walk all the objects it references.
  function defaultTraversal(obj) {
    return _.isElement(obj) ? obj.children : obj;
  }

  // Walk the tree recursively beginning with `root`, calling `beforeFunc`
  // before visiting an objects descendents, and `afterFunc` afterwards.
  // If `collectResults` is true, the last argument to `afterFunc` will be a
  // collection of the results of walking the node's subtrees.
  function walkImpl(root, traversalStrategy, beforeFunc, afterFunc, context, collectResults) {
    var visited = [];
    return (function _walk(value, key, parent) {
      // Keep track of objects that have been visited, and throw an exception
      // when trying to visit the same object twice.
      if (_.isObject(value)) {
        if (visited.indexOf(value) >= 0) throw new TypeError(notTreeError);
        visited.push(value);
      }

      if (beforeFunc) {
        var result = beforeFunc.call(context, value, key, parent);
        if (result === stopWalk) return stopWalk;
        if (result === stopRecursion) return;
      }

      var subResults;
      var target = traversalStrategy(value);
      if (_.isObject(target) && !_.isEmpty(target)) {
        // If collecting results from subtrees, collect them in the same shape
        // as the parent node.
        if (collectResults) subResults = _.isArray(value) ? [] : {};

        var stop = _.any(target, function(obj, key) {
          var result = _walk(obj, key, value);
          if (result === stopWalk) return true;
          if (subResults) subResults[key] = result;
        });
        if (stop) return stopWalk;
      }
      if (afterFunc) return afterFunc.call(context, value, key, parent, subResults);
    })(root);
  }

  // Internal helper providing the implementation for `pluck` and `pluckRec`.
  function pluck(obj, propertyName, recursive) {
    var results = [];
    this.preorder(obj, function(value, key) {
      if (!recursive && key == propertyName)
        return stopRecursion;
      if (_.has(value, propertyName))
        results[results.length] = value[propertyName];
    });
    return results;
  }

  var exports = {
    // Performs a preorder traversal of `obj` and returns the first value
    // which passes a truth test.
    find: function(obj, visitor, context) {
      var result;
      this.preorder(obj, function(value, key, parent) {
        if (visitor.call(context, value, key, parent)) {
          result = value;
          return stopWalk;
        }
      }, context);
      return result;
    },

    // Recursively traverses `obj` and returns all the elements that pass a
    // truth test. `strategy` is the traversal function to use, e.g. `preorder`
    // or `postorder`.
    filter: function(obj, strategy, visitor, context) {
      var results = [];
      if (obj == null) return results;
      strategy(obj, function(value, key, parent) {
        if (visitor.call(context, value, key, parent)) results.push(value);
      }, null, this._traversalStrategy);
      return results;
    },

    // Recursively traverses `obj` and returns all the elements for which a
    // truth test fails.
    reject: function(obj, strategy, visitor, context) {
      return this.filter(obj, strategy, function(value, key, parent) {
        return !visitor.call(context, value, key, parent);
      });
    },

    // Produces a new array of values by recursively traversing `obj` and
    // mapping each value through the transformation function `visitor`.
    // `strategy` is the traversal function to use, e.g. `preorder` or
    // `postorder`.
    map: function(obj, strategy, visitor, context) {
      var results = [];
      strategy(obj, function(value, key, parent) {
        results[results.length] = visitor.call(context, value, key, parent);
      }, null, this._traversalStrategy);
      return results;
    },

    // Return the value of properties named `propertyName` reachable from the
    // tree rooted at `obj`. Results are not recursively searched; use
    // `pluckRec` for that.
    pluck: function(obj, propertyName) {
      return pluck.call(this, obj, propertyName, false);
    },

    // Version of `pluck` which recursively searches results for nested objects
    // with a property named `propertyName`.
    pluckRec: function(obj, propertyName) {
      return pluck.call(this, obj, propertyName, true);
    },

    // Recursively traverses `obj` in a depth-first fashion, invoking the
    // `visitor` function for each object only after traversing its children.
    // `traversalStrategy` is intended for internal callers, and is not part
    // of the public API.
    postorder: function(obj, visitor, context, traversalStrategy) {
      traversalStrategy = traversalStrategy || this._traversalStrategy;
      walkImpl(obj, traversalStrategy, null, visitor, context);
    },

    // Recursively traverses `obj` in a depth-first fashion, invoking the
    // `visitor` function for each object before traversing its children.
    // `traversalStrategy` is intended for internal callers, and is not part
    // of the public API.
    preorder: function(obj, visitor, context, traversalStrategy) {
      traversalStrategy = traversalStrategy || this._traversalStrategy;
      walkImpl(obj, traversalStrategy, visitor, null, context);
    },

    // Builds up a single value by doing a post-order traversal of `obj` and
    // calling the `visitor` function on each object in the tree. For leaf
    // objects, the `memo` argument to `visitor` is the value of the `leafMemo`
    // argument to `reduce`. For non-leaf objects, `memo` is a collection of
    // the results of calling `reduce` on the object's children.
    reduce: function(obj, visitor, leafMemo, context) {
      var reducer = function(value, key, parent, subResults) {
        return visitor(subResults || leafMemo, value, key, parent);
      };
      return walkImpl(obj, this._traversalStrategy, null, reducer, context, true);
    }
  };

  // Set up aliases to match those in underscore.js.
  exports.collect = exports.map;
  exports.detect = exports.find;
  exports.select = exports.filter;

  // Returns an object containing the walk functions. If `traversalStrategy`
  // is specified, it is a function determining how objects should be
  // traversed. Given an object, it returns the object to be recursively
  // walked. The default strategy is equivalent to `_.identity` for regular
  // objects, and for DOM nodes it returns the node's DOM children.
  _.walk = function(traversalStrategy) {
    var walker = _.clone(exports);

    // Bind all of the public functions in the walker to itself. This allows
    // the traversal strategy to be dynamically scoped.
    _.bindAll.apply(null, [walker].concat(_.keys(walker)));

    walker._traversalStrategy = traversalStrategy || defaultTraversal;
    return walker;
  };

  // Use `_.walk` as a namespace to hold versions of the walk functions which
  // use the default traversal strategy.
  _.extend(_.walk, _.walk());
})(this);

// Underscore-contrib (underscore.function.arity.js 0.3.0)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  function enforcesUnary (fn) {
    return function mustBeUnary () {
      if (arguments.length === 1) {
        return fn.apply(this, arguments);
      }
      else throw new RangeError('Only a single argument may be accepted.');

    };
  }

  // Curry
  // -------
  var curry = (function () {
    function collectArgs(func, that, argCount, args, newArg, reverse) {
      if (reverse === true) {
        args.unshift(newArg);
      } else {
        args.push(newArg);
      }
      if (args.length == argCount) {
        return func.apply(that, args);
      } else {
        return enforcesUnary(function () {
          return collectArgs(func, that, argCount, args.slice(0), arguments[0], reverse);
        });
      }
    }
    return function curry (func, reverse) {
      var that = this;
      return enforcesUnary(function () {
        return collectArgs(func, that, func.length, [], arguments[0], reverse);
      });
    };
  }());

  // Enforce Arity
  // --------------------
  var enforce = (function () {
    var CACHE = [];
    return function enforce (func) {
      if (typeof func !== 'function') {
        throw new Error('Argument 1 must be a function.');
      }
      var funcLength = func.length;
      if (CACHE[funcLength] === undefined) {
        CACHE[funcLength] = function (enforceFunc) {
          return function () {
            if (arguments.length !== funcLength) {
              throw new RangeError(funcLength + ' arguments must be applied.');
            }
            return enforceFunc.apply(this, arguments);
          };
        };
      }
      return CACHE[funcLength](func);
    };
  }());

  // Mixing in the arity functions
  // -----------------------------

  _.mixin({
    // ### Fixed arguments

    // Fixes the arguments to a function based on the parameter template defined by
    // the presence of values and the `_` placeholder.
    fix: function(fun) {
      var fixArgs = _.rest(arguments);

      var f = function() {
        var args = fixArgs.slice();
        var arg = 0;

        for ( var i = 0; i < (args.length || arg < arguments.length); i++ ) {
          if ( args[i] === _ ) {
            args[i] = arguments[arg++];
          }
        }

        return fun.apply(null, args);
      };

      f._original = fun;

      return f;
    },

    unary: function (fun) {
      return function unary (a) {
        return fun.call(this, a);
      };
    },

    binary: function (fun) {
      return function binary (a, b) {
        return fun.call(this, a, b);
      };
    },

    ternary: function (fun) {
      return function ternary (a, b, c) {
        return fun.call(this, a, b, c);
      };
    },

    quaternary: function (fun) {
      return function quaternary (a, b, c, d) {
        return fun.call(this, a, b, c, d);
      };
    },

    // Flexible curry function with strict arity.
    // Argument application left to right.
    // source: https://github.com/eborden/js-curry
    curry: curry,

    // Flexible right to left curry with strict arity.
    rCurry: function (func) {
      return curry.call(this, func, true);
    },


    curry2: function (fun) {
      return enforcesUnary(function curried (first) {
        return enforcesUnary(function (last) {
          return fun.call(this, first, last);
        });
      });
    },

    curry3: function (fun) {
      return enforcesUnary(function (first) {
        return enforcesUnary(function (second) {
          return enforcesUnary(function (last) {
            return fun.call(this, first, second, last);
          });
        });
      });
    },

      // reverse currying for functions taking two arguments.
    rcurry2: function (fun) {
      return enforcesUnary(function (last) {
        return enforcesUnary(function (first) {
          return fun.call(this, first, last);
        });
      });
    },

    rcurry3: function (fun) {
      return enforcesUnary(function (last) {
        return enforcesUnary(function (second) {
          return enforcesUnary(function (first) {
            return fun.call(this, first, second, last);
          });
        });
      });
    },
    // Dynamic decorator to enforce function arity and defeat varargs.
    enforce: enforce
  });

  _.arity = (function () {
    // Allow 'new Function', as that is currently the only reliable way
    // to manipulate function.length
    /* jshint -W054 */
    var FUNCTIONS = {};
    return function arity (numberOfArgs, fun) {
      if (FUNCTIONS[numberOfArgs] == null) {
        var parameters = new Array(numberOfArgs);
        for (var i = 0; i < numberOfArgs; ++i) {
          parameters[i] = "__" + i;
        }
        var pstr = parameters.join();
        var code = "return function ("+pstr+") { return fun.apply(this, arguments); };";
        FUNCTIONS[numberOfArgs] = new Function(['fun'], code);
      }
      if (fun == null) {
        return function (fun) { return arity(numberOfArgs, fun); };
      }
      else return FUNCTIONS[numberOfArgs](fun);
    };
  })();

})(this);

// Underscore-contrib (underscore.function.combinators.js 0.3.0)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  var existy = function(x) { return x != null; };
  var truthy = function(x) { return (x !== false) && existy(x); };
  var __reverse = [].reverse;
  var __slice = [].slice;
  var __map = [].map;
  var curry2 = function (fun) {
    return function curried (first, optionalLast) {
      if (arguments.length === 1) {
        return function (last) {
          return fun(first, last);
        };
      }
      else return fun(first, optionalLast);
    };
  };
  
  // n.b. depends on underscore.function.arity.js
    
  // Takes a target function and a mapping function. Returns a function
  // that applies the mapper to its arguments before evaluating the body.
  function baseMapArgs (fun, mapFun) {
    return _.arity(fun.length, function () {
      return fun.apply(this, __map.call(arguments, mapFun));
    });
  }
  
  // Mixing in the combinator functions
  // ----------------------------------

  _.mixin({
    // Provide "always" alias for backwards compatibility
    always: _.constant,

    // Takes some number of functions, either as an array or variadically
    // and returns a function that takes some value as its first argument 
    // and runs it through a pipeline of the original functions given.
    pipeline: function(/*, funs */){
      var funs = (_.isArray(arguments[0])) ? arguments[0] : arguments;

      return function(seed) {
        return _.reduce(funs,
                        function(l,r) { return r(l); },
                        seed);
      };
    },

    // Composes a bunch of predicates into a single predicate that
    // checks all elements of an array for conformance to all of the
    // original predicates.
    conjoin: function(/* preds */) {
      var preds = arguments;

      return function(array) {
        return _.every(array, function(e) {
          return _.every(preds, function(p) {
            return p(e);
          });
        });
      };
    },

    // Composes a bunch of predicates into a single predicate that
    // checks all elements of an array for conformance to any of the
    // original predicates.
    disjoin: function(/* preds */) {
      var preds = arguments;

      return function(array) {
        return _.some(array, function(e) {
          return _.some(preds, function(p) {
            return p(e);
          });
        });
      };
    },

    // Takes a predicate-like and returns a comparator (-1,0,1).
    comparator: function(fun) {
      return function(x, y) {
        if (truthy(fun(x, y)))
          return -1;
        else if (truthy(fun(y, x)))
          return 1;
        else
          return 0;
      };
    },

    // Returns a function that reverses the sense of a given predicate-like.
    complement: function(pred) {
      return function() {
        return !pred.apply(this, arguments);
      };
    },

    // Takes a function expecting varargs and
    // returns a function that takes an array and
    // uses its elements as the args to  the original
    // function
    splat: function(fun) {
      return function(array) {
        return fun.apply(this, array);
      };
    },

    // Takes a function expecting an array and returns
    // a function that takes varargs and wraps all
    // in an array that is passed to the original function.
    unsplat: function(fun) {
      var funLength = fun.length;

      if (funLength < 1) {
        return fun;
      }
      else if (funLength === 1)  {
        return function () {
          return fun.call(this, __slice.call(arguments, 0));
        };
      }
      else {
        return function () {
          var numberOfArgs = arguments.length,
              namedArgs = __slice.call(arguments, 0, funLength - 1),
              numberOfMissingNamedArgs = Math.max(funLength - numberOfArgs - 1, 0),
              argPadding = new Array(numberOfMissingNamedArgs),
              variadicArgs = __slice.call(arguments, fun.length - 1);

          return fun.apply(this, namedArgs.concat(argPadding).concat([variadicArgs]));
        };
      }
    },

    // Same as unsplat, but the rest of the arguments are collected in the

    // first parameter, e.g. unsplatl( function (args, callback) { ... ]})
    unsplatl: function(fun) {
      var funLength = fun.length;

      if (funLength < 1) {
        return fun;
      }
      else if (funLength === 1)  {
        return function () {
          return fun.call(this, __slice.call(arguments, 0));
        };
      }
      else {
        return function () {
          var numberOfArgs = arguments.length,
              namedArgs = __slice.call(arguments, Math.max(numberOfArgs - funLength + 1, 0)),
              variadicArgs = __slice.call(arguments, 0, Math.max(numberOfArgs - funLength + 1, 0));

          return fun.apply(this, [variadicArgs].concat(namedArgs));
        };
      }
    },
    
    // map the arguments of a function
    mapArgs: curry2(baseMapArgs),

    // Returns a function that returns an array of the calls to each
    // given function for some arguments.
    juxt: function(/* funs */) {
      var funs = arguments;

      return function(/* args */) {
        var args = arguments;
        return _.map(funs, function(f) {
          return f.apply(this, args);
        }, this);
      };
    },

    // Returns a function that protects a given function from receiving
    // non-existy values.  Each subsequent value provided to `fnull` acts
    // as the default to the original function should a call receive non-existy
    // values in the defaulted arg slots.
    fnull: function(fun /*, defaults */) {
      var defaults = _.rest(arguments);

      return function(/*args*/) {
        var args = _.toArray(arguments);
        var sz = _.size(defaults);

        for(var i = 0; i < sz; i++) {
          if (!existy(args[i]))
            args[i] = defaults[i];
        }

        return fun.apply(this, args);
      };
    },

    // Flips the first two args of a function
    flip2: function(fun) {
      return function(/* args */) {
        var flipped = __slice.call(arguments);
        flipped[0] = arguments[1];
        flipped[1] = arguments[0];

        return fun.apply(this, flipped);
      };
    },

    // Flips an arbitrary number of args of a function
    flip: function(fun) {
      return function(/* args */) {
        var reversed = __reverse.call(arguments);

        return fun.apply(this, reversed);
      };
    },

    // Takes a method-style function (one which uses `this`) and pushes
    // `this` into the argument list. The returned function uses its first
    // argument as the receiver/context of the original function, and the rest
    // of the arguments are used as the original's entire argument list.
    functionalize: function(method) {
      return function(ctx /*, args */) {
        return method.apply(ctx, _.rest(arguments));
      };
    },

    // Takes a function and pulls the first argument out of the argument
    // list and into `this` position. The returned function calls the original
    // with its receiver (`this`) prepending the argument list. The original
    // is called with a receiver of `null`.
    methodize: function(func) {
      return function(/* args */) {
        return func.apply(null, _.cons(this, arguments));
      };
    },
    
    k: _.always,
    t: _.pipeline
  });
  
  _.unsplatr = _.unsplat;
    
  // map the arguments of a function, takes the mapping function
  // first so it can be used as a combinator
  _.mapArgsWith = curry2(_.flip(baseMapArgs));
  
  // Returns function property of object by name, bound to object
  _.bound = function(obj, fname) {
    var fn = obj[fname];
    if (!_.isFunction(fn))
      throw new TypeError("Expected property to be a function");
    return _.bind(fn, obj);
  };

})(this);

// Underscore-contrib (underscore.function.dispatch.js 0.3.0)
// (c) 2013 Justin Ridgewell
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  // Create quick reference variable for speed.
  var slice   = Array.prototype.slice;

  // Mixing in the attempt function
  // ------------------------

  _.mixin({
    // If object is not undefined or null then invoke the named `method` function
    // with `object` as context and arguments; otherwise, return undefined.
    attempt: function(object, method) {
      if (object == null) return void 0;
      var func = object[method];
      var args = slice.call(arguments, 2);
      return _.isFunction(func) ? func.apply(object, args) : void 0;
    }
  });

})(this);

// Underscore-contrib (underscore.function.iterators.js 0.3.0)
// (c) 2013 Michael Fogus and DocumentCloud Inc.
// Underscore-contrib may be freely distributed under the MIT license.

(function(root, undefined) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------
  
  var HASNTBEENRUN = {};
  
  function unary (fun) {
    return function (first) {
      return fun.call(this, first);
    };
  }
  
  function binary (fun) {
    return function (first, second) {
      return fun.call(this, first, second);
    };
  }
  
  // Mixing in the iterator functions
  // --------------------------------

  function foldl (iter, binaryFn, seed) {
    var state, element;
    if (seed !== void 0) {
      state = seed;
    }
    else {
      state = iter();
    }
    element = iter();
    while (element != null) {
      state = binaryFn.call(element, state, element);
      element = iter();
    }
    return state;
  }
  
  function unfold (seed, unaryFn) {
    var state = HASNTBEENRUN;
    return function () {
      if (state === HASNTBEENRUN) {
        state = seed;
      } else if (state != null) {
        state = unaryFn.call(state, state);
      }

      return state;
    };
  }
  
  // note that the unfoldWithReturn behaves differently than
  // unfold with respect to the first value returned
  function unfoldWithReturn (seed, unaryFn) {
    var state = seed,
        pair,
        value;
    return function () {
      if (state != null) {
        pair = unaryFn.call(state, state);
        value = pair[1];
        state = value != null ? pair[0] : void 0;
        return value;
      }
      else return void 0;
    };
  }

  function accumulate (iter, binaryFn, initial) {
    var state = initial;
    return function () {
      var element = iter();
      if (element == null) {
        return element;
      }
      else {
        if (state === void 0) {
          state = element;
        } else {
          state = binaryFn.call(element, state, element);
        }
        
        return state;
      }
    };
  }
  
  function accumulateWithReturn (iter, binaryFn, initial) {
    var state = initial,
        stateAndReturnValue,
        element;
    return function () {
      element = iter();
      if (element == null) {
        return element;
      }
      else {
        if (state === void 0) {
          state = element;
          return state;
        }
        else {
          stateAndReturnValue = binaryFn.call(element, state, element);
          state = stateAndReturnValue[0];
          return stateAndReturnValue[1];
        }
      }
    };
  }
  
  function map (iter, unaryFn) {
    return function() {
      var element;
      element = iter();
      if (element != null) {
        return unaryFn.call(element, element);
      } else {
        return void 0;
      }
    };
  }

  function mapcat(iter, unaryFn) {
    var lastIter = null;
    return function() {
      var element;
      var gen;
      if (lastIter == null) {
        gen = iter();
        if (gen == null) {
          lastIter = null;
          return void 0;
        }
        lastIter = unaryFn.call(gen, gen);
      }
      while (element == null) {
        element = lastIter();
        if (element == null) {
          gen = iter();
          if (gen == null) {
            lastIter = null;
            return void 0;
          }
          else {
            lastIter = unaryFn.call(gen, gen);
          }
        }
      }
      return element;
    };
  }

  function select (iter, unaryPredicateFn) {
    return function() {
      var element;
      element = iter();
      while (element != null) {
        if (unaryPredicateFn.call(element, element)) {
          return element;
        }
        element = iter();
      }
      return void 0;
    };
  }
  
  function reject (iter, unaryPredicateFn) {
    return select(iter, function (something) {
      return !unaryPredicateFn(something);
    });
  }
  
  function find (iter, unaryPredicateFn) {
    return select(iter, unaryPredicateFn)();
  }

  function slice (iter, numberToDrop, numberToTake) {
    var count = 0;
    while (numberToDrop-- > 0) {
      iter();
    }
    if (numberToTake != null) {
      return function() {
        if (++count <= numberToTake) {
          return iter();
        } else {
          return void 0;
        }
      };
    }
    else return iter;
  }
  
  function drop (iter, numberToDrop) {
    return slice(iter, numberToDrop == null ? 1 : numberToDrop);
  }

  function take (iter, numberToTake) {
    return slice(iter, 0, numberToTake == null ? 1 : numberToTake);
  }

  function List (array) {
    var index = 0;
    return function() {
      return array[index++];
    };
  }
  
  function Tree (array) {
    var index, myself, state;
    index = 0;
    state = [];
    myself = function() {
      var element, tempState;
      element = array[index++];
      if (element instanceof Array) {
        state.push({
          array: array,
          index: index
        });
        array = element;
        index = 0;
        return myself();
      } else if (element === void 0) {
        if (state.length > 0) {
          tempState = state.pop();
          array = tempState.array;
          index = tempState.index;
          return myself();
        } else {
          return void 0;
        }
      } else {
        return element;
      }
    };
    return myself;
  }
  
  function K (value) {
    return function () {
      return value;
    };
  }

  function upRange (from, to, by) {
    return function () {
      var was;
    
      if (from > to) {
        return void 0;
      }
      else {
        was = from;
        from = from + by;
        return was;
      }
    };
  }

  function downRange (from, to, by) {
    return function () {
      var was;
    
      if (from < to) {
        return void 0;
      }
      else {
        was = from;
        from = from - by;
        return was;
      }
    };
  }
  
  function range (from, to, by) {
    if (from == null) {
      return upRange(1, Infinity, 1);
    }
    else if (to == null) {
      return upRange(from, Infinity, 1);
    }
    else if (by == null) {
      if (from <= to) {
        return upRange(from, to, 1);
      }
      else return downRange(from, to, 1);
    }
    else if (by > 0) {
      return upRange(from, to, by);
    }
    else if (by < 0) {
      return downRange(from, to, Math.abs(by));
    }
    else return k(from);
  }
  
  var numbers = unary(range);

  _.iterators = {
    accumulate: accumulate,
    accumulateWithReturn: accumulateWithReturn,
    foldl: foldl,
    reduce: foldl,
    unfold: unfold,
    unfoldWithReturn: unfoldWithReturn,
    map: map,
    mapcat: mapcat,
    select: select,
    reject: reject,
    filter: select,
    find: find,
    slice: slice,
    drop: drop,
    take: take,
    List: List,
    Tree: Tree,
    constant: K,
    K: K,
    numbers: numbers,
    range: range
  };

})(this, void 0);

// Underscore-contrib (underscore.function.predicates.js 0.3.0)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------


  // Mixing in the predicate functions
  // ---------------------------------

  _.mixin({
    // A wrapper around instanceof
    isInstanceOf: function(x, t) { return (x instanceof t); },

    // An associative object is one where its elements are
    // accessed via a key or index. (i.e. array and object)
    isAssociative: function(x) { return _.isArray(x) || _.isObject(x) || _.isArguments(x); },

    // An indexed object is anything that allows numerical index for
    // accessing its elements (e.g. arrays and strings). NOTE: Underscore
    // does not support cross-browser consistent use of strings as array-like
    // objects, so be wary in IE 8 when using  String objects and IE<8.
    // on string literals & objects.
    isIndexed: function(x) { return _.isArray(x) || _.isString(x) || _.isArguments(x); },

    // A seq is something considered a sequential composite type (i.e. arrays and `arguments`).
    isSequential: function(x) { return (_.isArray(x)) || (_.isArguments(x)); },

    // Check if an object is an object literal, since _.isObject(function() {}) === _.isObject([]) === true
    isPlainObject: function(x) { return _.isObject(x) && x.constructor === root.Object; },

    // These do what you think that they do
    isZero: function(x) { return 0 === x; },
    isEven: function(x) { return _.isFinite(x) && (x & 1) === 0; },
    isOdd: function(x) { return _.isFinite(x) && !_.isEven(x); },
    isPositive: function(x) { return x > 0; },
    isNegative: function(x) { return x < 0; },
    isValidDate: function(x) { return _.isDate(x) && !_.isNaN(x.getTime()); },

    // A numeric is a variable that contains a numeric value, regardless its type
    // It can be a String containing a numeric value, exponential notation, or a Number object
    // See here for more discussion: http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric/1830844#1830844
    isNumeric: function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },

    // An integer contains an optional minus sign to begin and only the digits 0-9
    // Objects that can be parsed that way are also considered ints, e.g. "123"
    // Floats that are mathematically equal to integers are considered integers, e.g. 1.0
    // See here for more discussion: http://stackoverflow.com/questions/1019515/javascript-test-for-an-integer
    isInteger: function(i) {
      return _.isNumeric(i) && i % 1 === 0;
    },

    // A float is a numbr that is not an integer.
    isFloat: function(n) {
      return _.isNumeric(n) && !_.isInteger(n);
    },

    // checks if a string is a valid JSON
    isJSON: function(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },

    // Returns true if its arguments are monotonically
    // increaing values; false otherwise.
    isIncreasing: function() {
      var count = _.size(arguments);
      if (count === 1) return true;
      if (count === 2) return arguments[0] < arguments[1];

      for (var i = 1; i < count; i++) {
        if (arguments[i-1] >= arguments[i]) {
          return false;
        }
      }

      return true;
    },

    // Returns true if its arguments are monotonically
    // decreaing values; false otherwise.
    isDecreasing: function() {
      var count = _.size(arguments);
      if (count === 1) return true;
      if (count === 2) return arguments[0] > arguments[1];

      for (var i = 1; i < count; i++) {
        if (arguments[i-1] <= arguments[i]) {
          return false;
        }
      }

      return true;
    }
  });

})(this);

// Underscore-contrib (underscore.object.builders.js 0.3.0)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  // Create quick reference variables for speed access to core prototypes.
  var slice   = Array.prototype.slice,
      concat  = Array.prototype.concat;

  var existy = function(x) { return x != null; };
  var truthy = function(x) { return (x !== false) && existy(x); };
  var isAssociative = function(x) { return _.isArray(x) || _.isObject(x); };
  var curry2 = function(fun) {
    return function(last) {
      return function(first) {
        return fun(first, last);
      };
    };
  };

  // Mixing in the object builders
  // ----------------------------

  _.mixin({
    // Merges two or more objects starting with the left-most and
    // applying the keys right-word
    // {any:any}* -> {any:any}
    merge: function(/* objs */){
      var dest = _.some(arguments) ? {} : null;

      if (truthy(dest)) {
        _.extend.apply(null, concat.call([dest], _.toArray(arguments)));
      }

      return dest;
    },

    // Takes an object and another object of strings to strings where the second
    // object describes the key renaming to occur in the first object.
    renameKeys: function(obj, kobj) {
      return _.reduce(kobj, function(o, nu, old) {
        if (existy(obj[old])) {
          o[nu] = obj[old];
          return o;
        }
        else
          return o;
      },
      _.omit.apply(null, concat.call([obj], _.keys(kobj))));
    },

    // Snapshots an object deeply. Based on the version by
    // [Keith Devens](http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone)
    // until we can find a more efficient and robust way to do it.
    snapshot: function(obj) {
      if(obj == null || typeof(obj) != 'object') {
        return obj;
      }

      var temp = new obj.constructor();

      for(var key in obj) {
        if (obj.hasOwnProperty(key)) {
          temp[key] = _.snapshot(obj[key]);
        }
      }

      return temp;
    },

    // Updates the value at any depth in a nested object based on the
    // path described by the keys given.  The function provided is supplied
    // the current value and is expected to return a value for use as the
    // new value.  If no keys are provided, then the object itself is presented
    // to the given function.
    updatePath: function(obj, fun, ks, defaultValue) {
      if (!isAssociative(obj)) throw new TypeError("Attempted to update a non-associative object.");
      if (!existy(ks)) return fun(obj);

      var deepness = _.isArray(ks);
      var keys     = deepness ? ks : [ks];
      var ret      = deepness ? _.snapshot(obj) : _.clone(obj);
      var lastKey  = _.last(keys);
      var target   = ret;

      _.each(_.initial(keys), function(key) {
        if (defaultValue && !_.has(target, key)) {
          target[key] = _.clone(defaultValue);
        }
        target = target[key];
      });

      target[lastKey] = fun(target[lastKey]);
      return ret;
    },

    // Sets the value at any depth in a nested object based on the
    // path described by the keys given.
    setPath: function(obj, value, ks, defaultValue) {
      if (!existy(ks)) throw new TypeError("Attempted to set a property at a null path.");

      return _.updatePath(obj, function() { return value; }, ks, defaultValue);
    },

    // Returns an object where each element of an array is keyed to
    // the number of times that it occurred in said array.
    frequencies: curry2(_.countBy)(_.identity)
  });

})(this);

// Underscore-contrib (underscore.object.selectors.js 0.3.0)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  // Create quick reference variables for speed access to core prototypes.
  var concat  = Array.prototype.concat;
  var ArrayProto = Array.prototype;
  var slice = ArrayProto.slice;

  // Mixing in the object selectors
  // ------------------------------

  _.mixin({
    // Returns a function that will attempt to look up a named field
    // in any object that it's given.
    accessor: function(field) {
      return function(obj) {
        return (obj && obj[field]);
      };
    },

    // Given an object, returns a function that will attempt to look up a field
    // that it's given.
    dictionary: function (obj) {
      return function(field) {
        return (obj && field && obj[field]);
      };
    },

    // Like `_.pick` except that it takes an array of keys to pick.
    selectKeys: function (obj, ks) {
      return _.pick.apply(null, concat.call([obj], ks));
    },

    // Returns the key/value pair for a given property in an object, undefined if not found.
    kv: function(obj, key) {
      if (_.has(obj, key)) {
        return [key, obj[key]];
      }

      return void 0;
    },

    // Gets the value at any depth in a nested object based on the
    // path described by the keys given. Keys may be given as an array
    // or as a dot-separated string.
    getPath: function getPath (obj, ks) {
      if (typeof ks == "string") ks = ks.split(".");

      // If we have reached an undefined property
      // then stop executing and return undefined
      if (obj === undefined) return void 0;

      // If the path array has no more elements, we've reached
      // the intended property and return its value
      if (ks.length === 0) return obj;

      // If we still have elements in the path array and the current
      // value is null, stop executing and return undefined
      if (obj === null) return void 0;

      return getPath(obj[_.first(ks)], _.rest(ks));
    },

    // Returns a boolean indicating whether there is a property
    // at the path described by the keys given
    hasPath: function hasPath (obj, ks) {
      if (typeof ks == "string") ks = ks.split(".");

      var numKeys = ks.length;

      if (obj == null && numKeys > 0) return false;

      if (!(ks[0] in obj)) return false;

      if (numKeys === 1) return true;

      return hasPath(obj[_.first(ks)], _.rest(ks));
    },

    pickWhen: function(obj, pred) {
      var copy = {};

      _.each(obj, function(value, key) {
        if (pred(obj[key])) copy[key] = obj[key];
      });

      return copy;
    },

    omitWhen: function(obj, pred) {
      return _.pickWhen(obj, function(e) { return !pred(e); });
    }

  });

})(this);

// Underscore-contrib (underscore.util.existential.js 0.3.0)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  
  // Mixing in the truthiness
  // ------------------------

  _.mixin({
    exists: function(x) { return x != null; },
    truthy: function(x) { return (x !== false) && _.exists(x); },
    falsey: function(x) { return !_.truthy(x); },
    not:    function(b) { return !b; },
    firstExisting: function() {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] != null) return arguments[i];
      }
    }
  });

})(this);

// Underscore-contrib (underscore.function.arity.js 0.3.0)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Setup for variadic operators
  // ----------------------------

  // Turn a binary math operator into a variadic operator
  function variadicMath(operator) {
    return function() {
      return _.reduce(arguments, operator);
    };
  }

  // Turn a binary comparator into a variadic comparator
  function variadicComparator(comparator) {
    return function() {
      var result;
      for (var i = 0; i < arguments.length - 1; i++) {
        result = comparator(arguments[i], arguments[i + 1]);
        if (result === false) return result;
      }
      return result; 
    };
  }

  // Turn a boolean-returning function into one with the opposite meaning
  function invert(fn) {
    return function() {
      return !fn.apply(this, arguments);
    };
  }

  // Basic math operators
  function add(x, y) {
    return x + y;
  }

  function sub(x, y) {
    return x - y;
  }

  function mul(x, y) {
    return x * y;
  }

  function div(x, y) {
    return x / y;
  }

  function mod(x, y) {
    return x % y;
  }

  function inc(x) {
    return ++x;
  }

  function dec(x) {
    return --x;
  }

  function neg(x) {
    return -x;
  }

  // Bitwise operators
  function bitwiseAnd(x, y) {
    return x & y;
  }

  function bitwiseOr(x, y) {
    return x | y;
  }

  function bitwiseXor(x, y) {
    return x ^ y;
  }

  function bitwiseLeft(x, y) {
    return x << y;
  }

  function bitwiseRight(x, y) {
    return x >> y;
  }

  function bitwiseZ(x, y) {
    return x >>> y;
  }

  function bitwiseNot(x) {
    return ~x;
  }

  // Basic comparators
  function eq(x, y) {
    return x == y;
  }

  function seq(x, y) {
    return x === y;
  }

  // Not
  function not(x) {
    return !x;
  }

  // Relative comparators
  function gt(x, y) {
    return x > y;
  }

  function lt(x, y) {
    return x < y;
  }

  function gte(x, y) {
    return x >= y;
  }

  function lte(x, y) {
    return x <= y;
  }

  // Mixing in the operator functions
  // -----------------------------

  _.mixin({
    add: variadicMath(add),
    sub: variadicMath(sub),
    mul: variadicMath(mul),
    div: variadicMath(div),
    mod: mod,
    inc: inc,
    dec: dec,
    neg: neg,
    eq: variadicComparator(eq),
    seq: variadicComparator(seq),
    neq: invert(variadicComparator(eq)),
    sneq: invert(variadicComparator(seq)),
    not: not,
    gt: variadicComparator(gt),
    lt: variadicComparator(lt),
    gte: variadicComparator(gte),
    lte: variadicComparator(lte),
    bitwiseAnd: variadicMath(bitwiseAnd),
    bitwiseOr: variadicMath(bitwiseOr),
    bitwiseXor: variadicMath(bitwiseXor),
    bitwiseNot: bitwiseNot,
    bitwiseLeft: variadicMath(bitwiseLeft),
    bitwiseRight: variadicMath(bitwiseRight),
    bitwiseZ: variadicMath(bitwiseZ)
  });
})(this);

// Underscore-contrib (underscore.util.strings.js 0.3.0)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  // No reason to create regex more than once
  var plusRegex = /\+/g;
  var spaceRegex = /\%20/g;
  var bracketRegex = /(?:([^\[]+))|(?:\[(.*?)\])/g;

  var urlDecode = function(s) {
    return decodeURIComponent(s.replace(plusRegex, '%20'));
  };
  var urlEncode = function(s) {
    return encodeURIComponent(s).replace(spaceRegex, '+');
  };

  var buildParams = function(prefix, val, top) {
    if (_.isUndefined(top)) top = true;
    if (_.isArray(val)) {
      return _.map(val, function(value, key) {
        return buildParams(top ? key : prefix + '[]', value, false);
      }).join('&');
    } else if (_.isObject(val)) {
      return _.map(val, function(value, key) {
        return buildParams(top ? key : prefix + '[' + key + ']', value, false);
      }).join('&');
    } else {
      return urlEncode(prefix) + '=' + urlEncode(val);
    }
  };

  // Mixing in the string utils
  // ----------------------------

  _.mixin({
    // Explodes a string into an array of chars
    explode: function(s) {
      return s.split('');
    },

    // Parses a query string into a hash
    fromQuery: function(str) {
      var parameters = str.split('&'),
          obj = {},
          parameter,
          key,
          match,
          lastKey,
          subKey,
          depth;

      // Iterate over key/value pairs
      _.each(parameters, function(parameter) {
        parameter = parameter.split('=');
        key = urlDecode(parameter[0]);
        lastKey = key;
        depth = obj;

        // Reset so we don't have issues when matching the same string
        bracketRegex.lastIndex = 0;

        // Attempt to extract nested values
        while ((match = bracketRegex.exec(key)) !== null) {
          if (!_.isUndefined(match[1])) {

            // If we're at the top nested level, no new object needed
            subKey = match[1];

          } else {

            // If we're at a lower nested level, we need to step down, and make
            // sure that there is an object to place the value into
            subKey = match[2];
            depth[lastKey] = depth[lastKey] || (subKey ? {} : []);
            depth = depth[lastKey];
          }

          // Save the correct key as a hash or an array
          lastKey = subKey || _.size(depth);
        }

        // Assign value to nested object
        depth[lastKey] = urlDecode(parameter[1]);
      });

      return obj;
    },

    // Implodes and array of chars into a string
    implode: function(a) {
      return a.join('');
    },

    // Converts a string to camel case
    camelCase : function( string ){
      return  string.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    },

    // Converts camel case to dashed (opposite of _.camelCase)
    toDash : function( string ){
      string = string.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
      // remove first dash
      return  ( string.charAt( 0 ) == '-' ) ? string.substr(1) : string;
    },

    // Creates a query string from a hash
    toQuery: function(obj) {
      return buildParams('', obj);
    },

    // Reports whether a string contains a search string.
    strContains: function(str, search) {
      if (typeof str != 'string') throw new TypeError;
      return (str.indexOf(search) != -1);
    }

  });
})(this);

// Underscore-contrib (underscore.util.trampolines.js 0.3.0)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  
  // Mixing in the truthiness
  // ------------------------

  _.mixin({
    done: function(value) {
      var ret = _(value);
      ret.stopTrampoline = true;
      return ret;
    },

    trampoline: function(fun /*, args */) {
      var result = fun.apply(fun, _.rest(arguments));

      while (_.isFunction(result)) {
        result = result();
        if ((result instanceof _) && (result.stopTrampoline)) break;
      }

      return result.value();
    }
  });

})(this);



// Grunt From /src/asp.setTimeout.js
if ( typeof setTimeout === 'undefined' ){
	var setTimeout = function(cb){
		if ( typeof cb === 'function' ){
			return cb();
		}else{
			return eval(cb);
		}
	}
	this.setTimeout = setTimeout;
};


// Grunt From /src/es6-promise.js
(function() {
    "use strict";

    function $$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function $$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function $$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var $$utils$$_isArray;

    if (!Array.isArray) {
      $$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      $$utils$$_isArray = Array.isArray;
    }

    var $$utils$$isArray = $$utils$$_isArray;
    var $$utils$$now = Date.now || function() { return new Date().getTime(); };
    function $$utils$$F() { }

    var $$utils$$o_create = (Object.create || function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      $$utils$$F.prototype = o;
      return new $$utils$$F();
    });

    var $$asap$$len = 0;

    var $$asap$$default = function asap(callback, arg) {
      $$asap$$queue[$$asap$$len] = callback;
      $$asap$$queue[$$asap$$len + 1] = arg;
      $$asap$$len += 2;
      if ($$asap$$len === 2) {
        // If len is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        $$asap$$scheduleFlush();
      }
    };

    var $$asap$$browserGlobal = (typeof window !== 'undefined') ? window : {};
    var $$asap$$BrowserMutationObserver = $$asap$$browserGlobal.MutationObserver || $$asap$$browserGlobal.WebKitMutationObserver;

    // test for web worker but not in IE10
    var $$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function $$asap$$useNextTick() {
      return function() {
        process.nextTick($$asap$$flush);
      };
    }

    function $$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new $$asap$$BrowserMutationObserver($$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function $$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = $$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function $$asap$$useSetTimeout() {
      return function() {
        setTimeout($$asap$$flush, 1);
      };
    }

    var $$asap$$queue = new Array(1000);

    function $$asap$$flush() {
      for (var i = 0; i < $$asap$$len; i+=2) {
        var callback = $$asap$$queue[i];
        var arg = $$asap$$queue[i+1];

        callback(arg);

        $$asap$$queue[i] = undefined;
        $$asap$$queue[i+1] = undefined;
      }

      $$asap$$len = 0;
    }

    var $$asap$$scheduleFlush;

    // Decide what async method to use to triggering processing of queued callbacks:
    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      $$asap$$scheduleFlush = $$asap$$useNextTick();
    } else if ($$asap$$BrowserMutationObserver) {
      $$asap$$scheduleFlush = $$asap$$useMutationObserver();
    } else if ($$asap$$isWorker) {
      $$asap$$scheduleFlush = $$asap$$useMessageChannel();
    } else {
      $$asap$$scheduleFlush = $$asap$$useSetTimeout();
    }

    function $$$internal$$noop() {}
    var $$$internal$$PENDING   = void 0;
    var $$$internal$$FULFILLED = 1;
    var $$$internal$$REJECTED  = 2;
    var $$$internal$$GET_THEN_ERROR = new $$$internal$$ErrorObject();

    function $$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function $$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.')
    }

    function $$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        $$$internal$$GET_THEN_ERROR.error = error;
        return $$$internal$$GET_THEN_ERROR;
      }
    }

    function $$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function $$$internal$$handleForeignThenable(promise, thenable, then) {
       $$asap$$default(function(promise) {
        var sealed = false;
        var error = $$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            $$$internal$$resolve(promise, value);
          } else {
            $$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          $$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          $$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function $$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === $$$internal$$FULFILLED) {
        $$$internal$$fulfill(promise, thenable._result);
      } else if (promise._state === $$$internal$$REJECTED) {
        $$$internal$$reject(promise, thenable._result);
      } else {
        $$$internal$$subscribe(thenable, undefined, function(value) {
          $$$internal$$resolve(promise, value);
        }, function(reason) {
          $$$internal$$reject(promise, reason);
        });
      }
    }

    function $$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        $$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = $$$internal$$getThen(maybeThenable);

        if (then === $$$internal$$GET_THEN_ERROR) {
          $$$internal$$reject(promise, $$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          $$$internal$$fulfill(promise, maybeThenable);
        } else if ($$utils$$isFunction(then)) {
          $$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          $$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function $$$internal$$resolve(promise, value) {
      if (promise === value) {
        $$$internal$$reject(promise, $$$internal$$selfFullfillment());
      } else if ($$utils$$objectOrFunction(value)) {
        $$$internal$$handleMaybeThenable(promise, value);
      } else {
        $$$internal$$fulfill(promise, value);
      }
    }

    function $$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      $$$internal$$publish(promise);
    }

    function $$$internal$$fulfill(promise, value) {
      if (promise._state !== $$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = $$$internal$$FULFILLED;

      if (promise._subscribers.length === 0) {
      } else {
        $$asap$$default($$$internal$$publish, promise);
      }
    }

    function $$$internal$$reject(promise, reason) {
      if (promise._state !== $$$internal$$PENDING) { return; }
      promise._state = $$$internal$$REJECTED;
      promise._result = reason;

      $$asap$$default($$$internal$$publishRejection, promise);
    }

    function $$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + $$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + $$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        $$asap$$default($$$internal$$publish, parent);
      }
    }

    function $$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          $$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function $$$internal$$ErrorObject() {
      this.error = null;
    }

    var $$$internal$$TRY_CATCH_ERROR = new $$$internal$$ErrorObject();

    function $$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        $$$internal$$TRY_CATCH_ERROR.error = e;
        return $$$internal$$TRY_CATCH_ERROR;
      }
    }

    function $$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = $$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = $$$internal$$tryCatch(callback, detail);

        if (value === $$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          $$$internal$$reject(promise, $$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== $$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        $$$internal$$resolve(promise, value);
      } else if (failed) {
        $$$internal$$reject(promise, error);
      } else if (settled === $$$internal$$FULFILLED) {
        $$$internal$$fulfill(promise, value);
      } else if (settled === $$$internal$$REJECTED) {
        $$$internal$$reject(promise, value);
      }
    }

    function $$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          $$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          $$$internal$$reject(promise, reason);
        });
      } catch(e) {
        $$$internal$$reject(promise, e);
      }
    }

    function $$$enumerator$$makeSettledResult(state, position, value) {
      if (state === $$$internal$$FULFILLED) {
        return {
          state: 'fulfilled',
          value: value
        };
      } else {
        return {
          state: 'rejected',
          reason: value
        };
      }
    }

    function $$$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor($$$internal$$noop, label);
      this._abortOnReject = abortOnReject;

      if (this._validateInput(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

        this._init();

        if (this.length === 0) {
          $$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            $$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        $$$internal$$reject(this.promise, this._validationError());
      }
    }

    $$$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return $$utils$$isArray(input);
    };

    $$$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    $$$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var $$$enumerator$$default = $$$enumerator$$Enumerator;

    $$$enumerator$$Enumerator.prototype._enumerate = function() {
      var length  = this.length;
      var promise = this.promise;
      var input   = this._input;

      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    $$$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var c = this._instanceConstructor;
      if ($$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== $$$internal$$PENDING) {
          entry._onerror = null;
          this._settledAt(entry._state, i, entry._result);
        } else {
          this._willSettleAt(c.resolve(entry), i);
        }
      } else {
        this._remaining--;
        this._result[i] = this._makeResult($$$internal$$FULFILLED, i, entry);
      }
    };

    $$$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

      if (promise._state === $$$internal$$PENDING) {
        this._remaining--;

        if (this._abortOnReject && state === $$$internal$$REJECTED) {
          $$$internal$$reject(promise, value);
        } else {
          this._result[i] = this._makeResult(state, i, value);
        }
      }

      if (this._remaining === 0) {
        $$$internal$$fulfill(promise, this._result);
      }
    };

    $$$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
      return value;
    };

    $$$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      $$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt($$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt($$$internal$$REJECTED, i, reason);
      });
    };

    var $$promise$all$$default = function all(entries, label) {
      return new $$$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
    };

    var $$promise$race$$default = function race(entries, label) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor($$$internal$$noop, label);

      if (!$$utils$$isArray(entries)) {
        $$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        $$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        $$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
        $$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    };

    var $$promise$resolve$$default = function resolve(object, label) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor($$$internal$$noop, label);
      $$$internal$$resolve(promise, object);
      return promise;
    };

    var $$promise$reject$$default = function reject(reason, label) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor($$$internal$$noop, label);
      $$$internal$$reject(promise, reason);
      return promise;
    };

    var $$es6$promise$promise$$counter = 0;

    function $$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function $$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var $$es6$promise$promise$$default = $$es6$promise$promise$$Promise;

    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise’s eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @constructor
    */
    function $$es6$promise$promise$$Promise(resolver, label) {
      this._id = $$es6$promise$promise$$counter++;
      this._label = label;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if ($$$internal$$noop !== resolver) {
        if (!$$utils$$isFunction(resolver)) {
          $$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof $$es6$promise$promise$$Promise)) {
          $$es6$promise$promise$$needsNew();
        }

        $$$internal$$initializePromise(this, resolver);
      }
    }

    $$es6$promise$promise$$Promise.all = $$promise$all$$default;
    $$es6$promise$promise$$Promise.race = $$promise$race$$default;
    $$es6$promise$promise$$Promise.resolve = $$promise$resolve$$default;
    $$es6$promise$promise$$Promise.reject = $$promise$reject$$default;

    $$es6$promise$promise$$Promise.prototype = {
      constructor: $$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection, label) {
        var parent = this;
        var state = parent._state;

        if (state === $$$internal$$FULFILLED && !onFulfillment || state === $$$internal$$REJECTED && !onRejection) {
          return this;
        }

        parent._onerror = null;

        var child = new this.constructor($$$internal$$noop, label);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          $$asap$$default(function(){
            $$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          $$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection, label) {
        return this.then(null, onRejection, label);
      }
    };

    var $$es6$promise$polyfill$$default = function polyfill() {
      var local;

      if (typeof global !== 'undefined') {
        local = global;
      } else if (typeof window !== 'undefined' && window.document) {
        local = window;
      } else {
        local = self;
      }

      var es6PromiseSupport =
        "Promise" in local &&
        // Some of these methods are missing from
        // Firefox/Chrome experimental implementations
        "resolve" in local.Promise &&
        "reject" in local.Promise &&
        "all" in local.Promise &&
        "race" in local.Promise &&
        // Older version of the spec had a resolver object
        // as the arg rather than a function
        (function() {
          var resolve;
          new local.Promise(function(r) { resolve = r; });
          return $$utils$$isFunction(resolve);
        }());

      if (!es6PromiseSupport) {
        local.Promise = $$es6$promise$promise$$default;
      }
    };

    var es6$promise$umd$$ES6Promise = {
      Promise: $$es6$promise$promise$$default,
      polyfill: $$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = es6$promise$umd$$ES6Promise;
    }
	if ( this['ES6Promise'] && !this.Promise ){
		this.Promise = es6$promise$umd$$ES6Promise.Promise;
		this.polyfill = es6$promise$umd$$ES6Promise.polyfill;
		if ( typeof window === 'undefined' ){
			Promise = this.Promise;
			polyfill = this.polyfill;
		}
	}
}).call(this);


// Grunt From /src/json2.js
;(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    };
	
// If the JSON object does not yet have a format method, give it one.
	if (typeof JSON.format !== 'function') {
		var repeat = function(s, count) {
			return new Array(count + 1).join(s);
		}
		
		JSON.format = function(json, cr) {

			json = this.stringify(json);
			
			var i           = 0,
				il          = 0,
				tab         = '\t',
				output   	= '',
				indentLevel = 0,
				inString    = false,
				currentChar = null;
	
			for (i = 0, il = json.length; i < il; i += 1) { 
				currentChar = json.charAt(i);
	
				switch (currentChar) {
				case '{': 
				case '[': 
					if (!inString) { 
						output += currentChar + '\n' + repeat(tab, indentLevel + 1);
						indentLevel += 1; 
					} else { 
						output += currentChar; 
					}
					break; 
				case '}': 
				case ']': 
					if (!inString) { 
						indentLevel -= 1; 
						output += '\n' + repeat(tab, indentLevel) + currentChar; 
					} else { 
						output += currentChar; 
					} 
					break; 
				case ',': 
					if (!inString) { 
						output += ',\n' + repeat(tab, indentLevel); 
					} else { 
						output += currentChar; 
					} 
					break; 
				case ':': 
					if (!inString) { 
						output += ': '; 
					} else { 
						output += currentChar; 
					} 
					break; 
				case ' ':
				case '\n':
				case '\t':
					if (inString) {
						output += currentChar;
					}
					break;
				case '"': 
					if (i > 0 && json.charAt(i - 1) !== '\\') {
						inString = !inString; 
					}
					output += currentChar; 
					break;
				default: 
					output += currentChar; 
					break;                    
				}
			}
	
			if (cr) {
				output = output.replace(/\n/g, '\r\n'); 
			};
			
			return output;
		}
	}
}());


// Grunt From /src/asp.date.js
/**
 * Copyright © kacper.wang 
 * http://jaywcjlove.github.io
 */
;(function(){
	/**
	 * [format 日期格式化]
	 * @param  {[type]} format ["YYYY年MM月dd日hh小时mm分ss秒"]
	 * @return {[type]}        [string]
	 */
	Date.prototype.format = function(format){ 
		var o = { 
			"M+" : this.getMonth()+1, //month 
			"d+" : this.getDate(), //day 
			"h+" : this.getHours(), //hour 
			"m+" : this.getMinutes(), //minute 
			"s+" : this.getSeconds(), //second 
			"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
			"S" : this.getMilliseconds() //millisecond 
		}
		if(/(y+)/.test(format))
			format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
		for(var k in o) 
			if(new RegExp("("+ k +")").test(format)) 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
		return format; 
	}
	/**
	 * [ago 多少小时前、多少分钟前、多少秒前]
	 * @return {[type]} [string]
	 */
	Date.prototype.ago = function(){ 
		if(!arguments.length) return '';
		var arg = arguments,
			now=this.getTime(),
			past =  !isNaN(arg[0])?arg[0]:new Date(arg[0]).getTime(),
			diffValue = now - past,
			result='',
			minute = 1000 * 60,
			hour = minute * 60,
			day = hour * 24,
			halfamonth = day * 15,
			month = day * 30,
			year = month * 12,

			_year = diffValue/year,
			_month =diffValue/month,
			_week =diffValue/(7*day),
			_day =diffValue/day,
			_hour =diffValue/hour,
			_min =diffValue/minute;

		if(_year>=1) result=parseInt(_year) + "年前";
		else if(_month>=1) result=parseInt(_month) + "个月前";
		else if(_week>=1) result=parseInt(_week) + "周前";
		else if(_day>=1) result=parseInt(_day) +"天前";
		else if(_hour>=1) result=parseInt(_hour) +"个小时前";
		else if(_min>=1) result=parseInt(_min) +"分钟前";
		else result="刚刚";
		return result;
	}
})();


// Grunt From /src/asp.class.js
;(function(){
	
	// Class Module
	// ------------------------
	var _ = this._ || require('underscore');
	
	_.proxy = function( fn, context ) {
		return function(){
			var args = arguments;
			return fn.apply(context, args);
		};
	};
	
	// make a new Class .
	// it return a new constructor.
	var classic = function( initialize ){
		this.init = initialize;
		this.privates = {};
		this.publics = {};
		this.overwriten = true;
		this.version = '1.0';
		this.worksion = 'Series.Class';
		
		var 
			that = this,
			cls = function(){
				var 
					privates = _.clone(that.privates),
					publics = _.clone(that.publics),
					self = this;
					
				// 将所有共有方法都加入到新类中，并且指向新类。
				_.each(publics, function(value, key){ 
					self[key] = _.isFunction(value) ? _.proxy(value, self) : value; 
				});
				
				publics = undefined;
				
				_.each(privates, function(value, key){
					if ( _.isFunction(value) ){
						privates[key] = _.proxy(value, privates);
					}
				});
				
				this['private'] = function(key){
					return privates[key];
				};
				
				this.property = function(key, value){
					privates[key] = value;
					return this;
				};
				
				that.init && that.init.apply(this, arguments); 
			};
		
		// 以下是静态方法
		_.each(['private', 'public', 'define', 'property', 'instance', 'extend', 'worksion', 'privates', 'publics'], function(method){
			cls[method] = _.isFunction(that[method]) ? _.proxy(that[method], that) : that[method];
		});
		
		cls.prototype.version = this.version;
		cls.prototype.worksion = this.worksion;
		
		return cls;
	};
	
	classic.prototype['private'] = function(key){
		return this.privates[key];
	};
	
	classic.prototype['public'] = function(key){
		return this.publics[key];
	};
	
	classic.prototype.define = function(defintion, factory){
		this.publics[defintion] = factory;
		return this;
	};
	
	classic.prototype.property = function(defintion, factory){
		this.privates[defintion] = factory;
		return this;
	};
	
	classic.prototype.instance = function(defintion){
		if ( defintion.worksion && defintion.worksion === this.worksion ){
			defintion = defintion.privates;
		}
		else if ( _.isPlainObject(defintion) ){
			defintion = defintion;
		}
		else {
			throw new Error('defintion can not been instance.')
		};
		
		var that = this;
		_.each(defintion, function( value, key ){
			if ( (that.privates[key] && that.overwriten) || (_.isUndefined(that.privates[key])) ){
				that.privates[key] = value;
			}
		});
		
		return this;
	};
	
	classic.prototype.extend = function(defintion){
		if ( defintion.worksion && defintion.worksion === this.worksion ){
			defintion = defintion.publics;
		}
		else if ( _.isPlainObject(defintion) ){
			defintion = defintion;
		}
		else {
			throw new Error('defintion can not been extend.')
		};
		
		var that = this;
		_.each(defintion, function( value, key ){
			if ( (that.publics[key] && that.overwriten) || (_.isUndefined(that.publics[key])) ){
				that.publics[key] = value;
			}
		});
		
		return this;
	};
	
	classic.prototype.overwrite = function(b){
		this.overwriten = !!b;
	};
	
	Class = classic;
}).call(this);


// Grunt From /src/asp.event.js
(function(){
	
	// Event module
	// --------------------
	var _ = this._ || require('underscore');
	var Event = new Class();
	
	Event
		.property('listeners', {})
		.property('onces', [])
		.property('onced', []);
	
	Event.define('on', function(EventName, EventFactory){
		var listeners = this['private']('listeners');
		if ( !_.isArray(listeners[EventName]) ){
			listeners[EventName] = [];
		};
		listeners[EventName].push(EventFactory);
		this.property('listeners', listeners);
	});
	
	Event.define('once', function(EventName, EventFactory){
		var onces = this['private']('onces');
		if ( onces.indexOf(EventName) == -1 ){
			onces.push(EventName);
			this.property('onces', onces);
			this.on(EventName, EventFactory);
		};
	});
	
	Event.define('one', function(EventName, EventFactory){
		var listeners = this['private']('listeners');
		if ( !_.isArray(listeners[EventName]) ){
			listeners[EventName] = [];
		};
		listeners[EventName] = [EventFactory];
		this.property('listeners', listeners);
	});
	
	Event.define('trigger', function(){
		if ( arguments.length === 0 ){
			throw new Error('Event.trigger must be some arguments.');
		};
		
		var 
			EventName = arguments[0], 
			argcs = [];
			
		if ( arguments.length > 1 ){
			argcs = argcs.concat(Array.prototype.slice.call(arguments, 1));
		};
		
		var 
			onces = this['private']('onces'), 
			onced = this['private']('onced'), 
			canRun = true, 
			needUpdate = false;
			
		if ( onces.indexOf(EventName) != -1 ){
			if ( onced.indexOf(EventName) === -1 ){
				canRun = true;
				needUpdate = true;
			}else{
				canRun = false;
				needUpdate = false;
			}
		}else{
			canRun = true;
			needUpdate = false;
		}
		
		if ( canRun ){
			
			var 
				listeners = this['private']('listeners'), 
				listener = [],
				that = this;
				
			if ( _.has(listeners, EventName) ){
				listener = listener.concat(listeners[EventName]);
			};

			_.each(listener, function( cb, i ){
				if ( _.isFunction(cb) ){
					var self = {
						eventType: EventName,
						eventFactory: cb,
						eventIndex: i
					};
					cb.apply(that, [self].concat(argcs));
				}
			});
			if ( needUpdate ){ 
				onced.push(EventName);
				this.property('onced', onced);
			};
			
		}
	});
	
	Event.define('off', function(EventName){
		var 
			listeners = this['private']('listeners'),
			onces = this['private']('onces'), 
			onced = this['private']('onced');
			
		if ( _.has(listeners, EventName) ){
			delete listeners[EventName];
		};
		
		if ( onces.indexOf(EventName) != -1 ){
			onces.splice(onces.indexOf(EventName), 1);
			this.property('onces', onces);
		};
		
		if ( onced.indexOf(EventName) != -1 ){
			onced.splice(onced.indexOf(EventName), 1);
			this.property('onced', onced);
		};
		
		this.property('listeners', listeners);
	});
	
	Event.define('emit', function(){
		this.trigger.apply(this, arguments);
	});
	
	Event.define('removeAllListeners', function(){
		this.property('listeners', {});
		this.property('onces', []);
		this.property('onced', []);
	});
	
	event = Event;
	
}).call(this);


// Grunt From /src/asp.process.js
// shim for using process in browser
(function(){
	
	// process module
	// --------------------------
	var 
		ROOT = this,
		_ = this._;
	
	_.enumerate = function( object, callback ){
		var _object = new Enumerator(object),
			_ret = [];
	
		for (; !_object.atEnd() ; _object.moveNext() ) {
			if ( _.isFunction(callback) ){
				var d = callback(_object.item());
				if ( d !== null && d !== undefined ){
					_ret.push(d);
				}
			}else{
				_ret.push(_object.item());
			}
		}
	
		return _ret;
	};
	
	var 
		envs 		= {},
		queue 		= [],
		draining 	= false,
		timer		= new Date().getTime();
		
	function drainQueue() {
		if (draining) {
			return;
		}
		draining = true;
		var currentQueue;
		var len = queue.length;
		while(len) {
			currentQueue = queue;
			queue = [];
			var i = -1;
			while (++i < len) {
				currentQueue[i]();
			}
			len = queue.length;
		}
		draining = false;
	}
		
	_.enumerate(Request.ServerVariables, function(envtion){
		envs[envtion] = String(Request.ServerVariables(envtion)) || '';
	});
	
	envs.SERIES_ENV = 'production';
	
	var PROCESS = new Class();
	
	PROCESS.define('title', 'Series Asp Worker');
	PROCESS.define('browser', false);
	PROCESS.define('env', envs);
	PROCESS.define('argv', []);
	PROCESS.define('version', '1.1.348');
	PROCESS.define('platform', 'win32');
	PROCESS.define('modules', {});
	PROCESS.define('bags', 'series_modules');
	PROCESS.property('worker', '/');
	
	PROCESS.instance(event).extend(event);
	
	PROCESS.define('nextTick', function(fun){
		queue.push(fun);
		if (!draining) {
			setTimeout(drainQueue, 0);
		}
	});
	
	PROCESS.define('binding', function(method, context){
		return _.proxy(method, context);
	});
	
	PROCESS.define('chdir', function(dir){
		this.property('worker', dir)
	});
	
	PROCESS.define('cwd', function(){
		return this['private']('worker');
	});
	
	PROCESS.define('uptime', function(){
		return new Date().getTime() - timer;
	});
	
	PROCESS.define('umask', function( mask ){
		return mask || 0;
	});
	
	PROCESS.define('createServer', function( app ){
		app = path.resolve(Server.MapPath('./'), app);
		if ( this.env.SERIES_ENV === 'development' ){
			(new ROOT.Require(app)).main.exports();
		}else{
			try{
				(new ROOT.Require(app)).main.exports();
			}catch(e){
				this.emit('error', e);
			}
		}
	});
		
	process = new PROCESS();
	
}).call(this);


// Grunt From /src/asp.path.js
;(function (exports) {
  "use strict";

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


var isWindows = process.platform === 'win32';
var util = this._;


// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}


if (isWindows) {
  // Regex to split a windows path into three parts: [*, device, slash,
  // tail] windows-only
  var splitDeviceRe =
      /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

  // Regex to split the tail part of the above into [*, dir, basename, ext]
  var splitTailRe =
      /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

  // Function to split a filename into [root, dir, basename, ext]
  // windows version
  var splitPath = function(filename) {
    // Separate device+slash from tail
    var result = splitDeviceRe.exec(filename),
        device = (result[1] || '') + (result[2] || ''),
        tail = result[3] || '';
    // Split the tail into dir, basename and extension
    var result2 = splitTailRe.exec(tail),
        dir = result2[1],
        basename = result2[2],
        ext = result2[3];
    return [device, dir, basename, ext];
  };

  var normalizeUNCRoot = function(device) {
    return '\\\\' + device.replace(/^[\\\/]+/, '').replace(/[\\\/]+/g, '\\');
  };

  // path.resolve([from ...], to)
  // windows version
  exports.resolve = function() {
    var resolvedDevice = '',
        resolvedTail = '',
        resolvedAbsolute = false;

    for (var i = arguments.length - 1; i >= -1; i--) {
      var path;
      if (i >= 0) {
        path = arguments[i];
      } else if (!resolvedDevice) {
        path = process.cwd();
      } else {
        // Windows has the concept of drive-specific current working
        // directories. If we've resolved a drive letter but not yet an
        // absolute path, get cwd for that drive. We're sure the device is not
        // an unc path at this points, because unc paths are always absolute.
        path = process.env['=' + resolvedDevice];
        // Verify that a drive-local cwd was found and that it actually points
        // to our drive. If not, default to the drive's root.
        if (!path || path.substr(0, 3).toLowerCase() !==
            resolvedDevice.toLowerCase() + '\\') {
          path = resolvedDevice + '\\';
        }
      }

      // Skip empty and invalid entries
      if (!util.isString(path)) {
        throw new TypeError('Arguments to path.resolve must be strings');
      } else if (!path) {
        continue;
      }

      var result = splitDeviceRe.exec(path),
          device = result[1] || '',
          isUnc = device && device.charAt(1) !== ':',
          isAbsolute = exports.isAbsolute(path),
          tail = result[3];

      if (device &&
          resolvedDevice &&
          device.toLowerCase() !== resolvedDevice.toLowerCase()) {
        // This path points to another device so it is not applicable
        continue;
      }

      if (!resolvedDevice) {
        resolvedDevice = device;
      }
      if (!resolvedAbsolute) {
        resolvedTail = tail + '\\' + resolvedTail;
        resolvedAbsolute = isAbsolute;
      }

      if (resolvedDevice && resolvedAbsolute) {
        break;
      }
    }

    // Convert slashes to backslashes when `resolvedDevice` points to an UNC
    // root. Also squash multiple slashes into a single one where appropriate.
    if (isUnc) {
      resolvedDevice = normalizeUNCRoot(resolvedDevice);
    }

    // At this point the path should be resolved to a full absolute path,
    // but handle relative paths to be safe (might happen when process.cwd()
    // fails)

    // Normalize the tail path

    function f(p) {
      return !!p;
    }

    resolvedTail = normalizeArray(resolvedTail.split(/[\\\/]+/).filter(f),
                                  !resolvedAbsolute).join('\\');

    return (resolvedDevice + (resolvedAbsolute ? '\\' : '') + resolvedTail) ||
           '.';
  };

  // windows version
  exports.normalize = function(path) {
    var result = splitDeviceRe.exec(path),
        device = result[1] || '',
        isUnc = device && device.charAt(1) !== ':',
        isAbsolute = exports.isAbsolute(path),
        tail = result[3],
        trailingSlash = /[\\\/]$/.test(tail);

    // If device is a drive letter, we'll normalize to lower case.
    if (device && device.charAt(1) === ':') {
      device = device[0].toLowerCase() + device.substr(1);
    }

    // Normalize the tail path
    tail = normalizeArray(tail.split(/[\\\/]+/).filter(function(p) {
      return !!p;
    }), !isAbsolute).join('\\');

    if (!tail && !isAbsolute) {
      tail = '.';
    }
    if (tail && trailingSlash) {
      tail += '\\';
    }

    // Convert slashes to backslashes when `device` points to an UNC root.
    // Also squash multiple slashes into a single one where appropriate.
    if (isUnc) {
      device = normalizeUNCRoot(device);
    }

    return device + (isAbsolute ? '\\' : '') + tail;
  };

  // windows version
  exports.isAbsolute = function(path) {
    var result = splitDeviceRe.exec(path),
        device = result[1] || '',
        isUnc = !!device && device.charAt(1) !== ':';
    // UNC paths are always absolute
    return !!result[2] || isUnc;
  };

  // windows version
  exports.join = function() {
    function f(p) {
      if (!util.isString(p)) {
        throw new TypeError('Arguments to path.join must be strings');
      }
      return p;
    }

    var paths = Array.prototype.filter.call(arguments, f);
    var joined = paths.join('\\');

    // Make sure that the joined path doesn't start with two slashes, because
    // normalize() will mistake it for an UNC path then.
    //
    // This step is skipped when it is very clear that the user actually
    // intended to point at an UNC path. This is assumed when the first
    // non-empty string arguments starts with exactly two slashes followed by
    // at least one more non-slash character.
    //
    // Note that for normalize() to treat a path as an UNC path it needs to
    // have at least 2 components, so we don't filter for that here.
    // This means that the user can use join to construct UNC paths from
    // a server name and a share name; for example:
    //   path.join('//server', 'share') -> '\\\\server\\share\')
    if (!/^[\\\/]{2}[^\\\/]/.test(paths[0])) {
      joined = joined.replace(/^[\\\/]{2,}/, '\\');
    }

    return exports.normalize(joined);
  };

  // path.relative(from, to)
  // it will solve the relative path from 'from' to 'to', for instance:
  // from = 'C:\\orandea\\test\\aaa'
  // to = 'C:\\orandea\\impl\\bbb'
  // The output of the function should be: '..\\..\\impl\\bbb'
  // windows version
  exports.relative = function(from, to) {
    from = exports.resolve(from);
    to = exports.resolve(to);

    // windows is not case sensitive
    var lowerFrom = from.toLowerCase();
    var lowerTo = to.toLowerCase();

    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== '') break;
      }

      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== '') break;
      }

      if (start > end) return [];
      return arr.slice(start, end + 1);
    }

    var toParts = trim(to.split('\\'));

    var lowerFromParts = trim(lowerFrom.split('\\'));
    var lowerToParts = trim(lowerTo.split('\\'));

    var length = Math.min(lowerFromParts.length, lowerToParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (lowerFromParts[i] !== lowerToParts[i]) {
        samePartsLength = i;
        break;
      }
    }

    if (samePartsLength == 0) {
      return to;
    }

    var outputParts = [];
    for (var i = samePartsLength; i < lowerFromParts.length; i++) {
      outputParts.push('..');
    }

    outputParts = outputParts.concat(toParts.slice(samePartsLength));

    return outputParts.join('\\');
  };

  exports.sep = '\\';
  exports.delimiter = ';';

} else /* posix */ {

  // Split a filename into [root, dir, basename, ext], unix version
  // 'root' is just a slash, or nothing.
  var splitPathRe =
      /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  var splitPath = function(filename) {
    return splitPathRe.exec(filename).slice(1);
  };

  // path.resolve([from ...], to)
  // posix version
  exports.resolve = function() {
    var resolvedPath = '',
        resolvedAbsolute = false;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = (i >= 0) ? arguments[i] : process.cwd();

      // Skip empty and invalid entries
      if (!util.isString(path)) {
        throw new TypeError('Arguments to path.resolve must be strings');
      } else if (!path) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charAt(0) === '/';
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeArray(resolvedPath.split('/').filter(function(p) {
      return !!p;
    }), !resolvedAbsolute).join('/');

    return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
  };

  // path.normalize(path)
  // posix version
  exports.normalize = function(path) {
    var isAbsolute = exports.isAbsolute(path),
        trailingSlash = path[path.length - 1] === '/',
        segments = path.split('/'),
        nonEmptySegments = [];

    // Normalize the path
    for (var i = 0; i < segments.length; i++) {
      if (segments[i]) {
        nonEmptySegments.push(segments[i]);
      }
    }
    path = normalizeArray(nonEmptySegments, !isAbsolute).join('/');

    if (!path && !isAbsolute) {
      path = '.';
    }
    if (path && trailingSlash) {
      path += '/';
    }

    return (isAbsolute ? '/' : '') + path;
  };

  // posix version
  exports.isAbsolute = function(path) {
    return path.charAt(0) === '/';
  };

  // posix version
  exports.join = function() {
    var path = '';
    for (var i = 0; i < arguments.length; i++) {
      var segment = arguments[i];
      if (!util.isString(segment)) {
        throw new TypeError('Arguments to path.join must be strings');
      }
      if (segment) {
        if (!path) {
          path += segment;
        } else {
          path += '/' + segment;
        }
      }
    }
    return exports.normalize(path);
  };


  // path.relative(from, to)
  // posix version
  exports.relative = function(from, to) {
    from = exports.resolve(from).substr(1);
    to = exports.resolve(to).substr(1);

    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== '') break;
      }

      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== '') break;
      }

      if (start > end) return [];
      return arr.slice(start, end + 1);
    }

    var fromParts = trim(from.split('/'));
    var toParts = trim(to.split('/'));

    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }

    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push('..');
    }

    outputParts = outputParts.concat(toParts.slice(samePartsLength));

    return outputParts.join('/');
  };

  exports.sep = '/';
  exports.delimiter = ':';
}

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};


if (isWindows) {
  exports._makeLong = function(path) {
    // Note: this will *probably* throw somewhere.
    if (!util.isString(path))
      return path;

    if (!path) {
      return '';
    }

    var resolvedPath = exports.resolve(path);

    if (/^[a-zA-Z]\:\\/.test(resolvedPath)) {
      // path is local filesystem path, which needs to be converted
      // to long UNC path.
      return '\\\\?\\' + resolvedPath;
    } else if (/^\\\\[^?.]/.test(resolvedPath)) {
      // path is network UNC path, which needs to be converted
      // to long UNC path.
      return '\\\\?\\UNC\\' + resolvedPath.substring(2);
    }

    return path;
  };
	
	exports.server = function(path){
		return Server.MapPath(path);
	};
	
} else {
  exports._makeLong = function(path) {
    return path;
  };
}
}).call(this, path);


// Grunt From /src/asp.fso.js
// FSO Factory.
;(function(root){
	
	// fso module
	// ---------------------------------
	var object = new ActiveXObject("Scripting.FileSystemObject");
	var _ = root._ || require('underscore');
	
	fs.exist = function( path ){
		return object.FolderExists(path) ? true : (object.FileExists(path) ? true : false);
	};
	
	fs.stats = function( path ){
		var cf;
		if ( object.FileExists(path) ){
			cf = function(){ return object.GetFile(path); };
			cf.isFile = function(){ return true };
			cf.isDirectory = function(){ return false };
		}
		else if ( object.FolderExists(path) ){
			cf = function(){ return object.GetFolder(path); };
			cf.isFile = function(){ return false };
			cf.isDirectory = function(){ return true };
		}
		else{
			cf = function(){ return {}; };
			cf.isFile = function(){ return false };
			cf.isDirectory = function(){ return false };
		}
		
		return cf;
	};
	
	fs.mkdir = function( path ){
		autoCreate(path, false);
		
		return object.FolderExists(path);
	};
	
	fs.rmdir = function( path ){
		if ( object.FolderExists(path) ) { 
			object.DeleteFolder(path);
		};
		
		return !object.FolderExists(path);
	};
	
	fs.writeFile = function(filename, data, options){
		if ( !options || !_.isJSON(options) ){
			options = {
				encoding: Response.Charset
			};
		};
		if ( !options.encoding ){
			options.encoding = Response.Charset;
		};
		
		try{
			var isStr = _.isString(data);	// 判断传入的是String还是Buffer
			var dType = isStr ? 2 : 1;
			
			var stream = new ActiveXObject('Adodb.Stream');
				stream.Type = dType; 
				stream.Mode = 3; 
				stream.Open();
				if (isStr) {
					stream.Charset = options.encoding;
					stream.WriteText(data);
				}else{
					stream.Write(data);
				}
				if (isStr && options.encoding.toLowerCase() === 'utf-8') {
					// 去除utf-8的BOM
					stream.Position = 0;
					stream.Type = 1;
					stream.Position = 3;
					var bs = stream.Read();  
					stream.Position = 0;  
					stream.Write(bs);  
					stream.SetEOS();
				}
				autoCreate(filename, true);
				stream.SaveToFile(filename, 2);
				stream.Close();
		}catch(e){
			throw new Error('Series Fso Error: ' + e.message);
		}
	};
	
	fs.readFile = function(filename, options){
		if ( !options || !_.isJSON(options) ){
			options = {
				encoding: Response.Charset
			};
		};
		if ( !options.encoding ){
			options.encoding = Response.Charset;
		};
		
		try{
			var stream = new ActiveXObject('Adodb.Stream'),
				data;
		
				stream.Type = options.encoding === 'buffer' ? 1 : 2; 
				stream.Mode = 3; 
				stream.Open();
				if (options.encoding === 'buffer') {
					stream.Position = stream.Size;
					stream.LoadFromFile(filename);
					data = stream.Read;
				}else{
					stream.Charset = options.encoding;
					stream.Position = stream.Size;
					stream.LoadFromFile(filename);
					data = stream.ReadText;
				}
				stream.Close();
				
			return data;
		}catch(e){
			throw new Error('Series Fso Error: [' + filename + '] => ' + e.message);
		}
	}
	
	fs.readFileSync = fs.readFile;
	
	fs.appendFile = function(filename, data, options){	
		if ( !options || !_.isJSON(options) ){
			options = {
				encoding: Response.Charset
			};
		};
		if ( !options.encoding ){
			options.encoding = Response.Charset;
		};
		
		try{
			if ( _.isString(data) ) {
				// 将String转为Buffer
				var object = new ActiveXObject('Adodb.Stream');
					object.Type = 2; 
					object.Mode = 3; 
					object.Open();
					object.Charset = options.encoding;
					object.WriteText(data);
					object.Position = 0;
					object.Type = 1;					
					if (options.encoding.toLowerCase() === 'utf-8') {
						object.Position = 3;	// 去除utf-8的BOM  
					}
					data = object.Read();
					object.Close();
			}
			
			var stream = new ActiveXObject('Adodb.Stream');
				stream.Type = 1; 
				stream.Mode = 3; 
				stream.Open();
				stream.LoadFromFile(filename);
				stream.Position = stream.Size;
				stream.Write(data);
				stream.SaveToFile(filename, 2);
				stream.Close();
		}catch(e){
			throw new Error('Series Fso Error: [' + filename + '] => ' + e.message);
		}
	};
	
	fs.appendFileSync = fs.appendFile;
	
	fs.write = function(fd, buffer, offset, length, position){
		try{
			var stream = new ActiveXObject('Adodb.Stream');	
				stream.Type = 1;
				stream.Open();
				stream.Write(buffer);
				stream.Position = 0;
				autoCreate(fd, true);
				stream.SaveToFile(fd, 2);
				stream.Close();
		}catch(e){
			throw new Error('Series Fso Error: ' + e.message);
		}
	};
	
	fs.writeSync = fs.write;
	
	fs.read = function(fd, buffer, offset, length, position){
		try{
			var stream = new ActiveXObject('Adodb.Stream'), ret;
				stream.Type = 1;
				stream.Open();
				stream.LoadFromFile(fd);
				ret = stream.Read(-1);
				stream.Close();
			return ret;
		}catch(e){
			throw new Error('Series Fso Error: ' + e.message);
		}
	};
	
	fs.readSync = fs.read;
	
	_.each(['copy', 'move'], function(method){
		var upper = method.charAt(0).toUpperCase() + method.substr(1);
		fs[method] = function(source, target){
			if ( object.FileExists(source) ){
				object[upper + 'File'](source, target);
			}
			else if ( object.FolderExists(source) ){
				object[upper + 'Folder'](source, target);
			}
		}
	});
	
	fs.rename = function(path, name){
		var cf = (fs.stats(path))();
		if ( cf.Name ){
			cf.Name = name;
		};
	};
	
	fs.readDir = function(path, callback){
		var cf = fs.stats(path);
		if ( cf.isDirectory() ){
			cf = cf();
			return {
				dir: _.enumerate(cf.SubFolders, callback),
				file: _.enumerate(cf.Files, callback)
			}
		}
	};
	
	fs.unlink = function(path){
		var cf = fs.stats(path);
		if ( cf.isFile() ){
			cf = null;
			object.DeleteFile(path);
		}
	};
	
	function autoCreate(file, isFile){
		var root = path.server('/');
		var folder = isFile ? path.dirname(file) : file;
		var relatives = path.relative(root, folder).replace(/\\/g, '/').split('/');
		_.each(relatives, function(fo){
			root = path.resolve(root, fo);
			if ( !object.FolderExists(root) ) { 
				object.CreateFolder(root); 
			};
		});
		return file;
	}
	
}).call(fs, Global);


// Grunt From /src/asp.console.js
(function(){
	
	var _ = this._;
	
	_.isJSON = function(value){
		try{
			for ( var i in value ){
				return true;
			}
		}catch(e){
			return false;
		}
	};
	
	var status = {},
		statusArray = [
			'100 Continue',
			'101 Switching Protocols',
			'200 OK',
			'201 Created',
			'202 Accepted',
			'203 Non-Authoritative Information',
			'204 No Content',
			'205 Reset Content',
			'206 Partial Content',
			'300 Multiple Choices',
			'301 Moved Permanently',
			'302 Found',
			'303 See Other',
			'304 Not Modified',
			'305 Use Proxy',
			'307 Temporary Redirect',
			'400 Bad Request',
			'401 Unauthorized',
			'403 Forbidden',
			'404 Not Found',
			'405 Method Not Allowed',
			'406 Not Acceptable',
			'407 Proxy',
			'408 Request Timeout',
			'409 Conflict',
			'410 Gone',
			'411 Length Require',
			'412 Precondition Failed',
			'413 Request Entity Too Large',
			'414 Request URI Too Long',
			'416 Requested Range Not Satisfiable',
			'500 Internal Server Error',
			'501 Not Implemented',
			'502 Bad Gateway',
			'503 Service Unavailable',
			'504 Gateway Timeout',
			'505 HTTP Version Not Supported'
		];
		
	_.each(statusArray, function(code){
		var codes = code.split(' ');
		if ( !isNaN(codes[0]) ){
			status[codes[0]] = code;
		};
	});
	
	this.watcher = new Class();
	
	this.watcher.define('log', function(){
		Response.Write(Array.prototype.slice.call(arguments, 0).join(''));
	});
	
	this.watcher.define('json', function(){
		arguments.length > 0 && this.log(JSON.stringify(arguments[0]));
	});
	
	this.watcher.define('format', function(){
		arguments.length > 0 && this.log(JSON.format(arguments[0]));
	});
	
	this.watcher.define('debug', function( logs ){
		if ( process.env.SERIES_ENV === 'development' ){
			if ( _.isString(logs) || _.isBoolean(logs) || _.isNumber(logs) ){ logs = logs; }
			else if ( _.isDate(logs) ){ logs = new Date(logs).format('yyyy年MM月dd日 hh:mm:ss'); }
			else if ( _.isFunction(logs) ) { logs = logs.toString(); }
			else if ( typeof logs === 'object' ) {
				try{
					if ( logs instanceof RegExp ){
						logs = '[RegExp: ' + String(logs) + ']';
					}else if ( new Enumerator(logs).atEnd ){
						logs = JSON.format(_.enumerate(logs), true);
					}else{
						if ( _.isJSON(logs) ){ logs = JSON.format(logs, true); }
						else{ try{ logs = valueOf(logs) ? valueOf(logs) : typeof(logs); }catch(ex){ logs = typeof(logs); } }
					}
				}catch(e){
					if ( _.isJSON(logs) ){ logs = JSON.format(logs, true); }
					else{ try{ logs = valueOf(logs) ? valueOf(logs) : typeof(logs); }catch(ex){ logs = typeof(logs); } }
				}
			}
			else { try{ logs = String(logs); }catch(e){ logs = typeof(logs); } };
			
			var 
				now = new Date().format('yyyy年MM月dd日 hh:mm:ss'),
				content = '[' + now + ']:\r\n' + logs + '\r\n\r\n',
				file = Server.MapPath(path.normalize('/debug.log')),
				object = new ActiveXObject("Scripting.FileSystemObject"),
				fw = object.OpenTextFile(file, 8, true);
				
			fw.WriteLine(content);		
			fw.Close();
		}
	});
	
	this.watcher.define('redirect', function(code, url){
		if ( !isNaN(code) && status[code] ){
			this.writeStatus(code);
			Response.AddHeader("Location", url);
			Response.End();
		}else{
			Response.Redirect(code);
		};
	});
	
	this.watcher.define('writeStatus', function(code){
		if ( status[code] ){
			Response.Status = status[code];
		};
		return this;
	});
	
	this.watcher.define('end', function(code){
		this.log.apply(this, arguments);
		Response.End();
		return this;
	});
	
	console = new this.watcher();
	
}).call(this);


// Grunt From /src/asp.resolve.js
;(function(path){
	
	this.Resolve = {
		fso: new ActiveXObject("Scripting.FileSystemObject"),
		FolderExist: function(pather){ return this.fso.FolderExists(pather); },
		FileExist: function(pather){ return this.fso.FileExists(pather); },
		
		get: function(dirname, selector){
			selector = selector.replace(/\\/g, '/');
			if ( /^\.\//.test(selector) || /^\.\.\//.test(selector) || /\//.test(selector) ){
				var a = path.resolve(dirname, selector);
				var b = this.ext(a);
				if ( a != b ){
					return b;
				}else{
					return this.lazy(a);
				}
			}else{
				var cwd = Server.MapPath(process.cwd());
				var that = this;
				var findPatherBags = function(dir, sec){
					var isRoot = path.relative(dir, cwd).length === 0,
						realPath = path.resolve(dir, process.bags, sec),
						pather = path.resolve(dir, sec),
						_pather = that.ext(pather),
						matcher;

					if ( that.FolderExist(realPath) && !!( matcher = that.match(realPath) ) ){ return matcher; }
					else if ( pather != _pather ){ return _pather; }	
					else if ( isRoot ){ return that.ext(path.resolve(dirname, sec)); }
					else{ return findPatherBags(path.resolve(dir, '..'), sec); };
				};
				return this.lazy(findPatherBags(dirname, selector));
			}
		},
		
		match: function( pather ){
			var packPather = path.resolve(pather, 'package.json');

			if ( this.FileExist(packPather) ){
					var PackageData = JSON.parse(fs.readFile(packPather));
					if ( PackageData.main && PackageData.main.length > 0 ){ 
						packPather = path.resolve(pather, PackageData.main); 
					}else{ 
						packPather = path.resolve(pather, 'index.js'); 
					};
					
					var _pp = packPather;
					if (  !/\.js$/i.test(packPather) ){
						_pp = _pp + '.js';
					}
					
					if ( this.FileExist(packPather) ) { 
						return packPather; 
					}
					else if ( this.FileExist(_pp) ){
						return _pp;
					}
					else if ( this.FolderExist(packPather) ){
						var zindex = path.resolve(packPather, 'index.js');
						if ( this.FileExist(zindex) ){
							return zindex;
						}
					}
			}else{
				packPather = path.resolve(pather, 'index.js');
				if ( this.FileExist(packPather) ) return packPather; 
			};
		},
		
		lazy: function(pather){
			if ( !this.FileExist(pather) && this.FolderExist(pather) ){
				var matches = this.match(pather);
				if ( matches ){
					return matches;
				}
			};
			return pather;
		},
		
		ext: function(pather){
			if ( this.FileExist(pather) ){
				return pather;
			}
			
			if ( !/\.js$/i.test(pather) ){
				var pathers = pather + '.js';
				if ( this.FileExist(pathers) ){
					return pathers;
				}
			}
			
			return pather;
		}
	}
	
}).call(this, path);


// Grunt From /src/asp.module.js
;(function(){
	var ROOT = this;
	
	var systems = {
		fs: fs,
		path: path,
		underscore: _,
		promise: Promise
	}
	
	ROOT.Module = function(dirname){
		this.dirname = dirname;
		this.exports = null;
	};
	
	ROOT.Module.prototype.require = function(anothers){
		if ( systems[anothers] ){
			return systems[anothers];
		}
		return (new ROOT.Require(this.resolve(anothers))).main.exports;
	};
	
	ROOT.Module.prototype.resolve = function(anothers){
		return ROOT.Resolve.get(this.dirname, anothers);
	};
	
}).call(this);


// Grunt From /src/asp.require.js
// Require Factory.
;(function(){
	
	// require module
	// ------------------------
	var 
		ROOT = this,
		_ = ROOT._;
// ----------------------------------------------------------------------		
	ROOT.Require = function(filename){
		this.filename = filename;
		this.dirname = path.dirname(filename);
		this.MakeRequire();
	};

	ROOT.Require.prototype.MakeRequire = function(){
		var filename = this.filename;
		
		if ( _.isUndefined(process.modules[filename]) ){
			this.execScript(this.wrapModule(this.loadFile()));
		}
		
		this.main = process.modules[filename];
	};
	
	ROOT.Require.prototype.loadFile = function(){
		if ( fs.exist(this.filename) ){
			return fs.readFile(this.filename);
		}else{
			process.emit('loadModule:unexist', this.filename);
			return 'module.exports={};';
		}
	};
	
	ROOT.Require.prototype.wrapModule = function( content ){
		var 
			filename = this.filename,
			isJSON = path.extname(filename).toLowerCase() === '.json',
			methods = ['require', 'exports', 'module', '__filename', '__dirname'];
		
		if ( isJSON ){ content = 'module.exports=' + content + ';';	};
		
		var wrapper = ['return function (' + methods.join(',') + '){', content, '};'].join("\n");
		
		return (new Function(wrapper))();
	};
	
	ROOT.Require.prototype.execScript = function(execNode){
		var 
			filename = this.filename,
			dirname = this.dirname,
			series = new ROOT.Module(dirname);

		var exports = series.exports = new Object();
		var require = series.require.bind(series);
			require.resolve = series.resolve.bind(series);
		
		try{
			execNode.call(exports, require, exports, series, filename, dirname );
			process.modules[filename] = series;
		}catch(e){
			//process.emit('require.compile.error', e, filename);
			throw new Error('require.compile.error:[' + filename + '] ' + e.message);
		};
	};
	
}).call(this);
	
}).call(Global);

// format objects.
var _ = Global._;
if ( Global.setTimeout ){
	var setTimeout = Global.setTimeout;
};
if ( !_.trim ){
	_.trim = function(str){
		if ( _.isString(str) ){
			return str.trim();
		}else{
			return str;
		}
	}
}
var setImmediate = setImmediate || function(handle){
  var args = Array.prototype.slice.call(arguments,1);
  var invoke = function(){ handle.apply(self,args); };
  if( Promise )
    Promise.resolve().then(invoke);
  else if(!-[1,]){
    var head = document.documentElement.firstChild;
    var script = document.createElement("script");
    script.onreadystatechange = function(){
      script.onreadystatechange = null;
      head.removeChild(script);
      invoke();
    };
    head.appendChild(script);
  }else setTimeout(invoke);
};
%>