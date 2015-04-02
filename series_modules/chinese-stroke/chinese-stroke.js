var stroke = {},
    stroke_data = require('./lib/stroke_data.json');

stroke.get = function(char) {
    var xcode;
    if (char == null) {
      char = '';
    }
    xcode = escape(char).replace('%u', '');
    if (stroke_data[xcode]) {
      return stroke_data[xcode];
    } else {
      return NaN;
    }
};

module.exports = stroke;
