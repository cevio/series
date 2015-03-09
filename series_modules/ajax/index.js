var ajax=module.exports=new Class(function(){this.ajaxResponseCompileError(function(c,a,b){throw new Error("ajaxResponseCompileError: "+c.message)})}),ResponseDataTypes={};ajax.instance(event).extend(event);ajax.property("object",new ActiveXObject("Microsoft.XMLHTTP"));function toURLQueryString(c){if(_.isUndefined(c)||_.isNull(c)||c===false||c===0||c===""){return null}if(typeof c==="object"){var a=[],b;for(b in c){a.push(b+"="+c[b])}return a.join("&")}else{return c}}function modifyDataResponse(b,c,d,a){return _.isFunction(ResponseDataTypes[c])?ResponseDataTypes[c].call(ResponseDataTypes,b,d,a):null}function BinaryToString(c,d){var b=new ActiveXObject("Adodb.Stream"),a;b.Type=1;b.Mode=3;b.Open;b.Write(c);b.Position=0;b.Type=2;b.Charset=d;a=b.ReadText;b.Close;return a}ResponseDataTypes.xml=ResponseDataTypes.html=ResponseDataTypes.text=function(a,b){return BinaryToString(a.responseBody,b)};ResponseDataTypes.json=function(a,b){return JSON.parse(this.text(a,b))};ResponseDataTypes.binary=function(a,b){return a.responseBody};ResponseDataTypes.script=function(b,g){var d=this.text(b,g),a=["exports","module"],f=["return function ("+a.join(",")+"){",d,"};"].join("\n"),c=(new Function(f))(),e={};e.exports={};c(e.exports,e);return e.exports};ajax.property("defaults",{type:"GET",accepts:null,data:null,dataType:"text",url:"",scriptCharset:Response.Charset||"utf-8",async:false,success:null,error:null,complete:null,beforeSend:null,statusCode:{},cache:true,contents:null,contentType:null,contents:{},context:null,converters:'{"* text": window.String, "text html": true, "text json": JSON.parse, "text xml": JSON.parseXML}',global:true,headers:{},timeout:60*1000,xhr:null});ajax.define("main",function(b){var e=this,a=this["private"]("object"),f=_.clone(this["private"]("defaults")),c=a,h=new Date().getTime(),d=null;b=_.extend(f,b);if(b.xhr){a=b.xhr}if(/^get$/i.test(b.type)&&b.data){var g=toURLQueryString(b.data);if(g!==null&&g.length>0){b.url=b.url.indexOf("?")>-1?b.url+"&"+g:b.url+"?"+g;b.data=null}}if(b.context){c=b.context}a.open(b.type.toUpperCase(),b.url,b.async);_.each(b.headers,function(j,i){a.setRequestHeader(i,j)});if(b.type.toUpperCase()==="POST"){a.setRequestHeader("Content-Type","application/x-www-form-urlencoded")}else{if(b.contentType){a.setRequestHeader("Content-Type",b.contentType)}}if(b.accepts&&b.accepts.length>0){a.setRequestHeader("Accept",b.accepts)}if(b.cache===false){a.setRequestHeader("Cache-Control","no-cache, must-revalidate")}else{a.setRequestHeader("Cache-Control","max-age=30")}a.onreadystatechange=function(){if(b.global){try{e.emit("ajaxSend",a,a.status)}catch(i){}}if(b.statusCode&&b.statusCode.length){_.each(b.statusCode,function(j,k){if(Number(k)===a.status){_.isFunction(j)&&j.call(c,a)}})}if(new Date().getTime()-h>=b.timeout){if(b.global){try{e.emit("ajaxStop",a,c)}catch(i){}}a.abort()}if(a.readyState===4){if(a.status===200){try{d=modifyDataResponse(a,b.dataType,b.scriptCharset,b.url)}catch(i){if(b.global){try{e.emit("ajaxResponseCompileError",i,a,c)}catch(i){}}}if(b.global){try{e.emit("ajaxSuccess",d,a,c)}catch(i){}}if(_.isFunction(b.success)){b.success.call(c,d,a)}}}};b.global&&this.emit("ajaxStart",a,c);_.isFunction(b.beforeSend)&&b.beforeSend.call(c,a);if(b.type.toUpperCase()==="POST"){a.send(toURLQueryString(b.data))}else{a.send(null)}if(a.status!==200&&_.isFunction(b.error)){b.global&&this.emit("ajaxError",a,a.status);b.error.call(c,a,a.status)}b.global&&this.emit("ajaxComplete",d,a,c);_.isFunction(b.complete)&&b.complete.call(c,a);return d});_.each(["ajaxComplete","ajaxError","ajaxSend","ajaxStart","ajaxStop","ajaxSuccess","ajaxResponseCompileError"],function(a){ajax.define(a,function(b){this.one(a,b)})});ajax.define("ajaxSetup",function(a){var b=_.clone(this["private"]("defaults"));a=_.extend(b,a);this.property("defaults",a)});var methods={get:["GET","text"],getJSON:["GET","json"],getScript:["GET","script"],getBinary:["GET","binary"],post:["POST","text"],postJSON:["POST","json"],postScript:["POST","script"],postBinary:["POST","binary"]};_.each(methods,function(a,b){ajax.define(b,function(){var c,d,f;_.each(arguments,function(g){if(_.isString(g)){c=g}else{if(_.isFunction(g)){f=g}else{d=g}}});var e={url:c,type:a[0],dataType:a[1]};if(d){e.data=d}if(f){e.success=f}return this.main(e)})});