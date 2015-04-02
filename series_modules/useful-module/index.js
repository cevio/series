/*
Copyright 2015 Max Thor
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
module.exports = {
    makePass: function(a, b) {
        for (pos = "", pass = "", b.indexOf("caps") > -1 && (pos += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"), b.indexOf("symbols") > -1 && (pos += "`!'\"?$%^&*()_-+={[}]:;@~#|\\<,>./"), b.indexOf("letter") > -1 && (pos += "abcdefghijklmnopqrstuvwxyz"), b.indexOf("num") > -1 && (pos += "1234567890"), x = 0; a > x;) num = Math.floor(Math.random() * (pos.length - 1 - 0 + 1)) + 0, pass += pos[num], x++;
        return pass;
    },
    rNum: function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    rHex: function(){
        return Math.floor(Math.random()*16777215).toString(16);
    },
    htmlEsc: function(string, quote_style, charset, double_encode) {
      var optTemp = 0,
        i = 0,
        noquotes = false;
      if (typeof quote_style === 'undefined' || quote_style === null) {
        quote_style = 2;
      }
      string = string.toString();
      if (double_encode !== false) { // Put this first to avoid double-encoding
        string = string.replace(/&/g, '&amp;');
      }
      string = string.replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
      var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE': 1,
        'ENT_HTML_QUOTE_DOUBLE': 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE': 4
      };
      if (quote_style === 0) {
        noquotes = true;
      }
      if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
        quote_style = [].concat(quote_style);
        for (i = 0; i < quote_style.length; i++) {
          // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
          if (OPTS[quote_style[i]] === 0) {
            noquotes = true;
          } else if (OPTS[quote_style[i]]) {
            optTemp = optTemp | OPTS[quote_style[i]];
          }
        }
        quote_style = optTemp;
      }
      if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/'/g, '&#039;');
      }
      if (!noquotes) {
        string = string.replace(/"/g, '&quot;');
      }
    
      return string;
    },
    remNum: function(str){
        return str.replace(/[0-9]/g, '');
    },
    remSpace: function(str){
        return str.replace(/\s+/g, '');
    },
    s4: function(){
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    },
    guid: function(){
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
    this.s4() + '-' + this.s4() + this.s4() + this.s4();
    },
    caesarShift: function(text, shift) {
	var result = "";
		for (var i = 0; i < text.length; i++) {
		var c = text.charCodeAt(i);
		if      (c >= 65 && c <=  90) result += String.fromCharCode((c - 65 + shift) % 26 + 65);  // Uppercase
		else if (c >= 97 && c <= 122) result += String.fromCharCode((c - 97 + shift) % 26 + 97);  // Lowercase
		else                          result += text.charAt(i);  // Copy
	}
	return result;
    },
    
    fib: function(n) {
      if (n < 2) {
        return n;
      } else {
        return fib(n - 1) + fib(n - 2);
      }
    }
};
