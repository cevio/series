// format objects.
var _ = Global._;
if ( Global.setTimeout ){
	var setTimeout = Global.setTimeout;
};
if ( !_.trim ){
	_.trim = function(str){
		if ( _.isString(str) ){
			return str.trim();
		}else{
			return str;
		}
	}
}
var setImmediate = setImmediate || function(handle){
  var args = Array.prototype.slice.call(arguments,1);
  var invoke = function(){ handle.apply(self,args); };
  if( Promise )
    Promise.resolve().then(invoke);
  else if(!-[1,]){
    var head = document.documentElement.firstChild;
    var script = document.createElement("script");
    script.onreadystatechange = function(){
      script.onreadystatechange = null;
      head.removeChild(script);
      invoke();
    };
    head.appendChild(script);
  }else setTimeout(invoke);
};