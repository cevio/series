var req = module.exports = require('url');
var utils = require('./utils');

req.params = {};

req.ip = process.env.LOCAL_ADDR || process.env.REMOTE_ADDR || process.env.REMOTE_HOST;
req.method = process.env.REQUEST_METHOD.toLowerCase();

var url = process.env.QUERY_STRING;
var defaultFile = "default.asp";

if ( /^404\;/.test(url) ){
	url = url.substr(4);
}else{
	url = process.env.PATH_INFO;
	if ( url.toLowerCase() === '/' + defaultFile.toLowerCase() ) url = '/';
	url = 'http://' + process.env.HTTP_HOST + (process.env.SERVER_PORT == '80' ? '' : ':' + process.env.SERVER_PORT) + url;
};

req = utils.mixin(req, req.parse(url));
req.url = req.path;

if ( !_.isObject(req.query) && req.search ){
	req.query = _.fromQuery(req.search.substring(1).replace(/^\&/, ''));
}else{
	req.query = {};
}