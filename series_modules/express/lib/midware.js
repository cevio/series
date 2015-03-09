/**
 * Initialization middleware, exposing the
 * request and response to each other, as well
 * as defaulting the X-Powered-By header field.
 *
 * @param {Function} app
 * @return {Function}
 * @api private
 */

var util = require('./utils.js');

exports.init = function(app){
  return function expressInit(req, res, next){
    if (app.enabled('x-powered-by')) res.set('X-Powered-By', 'Express');
    req.res = res;
    res.req = req;
    req.next = next;
		
		util.merge(req, app.request);
		util.merge(res, app.response);
		
		res.locals = app.locals;
		res.render = app.render.bind(app);
    next();
  };
};

