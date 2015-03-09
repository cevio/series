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