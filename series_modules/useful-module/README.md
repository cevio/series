# Useful Module
A node.js module doing a bunch of stuff like generating random numbers, passwords, format strings and number and more!

[![NPM](https://nodei.co/npm/useful-module.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/useful-module/)

## Documentation

### Functions

```javascript
makePass(length, options); // Generates a password with length characters. Options is a array.
  /*
  Valid options are
  caps -> Adds A-Z
  symbols -> Adds symbols
  letter -> Adds a-z
  num -> Adds 0-9
  */
  
  rNum(min, max); // Returns a random number between min and max.
  
  rHex(); // Returns a random hex color. 
  
  htmlEsc(str); // HTML Escapes str.
  
  remNum(str); // Removes any number from str.
  
  remSpace(str); // Removes any whitespace from str.
  
  s4(); // Returns a random string.
  
  guid(); // Returns a GUID.

  caesarShift(str, shift); // Shifts str by shift characters
  
  fib(7) // Returns 13
```

## Examples

#### makePass

```javascript
	var useful = require('useful-module');
    
    console.log(useful.makePass(10, ["caps", "symbols", "letter", "num"])); // Returns for example nT$#d9">*c
```

#### rNum

```javascript
	var useful = require('useful-module');
    console.log(useful.rNum(1,10)); // Returns for example 3
```

#### rHex

```javascript
	var useful = require('useful-module');
    console.log(useful.rHex()); // Returns for example ccc3e
```

#### htmlEsc

```javascript
	var useful = require('useful-module');
	console.log(useful.htmlEsc("Hello! <woo>")); // Returns Hello! &lt;woo&gt;
```

#### remNum

```javascript
	var useful = require('useful-module');
    console.log(useful.remNum("Hello 1234")); // Returns Hello
```

#### remSpace

```javascript
	var useful = require('useful-module');
    console.log(useful.remSpace("Hello World!")); // Returns HelloWorld!
```

#### s4

```javascript
	var useful = require('useful-module');
    console.log(useful.s4()); // Returns for example f6dc
```

#### guid

```javascript
	var useful = require('useful-module');
    console.log(useful.guid()); // Returns for example 57576f6a-9f63-b44b-d007-35ebb15d115b
```

#### caesarShift

```javascript
	var useful = require('useful-module');
	console.log(useful.caesarShift("Hello, World!", 13)); // Returns Uryyb, Jbeyq!
```

#### fib

```javascript
    var useful = require('useful-module');
    console.log(useful.fib(7)); // Returns 13
```

####  vig: function(msg, key, decode){

```javascript
	var useful = require('useful-module');
	console.log(useful.vig('Hello', 'World')); // BROKEN
```

#### int_to_roman

```javascript
	var useful = require('useful-module');
	console.log(useful.int_to_roman(1999)); // Returns MCMXCIX
```

#### romanParse

```javascript
	var useful = require('useful-module');
	console.log(useful.romanParse('MCMXCIX')); // Returns 1999
```

#### reverseStr

```javascript
	var useful = require('useful-module');
	console.log(useful.reverseStr('Hello, World!')); // Returns !dlroW ,olleH
```
