'use strict';

const CHARSET_ALPHA = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CHARSET_ALNUM = CHARSET_ALPHA + '0123456789';

function randomName(len = 8) {
const first = CHARSET_ALPHA[Math.floor(Math.random() * CHARSET_ALPHA.length)];
let rest = '';
for (let i = 0; i < len; i++) {
const pool = CHARSET_ALNUM + '_';
rest += pool[Math.floor(Math.random() * pool.length)];
}
return '_0' + first + rest;
}

function randomKey(len = 48) {
return Array.from({ length: len }, () => Math.floor(Math.random() * 254) + 1);
}

function xorEncrypt(str, key) {
const bytes = Buffer.from(str, 'utf-8');
const result = [];
for (let i = 0; i < bytes.length; i++) {
result.push((bytes[i] ^ key[i % key.length]) & 0xFF);
}
return result;
}

function luaStr(str) {
return '"' + str
.replace(/\\/g, '\\\\')
.replace(/"/g, '\\"')
.replace(/\n/g, '\\n')
.replace(/\r/g, '\\r')
.replace(/\0/g, '\\0')
.replace(/[\x01-\x1f\x7f-\xff]/g, c => '\\' + c.charCodeAt(0)) + '"';
}

/**
* Lua table literal from number array
*/
function numTable(arr) {
const rows = [];
for (let i = 0; i < arr.length; i += 64) {
rows.push(arr.slice(i, i + 64).join(','));
}
return '{' + rows.join(',') + '}';
}

/**
* Shuffle an array (Fisher-Yates)
*/
function shuffle(arr) {
const a = [...arr];
for (let i = a.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[a[i], a[j]] = [a[j], a[i]];
}
return a;
}

/**
* Random integer in [min, max]
*/
function randInt(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
* Generate a random XOR-based number expression for obfuscating a constant
*/
function obfNum(n) {
  n = Math.floor(n);
  if (n === 0) return '(0)';
  const a = randInt(1, 0xFFFF);
  const b = a ^ n;
  return `((bit32 and bit32.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end)(${a},${b}))`;
}

module.exports = { randomName, randomKey, xorEncrypt, luaStr, numTable, shuffle, randInt, obfNum };
