// ---------------------------------------------------------------------------------------------------
// Factory do módulo 'core.security'  
// ---------------------------------------------------------------------------------------------------
(function () {
    'use strict';

    angular
        .module('core.security')
        .factory('securityServices', securityServices);

    securityServices.$inject = [
    ];

    function securityServices() {
        // Retorno do serviço
        var service = {
            computeHash384: computeHash384
        };

        return service;

        // ---------------------------------------------------------------------------------------------------            
        //@desenvolvedor Kiddo Labs
        // ---------------------------------------------------------------------------------------------------
        function computeHash384 (toHash, salt) {
            // ===================================================================
            // Hash384 personalizado para o App Guia da Produção
            // ===================================================================
            function hash384(senha, matricula) {
                var salt = matricula.toUpperCase();
                var shaObj = new jsSHA("SHA-384", "TEXT", {
                    encoding: "UTF8"
                });
                shaObj.update(senha + salt);
                return shaObj.getHash("B64") + Base64.encode(salt);
            }
            
            // ===================================================================
            // Base64
            // ===================================================================
            var Base64 = {
                // private property
                _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

                // public method for encoding
                encode: function (input) {
                    var output = "";
                    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                    var i = 0;

                    input = Base64._utf8_encode(input);

                    while (i < input.length) {

                        chr1 = input.charCodeAt(i++);
                        chr2 = input.charCodeAt(i++);
                        chr3 = input.charCodeAt(i++);

                        enc1 = chr1 >> 2;
                        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                        enc4 = chr3 & 63;

                        if (isNaN(chr2)) {
                            enc3 = enc4 = 64;
                        } else if (isNaN(chr3)) {
                            enc4 = 64;
                        }

                        output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
                    }

                    return output;
                },

                // public method for decoding
                decode: function (input) {
                    var output = "";
                    var chr1, chr2, chr3;
                    var enc1, enc2, enc3, enc4;
                    var i = 0;

                    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                    while (i < input.length) {

                        enc1 = this._keyStr.indexOf(input.charAt(i++));
                        enc2 = this._keyStr.indexOf(input.charAt(i++));
                        enc3 = this._keyStr.indexOf(input.charAt(i++));
                        enc4 = this._keyStr.indexOf(input.charAt(i++));

                        chr1 = (enc1 << 2) | (enc2 >> 4);
                        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                        chr3 = ((enc3 & 3) << 6) | enc4;

                        output = output + String.fromCharCode(chr1);

                        if (enc3 != 64) {
                            output = output + String.fromCharCode(chr2);
                        }
                        
                        if (enc4 != 64) {
                            output = output + String.fromCharCode(chr3);
                        }
                    }

                    output = Base64._utf8_decode(output);

                    return output;
                },

                // private method for UTF-8 encoding
                _utf8_encode: function (string) {
                    string = string.replace(/\r\n/g, "\n");
                    var utftext = "";

                    for (var n = 0; n < string.length; n++) {
                        var c = string.charCodeAt(n);

                        if (c < 128) {
                            utftext += String.fromCharCode(c);
                        } else if ((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                        } else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                    }

                    return utftext;
                },

                // private method for UTF-8 decoding
                _utf8_decode: function (utftext) {
                    var string = "";
                    var i = 0;
                    var c = c1 = c2 = 0;

                    while (i < utftext.length) {

                        c = utftext.charCodeAt(i);

                        if (c < 128) {
                            string += String.fromCharCode(c);
                            i++;
                        } else if ((c > 191) && (c < 224)) {
                            c2 = utftext.charCodeAt(i + 1);
                            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                            i += 2;
                        } else {
                            c2 = utftext.charCodeAt(i + 1);
                            c3 = utftext.charCodeAt(i + 2);
                            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                            i += 3;
                        }
                    }

                    return string;
                }
            };

            // ===================================================================
            // jsSHA
            // ===================================================================
            function jsSHA(p, c, a) {
                var b = 0,
                    f = [],
                    e = 0,
                    g, h, m, k, l, r, t, n = !1,
                    u = !1,
                    v = [],
                    A = [],
                    w, B = !1;
                a = a || {};
                g = a.encoding || "UTF8";
                w = a.numRounds || 1;
                m = C(c, g);
                if (w !== parseInt(w, 10) || 1 > w) throw Error("numRounds must a integer >= 1");
                r = function (c, a) {
                    return D(c, a, p)
                };
                t = function (c, a, d, e) {
                    var f, b;
                    if ("SHA-384" === p || "SHA-512" === p) f = (a + 129 >>> 10 << 5) + 31, b = 32;
                    else throw Error("Unexpected error in SHA-2 implementation");
                    for (; c.length <= f;) c.push(0);
                    c[a >>> 5] |= 128 << 24 - a % 32;
                    c[f] = a + d;
                    d = c.length;
                    for (a = 0; a < d; a += b) e = D(c.slice(a,
                        a + b), e, p);
                    if ("SHA-384" === p) c = [e[0].a, e[0].b, e[1].a, e[1].b, e[2].a, e[2].b, e[3].a, e[3].b, e[4].a, e[4].b, e[5].a, e[5].b];
                    else if ("SHA-512" === p) c = [e[0].a, e[0].b, e[1].a, e[1].b, e[2].a, e[2].b, e[3].a, e[3].b, e[4].a, e[4].b, e[5].a, e[5].b, e[6].a, e[6].b, e[7].a, e[7].b];
                    else throw Error("Unexpected error in SHA-2 implementation");
                    return c
                };
                if ("SHA-384" === p) l = 1024, k = 384;
                else if ("SHA-512" === p) l = 1024, k = 512;
                else throw Error("Chosen SHA variant is not supported");
                h = y(p);
                this.setHMACKey = function (c, a, d) {
                    var e;
                    if (!0 === u) throw Error("HMAC key already set");
                    if (!0 === n) throw Error("Cannot set HMAC key after finalizing hash");
                    if (!0 === B) throw Error("Cannot set HMAC key after calling update");
                    g = (d || {}).encoding || "UTF8";
                    a = C(a, g)(c);
                    c = a.binLen;
                    a = a.value;
                    e = l >>> 3;
                    d = e / 4 - 1;
                    if (e < c / 8) {
                        for (a = t(a, c, 0, y(p)); a.length <= d;) a.push(0);
                        a[d] &= 4294967040
                    } else if (e > c / 8) {
                        for (; a.length <= d;) a.push(0);
                        a[d] &= 4294967040
                    }
                    for (c = 0; c <= d; c += 1) v[c] = a[c] ^ 909522486, A[c] = a[c] ^ 1549556828;
                    h = r(v, h);
                    b = l;
                    u = !0
                };
                this.update = function (c) {
                    var a, p, d, g = 0,
                        k = l >>> 5;
                    a = m(c, f, e);
                    c = a.binLen;
                    p = a.value;
                    a = c >>> 5;
                    for (d = 0; d < a; d += k) g + l <= c && (h = r(p.slice(d, d + k), h), g += l);
                    b += g;
                    f = p.slice(g >>> 5);
                    e = c % l;
                    B = !0
                };
                this.getHash = function (c, a) {
                    var d, g, l;
                    if (!0 === u) throw Error("Cannot call getHash after setting HMAC key");
                    l = E(a);
                    switch (c) {
                        case "HEX":
                            d = function (c) {
                                return F(c, l)
                            };
                            break;
                        case "B64":
                            d = function (c) {
                                return G(c, l)
                            };
                            break;
                        case "BYTES":
                            d = H;
                            break;
                        default:
                            throw Error("format must be HEX, B64, or BYTES");
                    }
                    if (!1 === n)
                        for (h = t(f, e, b, h), g = 1; g < w; g += 1) h = t(h, k, 0, y(p));
                    n = !0;
                    return d(h)
                };
                this.getHMAC = function (c, a) {
                    var d, g, m;
                    if (!1 === u) throw Error("Cannot call getHMAC without first setting HMAC key");
                    m = E(a);
                    switch (c) {
                        case "HEX":
                            d = function (c) {
                                return F(c, m)
                            };
                            break;
                        case "B64":
                            d = function (c) {
                                return G(c, m)
                            };
                            break;
                        case "BYTES":
                            d = H;
                            break;
                        default:
                            throw Error("outputFormat must be HEX, B64, or BYTES");
                    }!1 === n && (g = t(f, e, b, h), h = r(A, y(p)), h = t(g, k, l, h));
                    n = !0;
                    return d(h)
                }
            }

            function a(a, c) {
                this.a = a;
                this.b = c
            }

            function L(a, c, d) {
                var b = a.length,
                    f, e, g, h, m;
                c = c || [0];
                d = d || 0;
                m = d >>> 3;
                if (0 !== b % 2) throw Error("String of HEX type must be in byte increments");
                for (f = 0; f < b; f += 2) {
                    e = parseInt(a.substr(f, 2), 16);
                    if (isNaN(e)) throw Error("String of HEX type contains invalid characters");
                    h = (f >>> 1) + m;
                    for (g = h >>> 2; c.length <= g;) c.push(0);
                    c[g] |= e << 8 * (3 - h % 4)
                }
                return {
                    value: c,
                    binLen: 4 * b + d
                }
            }

            function M(a, c, d) {
                var b = [],
                    f, e, g, h, b = c || [0];
                d = d || 0;
                e = d >>> 3;
                for (f = 0; f < a.length; f += 1) c = a.charCodeAt(f), h = f + e, g = h >>> 2, b.length <= g && b.push(0), b[g] |= c << 8 * (3 - h % 4);
                return {
                    value: b,
                    binLen: 8 * a.length + d
                }
            }

            function N(a, c, d) {
                var b = [],
                    f = 0,
                    e, g, h, m, k, l, b = c || [0];
                d = d || 0;
                c = d >>> 3;
                if (-1 === a.search(/^[a-zA-Z0-9=+\/]+$/)) throw Error("Invalid character in base-64 string");
                g = a.indexOf("=");
                a = a.replace(/\=/g, "");
                if (-1 !== g && g < a.length) throw Error("Invalid '=' found in base-64 string");
                for (g = 0; g < a.length; g += 4) {
                    k = a.substr(g, 4);
                    for (h = m = 0; h < k.length; h += 1) e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(k[h]), m |= e << 18 - 6 * h;
                    for (h = 0; h < k.length - 1; h += 1) {
                        l = f + c;
                        for (e = l >>> 2; b.length <= e;) b.push(0);
                        b[e] |= (m >>> 16 - 8 * h & 255) << 8 * (3 - l % 4);
                        f += 1
                    }
                }
                return {
                    value: b,
                    binLen: 8 * f + d
                }
            }

            function F(a, c) {
                var d = "",
                    b = 4 * a.length,
                    f, e;
                for (f = 0; f < b; f += 1) e = a[f >>> 2] >>> 8 * (3 - f % 4), d += "0123456789abcdef".charAt(e >>> 4 & 15) + "0123456789abcdef".charAt(e & 15);
                return c.outputUpper ? d.toUpperCase() : d
            }

            function G(a, c) {
                var d = "",
                    b = 4 * a.length,
                    f, e, g;
                for (f = 0; f < b; f += 3)
                    for (g = f + 1 >>> 2, e = a.length <= g ? 0 : a[g], g = f + 2 >>> 2, g = a.length <= g ? 0 : a[g], g = (a[f >>> 2] >>> 8 * (3 - f % 4) & 255) << 16 | (e >>> 8 * (3 - (f + 1) % 4) & 255) << 8 | g >>> 8 * (3 - (f + 2) % 4) & 255, e = 0; 4 > e; e += 1) 8 * f + 6 * e <= 32 * a.length ? d += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(g >>> 6 * (3 - e) & 63) : d += c.b64Pad;
                return d
            }

            function H(a) {
                var c = "",
                    d = 4 * a.length,
                    b, f;
                for (b = 0; b < d; b += 1) f = a[b >>> 2] >>> 8 * (3 - b % 4) & 255, c += String.fromCharCode(f);
                return c
            }

            function E(a) {
                var c = {
                    outputUpper: !1,
                    b64Pad: "="
                };
                a = a || {};
                c.outputUpper = a.outputUpper || !1;
                !0 === a.hasOwnProperty("b64Pad") && (c.b64Pad = a.b64Pad);
                if ("boolean" !== typeof c.outputUpper) throw Error("Invalid outputUpper formatting option");
                if ("string" !== typeof c.b64Pad) throw Error("Invalid b64Pad formatting option");
                return c
            }

            function C(a, c) {
                var d;
                switch (c) {
                    case "UTF8":
                    case "UTF16BE":
                    case "UTF16LE":
                        break;
                    default:
                        throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");
                }
                switch (a) {
                    case "HEX":
                        d = L;
                        break;
                    case "TEXT":
                        d = function (a, d, e) {
                            var b = [],
                                p = [],
                                m = 0,
                                k, l, r, t, n, b = d || [0];
                            d = e || 0;
                            r = d >>> 3;
                            if ("UTF8" === c)
                                for (k = 0; k < a.length; k += 1)
                                    for (e = a.charCodeAt(k), p = [], 128 > e ? p.push(e) : 2048 > e ? (p.push(192 | e >>> 6), p.push(128 | e & 63)) : 55296 > e || 57344 <= e ? p.push(224 | e >>> 12, 128 | e >>> 6 & 63, 128 | e & 63) : (k += 1, e = 65536 + ((e & 1023) << 10 | a.charCodeAt(k) & 1023), p.push(240 | e >>> 18, 128 | e >>> 12 & 63, 128 | e >>> 6 & 63, 128 | e & 63)), l = 0; l < p.length; l += 1) {
                                        n = m + r;
                                        for (t = n >>> 2; b.length <= t;) b.push(0);
                                        b[t] |= p[l] << 8 * (3 - n % 4);
                                        m += 1
                                    } else if ("UTF16BE" === c || "UTF16LE" === c)
                                for (k = 0; k < a.length; k += 1) {
                                    e = a.charCodeAt(k);
                                    "UTF16LE" === c && (l = e & 255, e = l << 8 | e >>> 8);
                                    n = m + r;
                                    for (t = n >>> 2; b.length <= t;) b.push(0);
                                    b[t] |= e << 8 * (2 - n % 4);
                                    m += 2
                                }
                            return {
                                value: b,
                                binLen: 8 * m + d
                            }
                        };
                        break;
                    case "B64":
                        d = N;
                        break;
                    case "BYTES":
                        d = M;
                        break;
                    default:
                        throw Error("format must be HEX, TEXT, B64, or BYTES");
                }
                return d
            }

            function u(b, c) {
                var d = null,
                    d = new a(b.a, b.b);
                return d = 32 >= c ? new a(d.a >>> c | d.b << 32 - c & 4294967295, d.b >>> c | d.a << 32 - c & 4294967295) : new a(d.b >>> c - 32 | d.a << 64 - c & 4294967295, d.a >>> c - 32 | d.b << 64 - c & 4294967295)
            }

            function I(b, c) {
                var d = null;
                return d = 32 >= c ? new a(b.a >>> c, b.b >>> c | b.a << 32 - c & 4294967295) : new a(0, b.a >>> c - 32)
            }

            function O(b, c, d) {
                return new a(b.a & c.a ^ ~b.a & d.a, b.b & c.b ^ ~b.b & d.b)
            }

            function P(b, c, d) {
                return new a(b.a & c.a ^ b.a & d.a ^ c.a & d.a, b.b & c.b ^ b.b & d.b ^ c.b & d.b)
            }

            function Q(b) {
                var c = u(b, 28),
                    d = u(b, 34);
                b = u(b, 39);
                return new a(c.a ^ d.a ^ b.a, c.b ^ d.b ^ b.b)
            }

            function R(b) {
                var c = u(b, 14),
                    d = u(b, 18);
                b = u(b, 41);
                return new a(c.a ^ d.a ^ b.a, c.b ^ d.b ^ b.b)
            }

            function S(b) {
                var c = u(b, 1),
                    d = u(b, 8);
                b = I(b, 7);
                return new a(c.a ^ d.a ^ b.a, c.b ^ d.b ^ b.b)
            }

            function T(b) {
                var c = u(b, 19),
                    d = u(b, 61);
                b = I(b, 6);
                return new a(c.a ^ d.a ^ b.a, c.b ^ d.b ^ b.b)
            }

            function U(b, c) {
                var d, q, f;
                d = (b.b & 65535) + (c.b & 65535);
                q = (b.b >>> 16) + (c.b >>> 16) + (d >>> 16);
                f = (q & 65535) << 16 | d & 65535;
                d = (b.a & 65535) + (c.a & 65535) + (q >>> 16);
                q = (b.a >>> 16) + (c.a >>> 16) + (d >>> 16);
                return new a((q & 65535) << 16 | d & 65535, f)
            }

            function V(b, c, d, q) {
                var f, e, g;
                f = (b.b & 65535) + (c.b & 65535) + (d.b & 65535) + (q.b & 65535);
                e = (b.b >>> 16) + (c.b >>> 16) + (d.b >>> 16) + (q.b >>> 16) + (f >>> 16);
                g = (e & 65535) << 16 | f & 65535;
                f = (b.a & 65535) + (c.a & 65535) + (d.a & 65535) + (q.a & 65535) + (e >>> 16);
                e = (b.a >>> 16) + (c.a >>> 16) + (d.a >>> 16) + (q.a >>> 16) + (f >>> 16);
                return new a((e & 65535) << 16 | f & 65535, g)
            }

            function W(b, c, d, q, f) {
                var e, g, h;
                e = (b.b & 65535) + (c.b & 65535) + (d.b & 65535) + (q.b & 65535) + (f.b & 65535);
                g = (b.b >>> 16) + (c.b >>> 16) + (d.b >>> 16) + (q.b >>> 16) + (f.b >>> 16) + (e >>> 16);
                h = (g & 65535) << 16 | e & 65535;
                e = (b.a & 65535) + (c.a & 65535) + (d.a & 65535) + (q.a & 65535) + (f.a & 65535) + (g >>> 16);
                g = (b.a >>> 16) + (c.a >>> 16) + (d.a >>> 16) + (q.a >>> 16) + (f.a >>> 16) + (e >>> 16);
                return new a((g & 65535) << 16 | e & 65535, h)
            }

            function y(b) {
                var c, d;
                c = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428];
                d = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
                
                switch (b) {
                    case "SHA-224":
                        b = c;
                        break;
                    case "SHA-256":
                        b = d;
                        break;
                    case "SHA-384":
                        b = [new a(3418070365, c[0]), new a(1654270250, c[1]), new a(2438529370, c[2]), new a(355462360, c[3]), new a(1731405415, c[4]), new a(41048885895, c[5]), new a(3675008525, c[6]), new a(1203062813, c[7])];
                        break;
                    case "SHA-512":
                        b = [new a(d[0], 4089235720), new a(d[1], 2227873595), new a(d[2], 4271175723), new a(d[3], 1595750129), new a(d[4], 2917565137), new a(d[5], 725511199), new a(d[6], 4215389547), new a(d[7], 327033209)];
                        break;
                    default:
                        throw Error("Unknown SHA variant");
                }
                
                return b
            }

            function D(b, c, d) {
                var q, f, e, g, h, m, k, l, r, t, n, u, v, A, w, B, x, y, C, D, E, F, z = [],
                    G;
                if ("SHA-384" === d || "SHA-512" === d) t = 80, u = 2, F = a, v = U, A = V, w = W, B = S, x = T, y = Q, C = R, E = P, D = O, G = J;
                else throw Error("Unexpected error in SHA-2 implementation");
                d = c[0];
                q = c[1];
                f = c[2];
                e = c[3];
                g = c[4];
                h = c[5];
                m = c[6];
                k = c[7];
                for (n = 0; n < t; n += 1) 16 > n ? (r = n * u, l = b.length <= r ? 0 : b[r], r = b.length <= r + 1 ? 0 : b[r + 1], z[n] = new F(l, r)) : z[n] = A(x(z[n - 2]), z[n - 7], B(z[n - 15]), z[n - 16]), l = w(k, C(g), D(g, h, m), G[n], z[n]), r = v(y(d), E(d, q, f)), k = m, m = h, h = g, g = v(e, l), e = f, f = q, q = d, d = v(l, r);
                c[0] = v(d, c[0]);
                c[1] = v(q, c[1]);
                c[2] = v(f, c[2]);
                c[3] = v(e, c[3]);
                c[4] = v(g, c[4]);
                c[5] = v(h, c[5]);
                c[6] = v(m, c[6]);
                c[7] = v(k, c[7]);
                return c
            }

            var b, J;
            b = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
            J = [new a(b[0], 3609767458), new a(b[1], 602891725), new a(b[2], 3964484399), new a(b[3], 2173295548), new a(b[4], 4081628472), new a(b[5], 3053834265), new a(b[6], 2937671579), new a(b[7], 3664609560), new a(b[8], 2734883394), new a(b[9], 1164996542), new a(b[10], 1323610764), new a(b[11], 3590304994), new a(b[12], 4068182383), new a(b[13], 991336113), new a(b[14], 633803317), new a(b[15], 3479774868), new a(b[16], 2666613458), new a(b[17], 944711139), new a(b[18], 2341262773), new a(b[19], 2007800933), new a(b[20], 1495990901), new a(b[21], 1856431235), new a(b[22], 3175218132), new a(b[23], 2198950837), new a(b[24], 3999719339), new a(b[25], 766784016), new a(b[26], 2566594879), new a(b[27], 3203337956), new a(b[28], 1034457026), new a(b[29], 2466948901), new a(b[30], 3758326383), new a(b[31], 168717936), new a(b[32], 1188179964), new a(b[33], 1546045734), new a(b[34], 1522805485), new a(b[35], 2643833823), new a(b[36], 2343527390), new a(b[37], 1014477480), new a(b[38], 1206759142), new a(b[39], 344077627), new a(b[40], 1290863460), new a(b[41], 3158454273), new a(b[42], 3505952657), new a(b[43], 106217008), new a(b[44], 3606008344), new a(b[45], 1432725776), new a(b[46], 1467031594), new a(b[47], 851169720), new a(b[48], 3100823752), new a(b[49], 1363258195), new a(b[50], 3750685593), new a(b[51], 3785050280), new a(b[52], 3318307427), new a(b[53], 3812723403), new a(b[54], 2003034995), new a(b[55], 3602036899), new a(b[56], 1575990012), new a(b[57], 1125592928), new a(b[58], 2716904306), new a(b[59], 442776044), new a(b[60], 593698344), new a(b[61], 3733110249), new a(b[62], 2999351573), new a(b[63], 3815920427), new a(3391569614, 3928383900), new a(3515267271, 566280711), new a(3940187606, 3454069534), new a(4118630271, 4000239992), new a(116418474, 1914138554), new a(174292421, 2731055270), new a(289380356, 3203993006), new a(460393269, 320620315), new a(685471733, 587496836), new a(852142971, 1086792851), new a(1017036298, 365543100), new a(1126000580, 2618297676), new a(1288033470, 3409855158), new a(1501505948, 4234509866), new a(1607167915, 987167468), new a(1816402316, 1246189591)];

            return hash384(toHash, salt);                    
        }
    }
})();