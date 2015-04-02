var module = QR = require('qr-encode');

var shorts = {
	'-t': 'type',
	'-l': 'level',
	'-s': 'size',
	'-m': 'margin'
}

exports.gen = function(){
	try {
		var option = {};
		
		var args = arguments;
		for (var i=1; i<args.length; i++) {
			if (/^-[a-zA-Z]$/.test(args[i])) {
				if ( shorts[args[i]] && args[i+1] ) {
					option[shorts[args[i]]] = args[i+1];
					i++;
				}
			}
		}
		
		var QRCODE = QR(args[0], option);
		return ['success', '<img src="' + QRCODE.dataURI + '" />'];
	}catch(e){
		return ['error', e.message];
	}
}

exports.help = function(){
	var h = [];

	h.push('Demo:');
	h.push('qr-encode gen hello -t 6 -l Q -s 6');
	
	h.push('CLI Options:');
	h.push('  -t, --type');
	h.push('  -l, --level [L|M|Q|H]');
	h.push('  -s, --size');
	h.push('  -m, --margin');
	
	for (var i=0; i<h.length; i++) {
		h[i] = h[i].replace(/\s/g, '&nbsp;')
		h[i] = '<font color="#F4D">- > {0}</font>'.replace('{0}', h[i]);
	}
	
	return ['list', 'qr-code help', h];
}