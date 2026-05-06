const fs = require('fs');
const code = fs.readFileSync('readobvfuscated.txt', 'utf-8');
const { basicLuaSyntaxCheck } = require('../obfuscate-simple.js') || {};
// Wait, basicLuaSyntaxCheck is not exported. Let me just copy it:
function parseBasic(code) {
const pairs = { '(': ')', '[': ']', '{': '}' };
const stack = [];
let inStr = false, strChar = '', inLineComment = false, inLongStr = false;
let longStrClose = ']]';

function longOpenLevel(pos) {
  if (code[pos] !== '[') return -1;
  let eq = 0;
  let j = pos + 1;
  while (j < code.length && code[j] === '=') { eq++; j++; }
  if (j < code.length && code[j] === '[') return eq;
  return -1;
}

for (let i = 0; i < code.length; i++) {
const ch = code[i], ch2 = code[i + 1];

if (!inStr && !inLineComment && !inLongStr && ch === '-' && ch2 === '-') {
  const lvl = longOpenLevel(i + 2);
  if (lvl >= 0) {
    inLongStr = true;
    longStrClose = ']' + '='.repeat(lvl) + ']';
    i += 2 + lvl + 1; 
    continue;
  }
}
if (!inStr && !inLineComment && !inLongStr) {
  const lvl = longOpenLevel(i);
  if (lvl >= 0) {
    inLongStr = true;
    longStrClose = ']' + '='.repeat(lvl) + ']';
    i += lvl + 1; 
    continue;
  }
}
if (inLongStr) {
  if (code.slice(i, i + longStrClose.length) === longStrClose) {
    inLongStr = false;
    i += longStrClose.length - 1;
  }
  continue;
}
if (!inStr && ch === '-' && ch2 === '-') { inLineComment = true; continue; }
if (inLineComment) { if (ch === '\n') inLineComment = false; continue; }
if ((ch === '"' || ch === "'") && !inStr) { inStr = true; strChar = ch; continue; }
if (inStr) { if (ch === '\\') { i++; continue; } if (ch === strChar) inStr = false; continue; }
if (pairs[ch]) { stack.push(pairs[ch]); }
else if (ch === ')' || ch === ']' || ch === '}') {
if (!stack.length || stack.pop() !== ch) throw new Error('Bracket mismatch near pos ' + i + ' line ' + code.substring(0, i).split('\n').length);
}
}
if (stack.length) throw new Error('Unclosed bracket: ' + stack.join(', '));
}

try {
  parseBasic(code);
  console.log("Syntax is OK!");
} catch(e) {
  console.error("ERROR: ", e.message);
}
