(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define([], mod);
    }
    else {
        window.crc32 = mod();
    }
})(function () {
	
	function GetCrc32(Path){
		
		/*shmshz*/
		var Crc32Table=new Array(256),
			i,
			j,
			Crc;
			
		for(i = 0; i < 256; i++){
			Crc=i;
			for(j=0; j<8; j++){
				if(Crc & 1){
					Crc=((Crc >> 1)& 0x7FFFFFFF) ^ 0xEDB88320;
				}else{
					Crc=((Crc >> 1)& 0x7FFFFFFF);
				}
			}
			Crc32Table[i]=Crc;
		};
		
		Crc=0xFFFFFFFF;
		var objAdo=new ActiveXObject('Adodb.Stream');
	    	objAdo.Open;
	    	objAdo.Type = 1;
	    	objAdo.LoadFromFile(Path);
			objAdo.Position = 0;
		var stream = objAdo.read();
			objAdo.Close;
			objAdo = null;

		var buf = [];	/*将stream转换为buf数组，取代AscB函数*/
		with (new ActiveXObject('Microsoft.XMLDOM').createElement('node')) {
			dataType = 'bin.hex';
			nodeTypedValue = stream;
			var hex = text;
			hex.replace(/../g, function($0) {
				buf.push(parseInt($0, 16));
			});
		};
		
		for (var i=0; i<buf.length; i++) {
			Crc=((Crc >> 8)&0x00FFFFFF) ^ Crc32Table[(Crc & 0xFF)^ buf[i]];
		}
		
		if (Crc<0){
			Crc=-Number(Crc)-1;
		}
		else{
			Crc=4294967296-Crc-1;
		}

		return Crc.toString(16).toUpperCase();
	};
	
	return GetCrc32;
	
});