// JavaScript Document

function BinaryToString(text, charset){
	var obj = new ActiveXObject("Adodb.Stream"), 
		ret;
		obj.Type = 1;
		obj.Mode = 3;
		obj.Open;
		obj.Write(text);
		obj.Position = 0;
		obj.Type = 2;
		obj.Charset = charset || Response.Charset || 'utf-8';
		ret = obj.ReadText;
		obj.Close;

	return ret;
}

exports.b2s = BinaryToString;