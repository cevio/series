;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./crypto-js/core"), require("./crypto-js/x64-core"), require("./crypto-js/lib-typedarrays"), require("./crypto-js/enc-utf16"), require("./crypto-js/enc-base64"), require("./crypto-js/md5"), require("./crypto-js/sha1"), require("./crypto-js/sha256"), require("./crypto-js/sha224"), require("./crypto-js/sha512"), require("./crypto-js/sha384"), require("./crypto-js/sha3"), require("./crypto-js/ripemd160"), require("./crypto-js/hmac"), require("./crypto-js/pbkdf2"), require("./crypto-js/evpkdf"), require("./crypto-js/cipher-core"), require("./crypto-js/mode-cfb"), require("./crypto-js/mode-ctr"), require("./crypto-js/mode-ctr-gladman"), require("./crypto-js/mode-ofb"), require("./crypto-js/mode-ecb"), require("./crypto-js/pad-ansix923"), require("./crypto-js/pad-iso10126"), require("./crypto-js/pad-iso97971"), require("./crypto-js/pad-zeropadding"), require("./crypto-js/pad-nopadding"), require("./crypto-js/format-hex"), require("./crypto-js/aes"), require("./crypto-js/tripledes"), require("./crypto-js/rc4"), require("./crypto-js/rabbit"), require("./crypto-js/rabbit-legacy"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./crypto-js/core", "./crypto-js/x64-core", "./crypto-js/lib-typedarrays", "./crypto-js/enc-utf16", "./crypto-js/enc-base64", "./crypto-js/md5", "./crypto-js/sha1", "./crypto-js/sha256", "./crypto-js/sha224", "./crypto-js/sha512", "./crypto-js/sha384", "./crypto-js/sha3", "./crypto-js/ripemd160", "./crypto-js/hmac", "./crypto-js/pbkdf2", "./crypto-js/evpkdf", "./crypto-js/cipher-core", "./crypto-js/mode-cfb", "./crypto-js/mode-ctr", "./crypto-js/mode-ctr-gladman", "./crypto-js/mode-ofb", "./crypto-js/mode-ecb", "./crypto-js/pad-ansix923", "./crypto-js/pad-iso10126", "./crypto-js/pad-iso97971", "./crypto-js/pad-zeropadding", "./crypto-js/pad-nopadding", "./crypto-js/format-hex", "./crypto-js/aes", "./crypto-js/tripledes", "./crypto-js/rc4", "./crypto-js/rabbit", "./crypto-js/rabbit-legacy"], factory);
	}
	else {
		// Global (browser)
		root.CryptoJS = factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	return CryptoJS;

}));