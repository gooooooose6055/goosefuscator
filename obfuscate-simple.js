'use strict';

const { spawnSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { generateSecurityHeader } = require('./obfuscator/security');
const { applyVMLayers } = require('./obfuscator/vm');
const { wrapWithDecompressor } = require('./obfuscator/compress');
const { sanitize } = require('./obfuscator/sanitize');
const { makeWatermarks } = require('./obfuscator/watermarks');
const {
encryptStrings, encodeNumbers, constantArray,
flattenControlFlow, proxyGlobals, injectJunk,
antiDecompilePoison, renameLocals, opaqueWrap,
herculesWrap, upvalueChain, stringSplit,
charCodeStrings, minifyWhitespace,
} = require('./obfuscator/transforms');

const ROOT = path.resolve(__dirname, '..');
const PROM_CLI = path.join(ROOT, 'prometheus', 'Prometheus-master', 'cli.lua');
const ZARTHA_CLI = path.join(ROOT, 'zartha', 'Main.lua');

function tmpFile(tag, ext) {
ext = ext || '.lua';
return path.join(os.tmpdir(), 'gs_' + tag + '_' + crypto.randomBytes(6).toString('hex') + ext);
}

function luaAvailable() {
try {
const r = spawnSync('lua', ['--version'], { encoding: 'utf8', timeout: 3000 });
return !r.error && r.status === 0;
} catch (_) { return false; }
}

const PROM_MAX_CONFIG = [
'return {',
' LuaVersion = "Lua51",',
' PrettyPrint = false,',
' Seed = 0,',
' Steps = {',
' { Name = "EncryptStrings" },',
' { Name = "NumbersToExpressions" },',
' { Name = "ConstantArray", Settings = { Iterations = 1, Treshold = 0.5 } },',
' { Name = "ProxifyLocals" },',
' { Name = "SplitStrings", Settings = { Iterations = 1, Treshold = 0.5 } },',
' { Name = "WrapInFunction" },',
' },',
'}',
].join('\n');

function runPrometheus(code, log) {
if (!fs.existsSync(PROM_CLI)) { log('info Prometheus: cli.lua not found - skipping'); return code; }

const ti = tmpFile('pin'), to = tmpFile('pout'), cfg = tmpFile('pcfg');
try {
fs.writeFileSync(ti, code, 'utf8');
fs.writeFileSync(cfg, PROM_MAX_CONFIG, 'utf8');

const r = spawnSync('lua', [PROM_CLI, ti, '--out', to, '--config', cfg],
{ cwd: path.dirname(PROM_CLI), encoding: 'utf8', timeout: 45000 });

if (r.error) { log('warn Prometheus error: ' + r.error.message); return code; }
if (r.status !== 0) { log('warn Prometheus failed:\n' + (r.stderr || '').trim().slice(0, 300)); return code; }
if (!fs.existsSync(to)) { log('warn Prometheus: no output file'); return code; }

const out = fs.readFileSync(to, 'utf8').trim();
if (!out) { log('warn Prometheus: empty output'); return code; }

log('ok Prometheus done (' + Math.round(out.length / 1024) + ' KB)');
return out;
} finally {
[ti, to, cfg].forEach(f => { try { fs.unlinkSync(f); } catch (_) {} });
}
}

function runZartha(code, log) {
if (!fs.existsSync(ZARTHA_CLI)) { log('info Zartha: Main.lua not found - skipping'); return code; }

const ti = tmpFile('zin'), to = tmpFile('zout');
try {
fs.writeFileSync(ti, code, 'utf8');

const r = spawnSync('lua',
[ZARTHA_CLI, ti, to,
'--constantprotection', '--encryptstrings',
'--antitamper', '--controlflowflattening'],
{ cwd: path.dirname(ZARTHA_CLI), encoding: 'utf8', timeout: 45000 });

if (r.error) { log('warn Zartha error: ' + r.error.message); return code; }
if (r.status !== 0) { log('warn Zartha failed:\n' + (r.stderr || '').trim().slice(0, 300)); return code; }
if (!fs.existsSync(to)) { log('warn Zartha: no output file'); return code; }

const out = fs.readFileSync(to, 'utf8').trim();
if (!out) { log('warn Zartha: empty output'); return code; }
if (out.length < code.length * 0.5) { log('warn Zartha: output too small - discarded'); return code; }

log('ok Zartha done (' + Math.round(out.length / 1024) + ' KB)');
return out;
} finally {
[ti, to].forEach(f => { try { fs.unlinkSync(f); } catch (_) {} });
}
}

function basicLuaSyntaxCheck(code) {
const pairs = { '(': ')', '[': ']', '{': '}' };
const stack = [];
let inStr = false, strChar = '', inLineComment = false, inLongStr = false;
let longStrClose = ']]'; // the closing sequence for the current long string

// Detect a long-string opening like [[ or [=[ or [==[ etc.
// Returns the number of = signs, or -1 if not a long-string open
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

// Detect long-string comment: --[=*[
if (!inStr && !inLineComment && !inLongStr && ch === '-' && ch2 === '-') {
  const lvl = longOpenLevel(i + 2);
  if (lvl >= 0) {
    inLongStr = true;
    longStrClose = ']' + '='.repeat(lvl) + ']';
    i += 2 + lvl + 1; // skip --[=*[
    continue;
  }
}
// Detect long-string literal: [=*[
if (!inStr && !inLineComment && !inLongStr) {
  const lvl = longOpenLevel(i);
  if (lvl >= 0) {
    inLongStr = true;
    longStrClose = ']' + '='.repeat(lvl) + ']';
    i += lvl + 1; // skip [=*[
    continue;
  }
}
// Detect long-string close
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
if (!stack.length || stack.pop() !== ch) throw new Error('Bracket mismatch near pos ' + i);
}
}
if (stack.length) throw new Error('Unclosed bracket: ' + stack.join(', '));
}

