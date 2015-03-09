/**
 * mixin support.
 *
 * @old target object
 * @my source object
 * @bOverwrite can been writen
 */
exports.mixin = function( my, old, bOverwrite ) {
	var my = my || {},
		key,
		bOverwrite = bOverwrite || false;  

	for ( key in old ) {
		if ( old.hasOwnProperty(key) ) {
			if( typeof my[key] != 'undefined' && bOverwrite ){
				continue;
			}
			var fn = old[key];
			my[key] = fn;
		}
	}
	
	return my;
}

/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *
 *     merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api public
 */

exports.merge = function(a, b, c){
  if (a && b) {
    for (var key in b) {
      a[key] = _.isFunction(b[key]) && c ? b[key].bind(c) : b[key];
    }
  }
  return a;
};

/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 * @api private
 */

exports.escapeHTML = function(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
