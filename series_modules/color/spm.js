exports.test = function(input){
	try {
		var Color = require('color');
		var color = input ? Color(input) : Color('green')
		
		var values = [];
		values.push( ' color.rgb(): ' + JSON.stringify(color.rgb()) );
		values.push( ' color.rgbArray(): ' + JSON.stringify(color.rgbArray()) );
		values.push( ' color.hslString(): ' + JSON.stringify(color.hslString()) );
		values.push( ' color.hexString(): ' + JSON.stringify(color.hexString()) );
		values.push( ' color.rgbString(): ' + JSON.stringify(color.rgbString()) );
		values.push( ' color.percentString(): ' + JSON.stringify(color.percentString()) );
		values.push( ' color.hwbString(): ' + JSON.stringify(color.hwbString()) );
		values.push( ' color.keyword(): ' + JSON.stringify(color.keyword()) );	
		values.push( ' color.luminosity(): ' + JSON.stringify(color.luminosity()) );
		
		for (var i=0; i<values.length; i++) {
			values[i] = '<font color="' + color.hexString() + '">- # {0}</font>'.replace('{0}', values[i])
		}
		return ['success', values];
	}catch(e){
		return ['error', e.message];
	}
}