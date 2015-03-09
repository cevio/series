var 
	url = require('url'),
	req = module.exports = new url();

req.params = {};
req.query = {};

req.protocol = process.env.SERVER_PORT;
req.ip = process.env.LOCAL_ADDR || process.env.REMOTE_ADDR || process.env.REMOTE_HOST;
req.agent = process.env.HTTP_USER_AGENT;
req.method = process.env.REQUEST_METHOD.toLowerCase();