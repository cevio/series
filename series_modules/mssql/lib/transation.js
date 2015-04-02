
// trasaction module
// ------------------------------------
var Transation = module.exports = new Class(function(context){
	context['private']('connect').BeginTrans();
	this.property('context', context);
});

Transation.property('tasker', Promise.resolve());
Transation.instance(event).extend(event);

Transation.define('task', function(handler, rollback){
	var 
		context = this['private']('context'),
		tasker = this['private']('tasker'),
		dbo = this['private']('dbo'),
		connect = this['private']('connect');
		
	this.property('tasker', tasker.then(function(value){
		return new Promise(function(resolve, reject){
			try{
				if ( _.isFunction(handler) ){
					handler(resolve, reject, value);
				}else{
					resolve(value);
				}
			}catch(e){
				if ( _.isFunction(rollback) ){
					reject(rollback(e, value));
				}else{
					reject(e);
				};
			}
		});
	}));
	
	return this;
});

Transation.define('stop', function(){
	var that = this;
		
	this['private']('tasker').then(function(value){
		that['private']('context')['private']('connect').CommitTrans();
		that.emit('task.success', value);
	})['catch'](function(value){
		that['private']('context')['private']('connect').RollbackTrans();
		that.emit('task.error', value);
	});
});