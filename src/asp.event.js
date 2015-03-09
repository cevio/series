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