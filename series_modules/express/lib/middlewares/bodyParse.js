// JavaScript Document
module.exports = function(){
	return function(req, res, next){
		req.body = req.formAll();
		next();
	}
};