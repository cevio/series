!(function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        var f;
        "undefined" != typeof window ? f = window: "undefined" != typeof global ? f = global: "undefined" != typeof self && (f = self),
        f['xml'] = e()
    }
})(function() {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    throw new Error("Cannot find module '" + o + "'")
                }
                var f = n[o] = {
                    exports: {}
                };
                t[o][0].call(f.exports,
                function(e) {
                    var n = t[o][1][e];
                    return s(n ? n: e)
                },
                f, f.exports, e, t, n, r)
            }
            return n[o].exports
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    })(
		{1:[function(_dereq_, module, exports){

var push = Array.prototype.push;
var splice = Array.prototype.splice;
var slice = Array.prototype.slice;
var concat = Array.prototype.concat;

var xml = exports = module.exports = function(obj){
	return function( selector ){
		return new proto(selector, obj);
	}
}

var proto = function(selector, obj){
	this.object = obj;
	this.length = 1;
	this.document = obj.documentElement;
	this.size = function(){
		return this.length;
	};
	this.constructor = proto;
	this.handle(selector);
	this.constructor = proto;
}

proto.prototype.handle = function(selector){
	if ( _.isObject(selector) ){
		if ( selector.length ){
			if ( selector.constructor && selector.constructor == proto ){
				xml.copy(selector, this);
			}else{
				xml.pushArray(this, slice.call(selector, 0));
			}
		}else{
			xml.pushArray(this, [selector]);
		}
	}
	else if ( _.isArray( selector ) ){
		var that = this;
		_.each(selector, function(element){
			xml.copy(new proto(element, that.object), that);
		});
	}else{
		xml.pushArray(this, [this.document]);
		return this.find(selector);
	}
	return this;
}

proto.prototype.find = function(selector){
	var elements = slice.call(this, 0);
	elements = xml.parse(elements, selector);
	xml.pushArray(this, elements);
	return this;
}

proto.prototype.each = function(callback){
	for ( var i = 0 ; i < this.length ; i++ ){
		_.isFunction(callback) && callback.call(this[i], this[i], i, this);
	}
	return this;
}

proto.prototype.map = function(callback){
	var nodes = [];
	this.each(function(){
		var element = callback.apply(this, arguments);
		if ( element ){
			nodes.push(element);
		}else{
			nodes.push(this);
		}
	});
	xml.pushArray(this, _.flatten(nodes));
	return this;
}

proto.prototype.toArray = function(){
	var rets = [];
	for ( var i = 0 ; i < this.length; i ++ ){
		rets.push(this[i]);
	}
	return rets;
}

proto.prototype.attr = function(key, value){
	var that = this;
	if ( _.isObject(key) ){
		_.each(key, function(b, a){
			that.attr(a, b);
		});
	}else{
		if ( !value ){
			try{
				return this[0] ? this[0].getAttribute(key) : '';
			}catch(e){
				return '';
			}
		}else{
			this.each(function(){
				try{
					this.setAttribute(key, String(value));
				}catch(e){
					this.createAttribute(key);
					this.setAttribute(key, String(value));
				}
			});
		}
	}
	
	return this;
}

proto.prototype.append = function(name, parent){
	var nodes = [], that = this;
	this.each(function(){
		var node = that.object.createElement(name);
		this.appendChild(node);
		if ( parent ){
			nodes.push(this);
		}else{
			nodes.push(node);
		}
	});
	xml.pushArray(this, nodes);
	return this;
}

proto.prototype.remove = function(){
	var that = this;;
	this.each(function(){
		var parent = this.parentNode || that.document;
		parent.removeChild(this);
	});
	xml.pushArray(this, []);
	return this;
}

proto.prototype.html = function(html){
	var that = this;
	if ( _.isUndefined(html) ){
		return this[0].firstChild.text;
	}else{
		this.empty().each(function(){					
			this.appendChild( that.object.createCDATASection(html) );
		});
		return this;
	}
}

proto.prototype.text = function(value){
	var that = this;
	if ( _.isUndefined(value) ){
		return this[0].text;			
	}else{
		this.empty().each(function(){
			this.appendChild(that.object.createTextNode(value));
		});
		return this;
	}
}

proto.prototype.comment = function(value){
	var that = this;
	return this.each(function(){
		 this.appendChild(that.object.createComment(value));
	});
}

proto.prototype.empty = function(){
	for ( var i = 0, elem ; (elem = this[i]) != (null || undefined); i++ ) {
		// Remove any remaining nodes
		while ( elem.firstChild ) {
			elem.removeChild( elem.firstChild );
		}
	}
	return this;
}

proto.prototype.childrens = function(){
	return this.map(function(){
		
		if ( this.hasChildNodes ){
			var nodes = [];
			for ( var i = 0 ; i < this.childNodes.length ; i++ ){
				nodes.push(this.childNodes[i]);
			}
			return nodes;
		}else{
			return [];
		}
	});
}

proto.prototype.eq = function(i){
	xml.pushArray(this, [this[i]]);
	return this;
}

proto.prototype.get = function(i){
	return this[i];
}

proto.prototype.first = function(){
	return this.eq(0);
}

proto.prototype.last = function(){
	return this.eq(this.length - 1);
}

proto.prototype.prev = function(){
	return this.map(function(){
		return this.previousSibling || []
	})
}

proto.prototype.next = function(){
	return this.map(function(){
		return this.nextSibling || []
	})
}
proto.prototype.type = function(){
	return this.get(0).nodeType;
}

proto.prototype.name = function(){
	return this.get(0).tagName || this.get(0).nodeName;
}

proto.prototype.value = function(){
	return this.get(0).nodeValue;
}

proto.prototype.parent = function(){
	return this.map(function(){
		return this.parentNode || [];
	});
}
proto.prototype.save = function(pather){
	this.object.save(pather);
	return this;
}

proto.prototype.search = function(key, value){
	if ( _.isObject(key) ){
		var that = this;
		_.each(key, function(b, a){
			var node = that.search(a, b);
			xml.copy(node, that);
		});
		return this;
	}else{
		return this.map(function(){
			var node = this.GetAttributeNode(key);
			if ( _.isUndefind(node) || _.isNull(node) ){
				return [];
			}
			if ( node && !node.length ){
				node = [node];
			};
			var nodes = [];
			for ( var i = 0 ; i < node.length ; i++ ){
					var _node = node[i];
					if ( _node.nodeValue == value ){
						nodes.push(_node);
					}
			}
			return nodes;
		});
	}
}

proto.prototype.xml = function(){
	return this.object.xml;
}

// --------------------------------------------------------

xml.find = function(element, tagname){
	var elements = element.getElementsByTagName(tagname)
		,	arrays = [];
		
	if ( elements.length > 0 ){
		for ( var i = 0 ; i < elements.length ; i++ ){
			arrays.push(elements[i]);
		}
	}
	
	return arrays;
}

xml.parse = function(elements, selectors){
	_.each(selectors.split('/'), function(selector){
		elements = _.map(elements, function(element){
			return xml.find(element, selector) || [];
		});
		elements = _.flatten(elements);
	});
	return elements;
}

xml.pushArray = function(context, elements){
	xml.clear(context);
	for ( var i = 0 ; i < elements.length ; i++ ){
		context[i] = elements[i];
	}
	context.length = elements.length;
}

xml.clear = function(context){
	for ( var i = 0 ; i < context.length ; i++ ){
		delete context[i];
	}
}

xml.copy = function(object, context){
	xml.clear(context);
	object.each(function(value, i){
		context[i] = value;
	});
}
},{}],2:[function(_dereq_, module, exports){
// JavaScript Document

var xml = _dereq_('./lib');

var proto = module.exports = function( str ){
	var obj = new ActiveXObject('Microsoft.XMLDOM');
	if ( str ){
		try{
			obj.async = false;
			if ( /^\w\:\\/.test(str) ){ obj.load(str); }
			else{ obj.loadXML(str); }
			return xml(obj);
		}catch(e){
			throw new Error('load XML fail.');
		}
	}else{
		throw new Error('load XML fail.');
	}
}
},{"./lib":1}]}
		,{},[2])(2)
});