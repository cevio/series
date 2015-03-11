// JavaScript Document
define(['jquery'], function($){
	var proto = {};
	
	proto.download = function(from, to){
		var that = this;
		if ( !from || !to ){
			this.pushError('- # [from] and [to] arguments required.');
			return Promise.reject();
		}
		var masker = this.delay();
		return new Promise(function(resolve, reject){
			masker[2].innerHTML = '0%';
			debrisDownload.call(that, 'debris download ' + from + ' ' + to, masker, function(){
				masker[0].stop();
				resolve();
			}, function(e){
				that.pushError('- # debris download catch error.');
				masker[0].stop();
				reject(e);
			});
		});
	}
	
	function debrisDownload(cmd, masker, callback, errors){
		var that = this;
		this.post({cmd: cmd}).then(function(key){
			if ( key.error === 0 ){
				if ( key.percent < 1 ){
					masker[2].innerHTML = (key.percent * 100).toFixed(2) + '%';
					debrisDownload.call(that, cmd, masker, callback, errors);
				}else{
					masker[2].innerHTML = '100%';
					callback();
				}
			}else{
				errors(key);
			}
		})['catch'](function(e){
			errors(e);
		});
	}
	
	return proto;
})