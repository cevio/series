/**
 * Module dependencies.
 */
var req = require('./request.js');
var res = require('./response.js');
var proto = require('./application.js');
var util = require('./utils.js');

/**
 * Expose `createApplication()`.
 */
exports = module.exports = createApplication;

/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */
function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };
	
	app.request = req;
	app.response = res;	
	app.request.app = app.response.app = app;

  util.merge(app, proto);
	app.init();
  
  return app;
}

/**
 * Expose the prototypes.
 */

exports.application = proto;
exports.request = req;
exports.response = res;

/**
 * mixin middlewares.
 */
createApplication.template = require('./middlewares/template.js');
createApplication.sessionParse = require('./middlewares/sessionParse.js');
createApplication.applicationParse = require('./middlewares/applicationParse.js');
createApplication.cookieParse = require('./middlewares/cookieParse.js');
createApplication.bodyParse = require('./middlewares/bodyParse.js');
createApplication.jsonpParse = require('./middlewares/jsonpParse.js');