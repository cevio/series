var Jmail = require('Jmail');

exports.send = function( users, title, content, option ){
	var result = Jmail.SendMail( users, title, content, option );
	
	if (result.success) {
		return ['success', 'send success!'];
	}else{
		return ['error', result.message];
	}
}