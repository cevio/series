// JavaScript Document
define(['jquery'], function($){
	var proto = {};
	
	proto.download = function(from, to){
		if ( !from || !to ){
			spm.put('error', '[from] and [to] arguments required.');
			return Promise.reject();
		};
		
		return spm.send('debris size ' + from).then(function(){
			var percent = spm.ui.percent();
			return new Promise(function(resolve, reject){
				debrisDownload('debris download ' + from + ' ' + to, percent, function(){
					percent.stop();
					resolve();
				}, function(e){
					spm.put('error', e.message);
					percent.stop();
					reject(e);
				});
			});
		});
	}
	
	
	
	function debrisDownload(cmd, masker, callback, errors){
		var that = this;
		spm.local({cmd: cmd}).then(function(key){
			if ( key.error === 0 ){
				if ( key.percent < 1 ){
					masker.set(key.percent);
					debrisDownload(cmd, masker, callback, errors);
				}else{
					masker.set(1);
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