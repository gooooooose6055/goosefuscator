'use strict';

function strip(code) {
return code
.replace(/--\[=*\[[\s\S]*?\]=*\]/g, '')
.replace(/--[^\n]*/g, '')
.replace(/\[=*\[[\s\S]*?\]=*\]/g, '""')
.replace(/"(?:[^"\\]|\\.)*"/g, '""')
.replace(/'(?:[^'\\]|\\.)*'/g, "''");
}

function hasNullByteStrings(code) {
return /"(?:[^"\\]|\\.)*\\0(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*\\0(?:[^'\\]|\\.)*'/.test(code) ||
/"(?:[^"\\]|\\.)*\\x00(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*\\x00(?:[^'\\]|\\.)*'/.test(code);
}

function usesEnv(code) {
return /\b_ENV\b/.test(strip(code));
}

function hasTopLevelBreak(code) {
const toks = strip(code).match(/\b(function|do|for|while|repeat|end|until|break)\b/g) || [];
const stack = [];
for (const t of toks) {
if (['function','do','for','while','repeat'].includes(t)) stack.push(t);
else if (t === 'end' && stack.length) stack.pop();
else if (t === 'until' && stack.length && stack[stack.length-1] === 'repeat') stack.pop();
else if (t === 'break' && !stack.some(b => ['for','while','repeat'].includes(b))) return true;
}
return false;
}

function hasLuauContinue(code) {
return /\bcontinue\b/.test(strip(code));
}

function hasGoto(code) {
const c = strip(code);
return /\bgoto\b/.test(c) || /::[a-zA-Z_]\w*::/.test(c);
}

function countTopLevelReturns(code) {
const toks = strip(code).match(/\b(function|do|if|for|while|repeat|end|until|return)\b/g) || [];
const stack = [];
let funcDepth = 0, count = 0;
for (const t of toks) {
if (t === 'function') { stack.push('function'); funcDepth++; }
else if (['do','if','for','while','repeat'].includes(t)) stack.push(t);
else if (t === 'end' && stack.length) {
if (stack[stack.length-1] === 'function') funcDepth--;
stack.pop();
} else if (t === 'until' && stack.length && stack[stack.length-1] === 'repeat') {
stack.pop();
} else if (t === 'return' && funcDepth === 0) {
count++;
}
}
return count;
}

function hasTopLevelVararg(code) {
const toks = strip(code).match(/\b(function|do|for|while|repeat|end|until)\b|\.\.\./g) || [];
const stack = [];
let funcDepth = 0;
for (const t of toks) {
if (t === 'function') { stack.push('function'); funcDepth++; }
else if (['do','for','while','repeat'].includes(t)) stack.push(t);
else if (t === 'end' && stack.length) {
if (stack[stack.length-1] === 'function') funcDepth--;
stack.pop();
} else if (t === 'until' && stack.length && stack[stack.length-1] === 'repeat') {
stack.pop();
} else if (t === '...' && funcDepth === 0) return true;
}
return false;
}

function sanitize(source) {
const flags = {};
const warnings = [];
const reasons = [];

if (hasNullByteStrings(source)) {
flags.strings = false;
reasons.push('encryptStrings disabled: null-byte string literals');
}

if (source.trim().length < 80) {
flags.constArr = false;
}

if (usesEnv(source)) {
flags.skipProxyGlobals = true;
reasons.push('proxyGlobals disabled: _ENV usage detected');
}

if (hasTopLevelBreak(source)) {
warnings.push(
'`break` appears at chunk level with no enclosing loop. ' +
'This is unusual (and a syntax error in standard Lua). ' +
'Obfuscation will proceed but verify output runs correctly.'
);
}
if (hasLuauContinue(source)) {
warnings.push(
'`continue` keyword detected (Luau). The obfuscation wrappers are ' +
'Luau-compatible, but verify output in your target Luau version.'
);
}
if (hasGoto(source)) {
warnings.push(
'`goto`/label detected. The obfuscation wrappers do not create new ' +
'jump-target scopes, so goto should work correctly. Verify output.'
);
}

if (countTopLevelReturns(source) > 1) {
warnings.push(
'`return` appears **multiple times at top level** (outside any function). ' +
'Control flow wrapping may cause only the first `return` to fire, potentially breaking your script.'
);
}

if (hasTopLevelVararg(source)) {
warnings.push(
'`...` (vararg) is used **at top level** outside any function. ' +
'The obfuscation wrapper passes `...` through, but some Lua 5.1 environments ' +
'may not propagate varargs correctly through the wrapper.'
);
}

return { flags, warnings, reasons };
}

module.exports = { sanitize };