const BRAND = '--[==[Goosefuscator]==]';

function stripLuaComments(src) {
  // Phase 1: Protect watermark/brand long-string comments by slotting them first
  const wmSlots = [];
  src = src.replace(/--\[=*\[[\s\S]*?\]=*\]/g, (m) => {
    // Keep watermark blocks and brand tag
    if (m === BRAND ||
        m.includes('Goosefuscator') ||
        m.includes('Stellarfuscator') ||
        m.includes('\u2554') || m.includes('\u2551')) {
      wmSlots.push(m);
      return '\x00W' + (wmSlots.length - 1) + '\x00';
    }
    // Strip other long-string comments (keep newlines for line counting)
    return m.replace(/[^\n]/g, '');
  });

  // Phase 2: Protect string literals and long-string literals
  const slots = [];
  src = src.replace(
    /(\[=*\[[\s\S]*?\]=*\])|(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')/g,
    (m) => { slots.push(m); return '\x00S' + (slots.length - 1) + '\x00'; }
  );

  // Phase 3: Strip remaining comments
  src = src.replace(/--[^\n]*/g, '');

  // Phase 4: Collapse blank lines, restore
  src = src.replace(/\n{3,}/g, '\n\n').trim();
  src = src.replace(/\x00S(\d+)\x00/g, (_, i) => slots[+i]);
  src = src.replace(/\x00W(\d+)\x00/g, (_, i) => wmSlots[+i]);
  return src;
}


function safe(name, fn, code, log) {
try {
const r = fn(code);
return (typeof r === 'string' && r.length > 0) ? r : code;
} catch (e) {
log('warn ' + name + ' failed (skipped): ' + e.message);
return code;
}
}

const { resolve: resolvePreset } = require('./presets');

function obfuscate(sourceCode, options) {
if (typeof sourceCode !== 'string') throw new Error('Input must be a string');
if (sourceCode.length > 5 * 1024 * 1024) throw new Error('File too large (max 5 MB)');
if (!sourceCode.trim()) throw new Error('Empty input');

sourceCode = sourceCode.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
if (!sourceCode.length) throw new Error('Source code is empty');

const cfg = resolvePreset(options);

const log = [];
const L = (msg) => { log.push(msg); console.log(msg); };

const presetLabel = (typeof options === 'string')
? options.toUpperCase()
: (options && options.preset ? options.preset.toUpperCase() : 'HEAVY');

L('[ Goosefuscator ] PRESET: ' + presetLabel);
L('');

L(' Analyzing code...');
const { flags } = sanitize(sourceCode);

L(' Validating Lua syntax...');
try { basicLuaSyntaxCheck(sourceCode); }
catch (e) { throw new Error('Syntax error in source: ' + e.message); }

let code = sourceCode;
const srcBytes = sourceCode.length;

if (cfg.prometheus) {
if (luaAvailable()) {
L(' Prometheus (AST obfuscator)...');
code = runPrometheus(code, L);
} else {
L(' Lua not in PATH — Prometheus skipped');
}
}

let zarthaRan = false;
if (cfg.zartha) {
if (luaAvailable()) {
L(' Zartha (bytecode VM)...');
const out = runZartha(code, L);
if (out !== code) { code = out; zarthaRan = true; }
} else {
L(' Lua not in PATH — Zartha skipped');
}
}

if (cfg.numbers) {
L(' Number encoding (XOR MBA)...');
code = safe('encodeNumbers', encodeNumbers, code, L);
}

if (cfg.proxyGlobals && !flags.skipProxyGlobals) {
L(' Global proxying...');
code = safe('proxyGlobals', proxyGlobals, code, L);
}

if (cfg.constArray && flags.constArr !== false) {
L(' Constant array obfuscation...');
code = safe('constantArray', constantArray, code, L);
}

if (cfg.strings && flags.strings !== false) {
L(' String encryption (rolling-XOR, multi-fragment)...');
code = safe('encryptStrings', encryptStrings, code, L);
}

if (cfg.controlFlow && !flags.skipFlatten) {
L(' Control flow flattening...');
code = safe('flattenControlFlow', flattenControlFlow, code, L);
}

if (cfg.opaque && !flags.skipOpaque) {
L(' Opaque predicate wrapping...');
code = safe('opaqueWrap', opaqueWrap, code, L);
}

if (cfg.antiDecomp) {
L(' Anti-decompile poison...');
code = safe('antiDecompilePoison', antiDecompilePoison, code, L);
}

if (cfg.junk) {
const blocks = Math.max(1, Math.min(20, cfg.junkBlocks || 10));
L(' Dead code injection (' + blocks + ' blocks)...');
code = safe('injectJunk', (c) => injectJunk(c, blocks), code, L);
}

if (cfg.renameLocals) {
L(' Local variable renaming...');
code = safe('renameLocals', renameLocals, code, L);
}

if (cfg.strings !== false) {
L(' String charcode conversion...');
code = safe('charCodeStrings', charCodeStrings, code, L);
}

if (cfg.strings !== false) {
L(' String splitting...');
code = safe('stringSplit', stringSplit, code, L);
}

if (cfg.opaque || cfg.controlFlow) {
L(' Upvalue chain wrapping...');
code = safe('upvalueChain', upvalueChain, code, L);
}

const requestedLayers = cfg.vmLayers || 0;
if (requestedLayers > 0) {
const sizeKB = code.length / 1024;
const baseLayer = srcBytes < 500 ? 1
: srcBytes < 4096 ? 2
: requestedLayers;
const vmLayers = zarthaRan ? Math.min(baseLayer, 2)
: sizeKB > 100 ? 1
: sizeKB > 50 ? Math.min(baseLayer, 2)
: baseLayer;

L(' VM layer hardening (' + vmLayers + ' layer' + (vmLayers !== 1 ? 's' : '') + ')...');
try {
const effectiveSrc = cfg.vmStackAt30KB ? srcBytes : 999999;
const vmOut = applyVMLayers(code, vmLayers, effectiveSrc);
if (typeof vmOut === 'string' && vmOut.length > 0) code = vmOut;
} catch (e) { L('warn VM layers failed (skipped): ' + e.message); }
} else {
L(' VM layers: disabled by preset');
}

L(' Generating watermarks...');
let wm = { header: '', footer: '' };
try { wm = makeWatermarks(); } catch (_) {}

if (cfg.security) {
L(' Security header (anti-debug, anti-tamper)...');
try {
code = [wm.header, BRAND, generateSecurityHeader(srcBytes), code].filter(Boolean).join('\n\n');
} catch (e) {
L('warn Security header skipped: ' + e.message);
code = wm.header + '\n\n' + BRAND + '\n\n' + code;
}
} else {
code = wm.header + '\n\n' + BRAND + '\n\n' + code;
}

if (cfg.hercules) {
L(' Hercules global-alias wrapper...');
code = safe('herculesWrap', herculesWrap, code, L);
}

L(' Stripping comments...');
code = stripLuaComments(code);

if (cfg.compress || cfg.controlFlow) {
L(' Whitespace minification...');
code = safe('minifyWhitespace', minifyWhitespace, code, L);
}

if (wm.footer) code = code + '\n\n' + wm.footer;

if (cfg.compress) {
L(' ZLIB compression...');
try {
const before = code.length;
const comp = wrapWithDecompressor(code);
if (comp && comp.length > 0) {
code = comp;
const pct = Math.round((1 - code.length / before) * 100);
L(' ' + Math.round(before / 1024) + ' KB -> ' + Math.round(code.length / 1024) + ' KB (' + (pct >= 0 ? '-' + pct : '+' + Math.abs(pct)) + '%)');
}
} catch (e) { L(' Compression skipped: ' + e.message); }
}

if (cfg.validate) {
L(' Validating obfuscated output...');
try { basicLuaSyntaxCheck(code); }
catch (e) { throw new Error('Output validation failed: ' + e.message); }
}

const ratio = (code.length / sourceCode.length).toFixed(2) + 'x';
L('');
L('SUCCESS');

return {
output: code,
log: log,
originalSize: sourceCode.length,
obfuscatedSize: code.length,
expansionRatio: ratio,
preset: presetLabel.toLowerCase(),
};
}

module.exports = obfuscate;
module.exports.obfuscate = obfuscate;
