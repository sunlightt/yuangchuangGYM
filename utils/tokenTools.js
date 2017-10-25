/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free. You can redistribute it and/or modify it.
 */
/*
 * Interfaces:
 * utf8 = utf16to8(utf16);
 * utf16 = utf8to16(utf8);
 */
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(g,l){var e={},d=e.lib={},m=function(){},k=d.Base={extend:function(a){m.prototype=this;var c=new m;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
p=d.WordArray=k.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=l?c:4*a.length},toString:function(a){return(a||n).stringify(this)},concat:function(a){var c=this.words,q=a.words,f=this.sigBytes;a=a.sigBytes;this.clamp();if(f%4)for(var b=0;b<a;b++)c[f+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((f+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[f+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=g.ceil(c/4)},clone:function(){var a=k.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*g.random()|0);return new p.init(c,a)}}),b=e.enc={},n=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++){var d=c[f>>>2]>>>24-8*(f%4)&255;b.push((d>>>4).toString(16));b.push((d&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f+=2)b[f>>>3]|=parseInt(a.substr(f,
2),16)<<24-4*(f%8);return new p.init(b,c/2)}},j=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++)b.push(String.fromCharCode(c[f>>>2]>>>24-8*(f%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f++)b[f>>>2]|=(a.charCodeAt(f)&255)<<24-8*(f%4);return new p.init(b,c)}},h=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(j.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return j.parse(unescape(encodeURIComponent(a)))}},
r=d.BufferedBlockAlgorithm=k.extend({reset:function(){this._data=new p.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=h.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,f=c.sigBytes,d=this.blockSize,e=f/(4*d),e=a?g.ceil(e):g.max((e|0)-this._minBufferSize,0);a=e*d;f=g.min(4*a,f);if(a){for(var k=0;k<a;k+=d)this._doProcessBlock(b,k);k=b.splice(0,a);c.sigBytes-=f}return new p.init(k,f)},clone:function(){var a=k.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});d.Hasher=r.extend({cfg:k.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){r.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,d){return(new a.init(d)).finalize(b)}},_createHmacHelper:function(a){return function(b,d){return(new s.HMAC.init(a,
d)).finalize(b)}}});var s=e.algo={};return e}(Math);
(function(){var g=CryptoJS,l=g.lib,e=l.WordArray,d=l.Hasher,m=[],l=g.algo.SHA1=d.extend({_doReset:function(){this._hash=new e.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(d,e){for(var b=this._hash.words,n=b[0],j=b[1],h=b[2],g=b[3],l=b[4],a=0;80>a;a++){if(16>a)m[a]=d[e+a]|0;else{var c=m[a-3]^m[a-8]^m[a-14]^m[a-16];m[a]=c<<1|c>>>31}c=(n<<5|n>>>27)+l+m[a];c=20>a?c+((j&h|~j&g)+1518500249):40>a?c+((j^h^g)+1859775393):60>a?c+((j&h|j&g|h&g)-1894007588):c+((j^h^
g)-899497514);l=g;g=h;h=j<<30|j>>>2;j=n;n=c}b[0]=b[0]+n|0;b[1]=b[1]+j|0;b[2]=b[2]+h|0;b[3]=b[3]+g|0;b[4]=b[4]+l|0},_doFinalize:function(){var d=this._data,e=d.words,b=8*this._nDataBytes,g=8*d.sigBytes;e[g>>>5]|=128<<24-g%32;e[(g+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(g+64>>>9<<4)+15]=b;d.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=d.clone.call(this);e._hash=this._hash.clone();return e}});g.SHA1=d._createHelper(l);g.HmacSHA1=d._createHmacHelper(l)})();
(function(){var g=CryptoJS,l=g.enc.Utf8;g.algo.HMAC=g.lib.Base.extend({init:function(e,d){e=this._hasher=new e.init;"string"==typeof d&&(d=l.parse(d));var g=e.blockSize,k=4*g;d.sigBytes>k&&(d=e.finalize(d));d.clamp();for(var p=this._oKey=d.clone(),b=this._iKey=d.clone(),n=p.words,j=b.words,h=0;h<g;h++)n[h]^=1549556828,j[h]^=909522486;p.sigBytes=b.sigBytes=k;this.reset()},reset:function(){var e=this._hasher;e.reset();e.update(this._iKey)},update:function(e){this._hasher.update(e);return this},finalize:function(e){var d=
this._hasher;e=d.finalize(e);d.reset();return d.finalize(this._oKey.clone().concat(e))}})})();

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function(){var h=CryptoJS,j=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();b=[];for(var a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));for(var c=[],a=0,d=0;d<
e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return j.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
function utf16to8(str) {
	var out, i, len, c;
	out = "";
	len = str.length;
	for (i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
}

function utf8to16(str) {
	var out, i, len, c;
	var char2, char3;
	out = "";
	len = str.length;
	i = 0;
	while (i < len) {
		c = str.charCodeAt(i++);
		switch (c >> 4) {
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
			// 0xxxxxxx
			out += str.charAt(i - 1);
			break;
		case 12:
		case 13:
			// 110x xxxx 10xx xxxx
			char2 = str.charCodeAt(i++);
			out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
			break;
		case 14:
			// 1110 xxxx 10xx xxxx 10xx xxxx
			char2 = str.charCodeAt(i++);
			char3 = str.charCodeAt(i++);
			out += String.fromCharCode(((c & 0x0F) << 12)
					| ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
			break;
		}
	}
	return out;
}

//========================================================




/*
 * Interfaces:
 * b64 = base64encode(data);
 * data = base64decode(b64);
 */
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1) break;
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1) break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61) return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1) break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61) return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1) break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}
var safe64 = function(base64) {
    base64 = base64.replace(/\+/g, "-");
    base64 = base64.replace(/\//g, "_");
    return base64;
};

var date = new Date()
var date1 = parseInt(date.getTime() / 1000 + 3600);
var accessKey = "2Z4Zi-M9BKwnpOcDqp6EIy4-zk0KJpbTUiDsDA_o";
var secretKey = "4dKOfBPMABz_PX21wyyAoDyY0Oqw5yzkQgxguGFg";
var putPolicy = { "scope": "traveltogether", "deadline": date1 };
var put_policy = JSON.stringify(putPolicy);
var encoded =base64encode(utf16to8(put_policy));
var hash=CryptoJS.HmacSHA1(encoded,secretKey);
var encoded_signed = hash.toString(CryptoJS.enc.Base64);
var upload_token = accessKey + ":" + safe64(encoded_signed) + ":" + encoded;
console.group('七牛upload_token');
console.log(upload_token);
console.groupEnd();
module.exports = {
  upload_token: upload_token
}


