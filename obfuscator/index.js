'use strict';

const { spawn }   = require('child_process');
const crypto      = require('crypto');
const fs          = require('fs');
const os          = require('os');
const path        = require('path');

const { generateSecurityHeader } = require('./security');
const { makeWatermarks }         = require('./watermarks');
const { applyVMLayers }          = require('./vm');
const { wrapWithDecompressor }   = require('./compress');
const { sanitize }               = require('./sanitize');
const {
  encryptStrings, encryptStrings2, encodeNumbers, constantArray,
  flattenControlFlow, proxyGlobals, injectJunk,
  antiDecompilePoison, renameLocals, opaqueWrap,
  herculesWrap, upvalueChain, charCodeStrings,
  stringSplit, minifyWhitespace, antiTamperFakeScript,
} = require('./transforms');
const {
  tableKeyObfuscation, dynamicDispatch, stringCharShuffle,
  enhancedOpaqueWrap, stripTypeAnnotations, injectFakeSignatures,
  robloxOnlyLock, antiDeobfuscationTraps,
} = require('./transforms2');

const ROOT       = path.resolve(__dirname, '..');
const PROM_MASTER = path.join(ROOT, 'prometheus', 'Prometheus-master', 'cli.lua');
const PROM_SIMPLE = path.join(ROOT, 'prometheus', 'cli.lua');
const PROM_CLI   = fs.existsSync(PROM_MASTER) ? PROM_MASTER : PROM_SIMPLE;
const PROM_CFG_G = path.join(ROOT, 'prometheus', 'goose_config.lua');
const PROM_CFG_S = path.join(ROOT, 'prometheus', 'stellar_config.lua');
const PROM_CFG   = fs.existsSync(PROM_CFG_G) ? PROM_CFG_G : PROM_CFG_S;
const ZARTHA_CLI = path.join(ROOT, 'zartha', 'Main.lua');

function tmpFile(tag, ext) {
  return path.join(os.tmpdir(), 'gs_' + tag + '_' + crypto.randomBytes(6).toString('hex') + (ext || '.lua'));
}

function spawnAsync(cmd, args, opts) {
  return new Promise((resolve) => {
    let stdout = '', stderr = '', killed = false;
    let child;
    const timer = setTimeout(() => {
      killed = true;
      try { child.kill('SIGKILL'); } catch (_) {}
      resolve({ status: -1, stdout, stderr, timedOut: true });
    }, opts.timeout || 30000);
    try {
      child = spawn(cmd, args, { cwd: opts.cwd, env: process.env });
    } catch (e) {
      clearTimeout(timer);
      resolve({ status: -1, stdout: '', stderr: e.message, error: e });
      return;
    }
    child.stdout.on('data', d => { stdout += d; });
    child.stderr.on('data', d => { stderr += d; });
    child.on('error', e => { clearTimeout(timer); if (!killed) resolve({ status: -1, stdout, stderr: e.message, error: e }); });
    child.on('close', code => { clearTimeout(timer); if (!killed) resolve({ status: code, stdout, stderr }); });
  });
}

async function runPrometheus(code) {
  if (!fs.existsSync(PROM_CLI)) throw new Error('Prometheus cli.lua not found');
  if (!fs.existsSync(PROM_CFG)) throw new Error('Prometheus config not found');
  const ti = tmpFile('pin'), to = tmpFile('pout');
  try {
    fs.writeFileSync(ti, code, 'utf-8');
    const r = await spawnAsync('lua', [PROM_CLI, ti, '--out', to, '--config', PROM_CFG],
      { timeout: 45000, cwd: path.dirname(PROM_CLI) });
    if (r.error || r.timedOut) throw new Error(r.timedOut ? 'timed out' : 'lua not found');
    if (!fs.existsSync(to)) throw new Error('no output file - ' + (r.stderr || '').slice(0, 80));
    const out = fs.readFileSync(to, 'utf-8');
    if (!out.trim()) throw new Error('empty output');
    return out;
  } finally {
    try { fs.unlinkSync(ti); } catch (_) {}
    try { fs.unlinkSync(to); } catch (_) {}
  }
}

async function runZartha(code) {
  if (!fs.existsSync(ZARTHA_CLI)) throw new Error('Zartha Main.lua not found');
  const ti = tmpFile('zin'), to = tmpFile('zout');
  try {
    fs.writeFileSync(ti, code, 'utf-8');
    const r = await spawnAsync('lua', [ZARTHA_CLI, ti, to],
      { timeout: 45000, cwd: path.dirname(ZARTHA_CLI) });
    if (r.error || r.timedOut) throw new Error(r.timedOut ? 'timed out' : 'lua not found');
    if (!fs.existsSync(to)) throw new Error('no output - ' + (r.stderr || '').slice(0, 80));
    const out = fs.readFileSync(to, 'utf-8');
    if (!out.trim()) throw new Error('empty output');
    return out;
  } finally {
    try { fs.unlinkSync(ti); } catch (_) {}
    try { fs.unlinkSync(to); } catch (_) {}
  }
}

function stripLuaComments(src, brand) {
  const slots = [];
  src = src.replace(
    /(\[=*\[[\s\S]*?\]=*\])|(\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*')/g,
    (m) => { slots.push(m); return `\x00S${slots.length - 1}\x00`; }
  );
  src = src.replace(/--\[=*\[[\s\S]*?\]=*\]/g, m => m === brand ? m : m.replace(/[^\n]/g, ''));
  src = src.replace(/--[^\n]*/g, m => m === brand ? m : '');
  src = src.replace(/\n{3,}/g, '\n\n').trim();
  src = src.replace(/\x00S(\d+)\x00/g, (_, i) => slots[+i]);
  return src;
}

// Basic Lua structural validation — catches obvious syntax breaks
function luaStructureOK(code) {
  if (typeof code !== 'string' || code.length === 0) return false;
  // Strip strings/comments for structural analysis
  let s = code
    .replace(/\[=*\[[\s\S]*?\]=*\]/g, '""')
    .replace(/--\[=*\[[\s\S]*?\]=*\]/g, '')
    .replace(/--[^\n]*/g, '')
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''");
  // Count block openers vs closers
  const openers = (s.match(/\b(function|do|if|for|while|repeat)\b/g) || []).length;
  const closers = (s.match(/\b(end|until)\b/g) || []).length;
  // Allow some mismatch (transforms may create unbalanced blocks intentionally), but flag extreme imbalance
  if (closers > 0 && openers > 0 && Math.abs(openers - closers) > Math.max(openers, closers) * 0.5) return false;
  return true;
}

function safe(name, fn, code, log) {
  const before = code;
  try {
    const result = fn(code);
    if (typeof result !== 'string' || result.length === 0) {
      log(`  ${name}: empty result - keeping original`);
      return before;
    }
    // Validate the transform didn't break Lua structure
    if (!luaStructureOK(result)) {
      log(`  ${name}: output failed structure check - keeping original`);
      return before;
    }
    return result;
  } catch (e) {
    log(`  ${name} skipped: ${e.message.split('\n')[0]}`);
    return before;
  }
}

// Universal bit32 polyfill — ensures all Lua environments have bit32 support
function generateBit32Polyfill() {
  return [
    'if not bit32 then',
    ' bit32={}',
    ' bit32.bxor=function(a,b) a=a%4294967296;b=b%4294967296;local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end',
    ' bit32.band=function(a,b) a=a%4294967296;b=b%4294967296;local r,s=0,1 while a>0 and b>0 do if a%2==1 and b%2==1 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end',
    ' bit32.bor=function(a,b) a=a%4294967296;b=b%4294967296;local r,s=0,1 while a>0 or b>0 do if a%2==1 or b%2==1 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end',
    ' bit32.bnot=function(a) return 4294967295-(a%4294967296) end',
    ' bit32.lshift=function(a,n) return math.floor(a*(2^n))%4294967296 end',
    ' bit32.rshift=function(a,n) return math.floor((a%4294967296)/2^n) end',
    'end',
  ].join('\n');
}

// Auto-detect if source code uses Luau-specific features
function detectLuau(source) {
  // Strip strings/comments first
  let s = source
    .replace(/\[=*\[[\s\S]*?\]=*\]/g, '')
    .replace(/--\[=*\[[\s\S]*?\]=*\]/g, '')
    .replace(/--[^\n]*/g, '')
    .replace(/"(?:[^"\\]|\\.)*"/g, '')
    .replace(/'(?:[^'\\]|\\.)*'/g, '');
  // Check for Luau indicators
  if (/\btypeof\b/.test(s)) return true;
  if (/\bcontinue\b/.test(s)) return true;
  if (/\bexport\s+type\b/.test(s)) return true;
  if (/\btype\s+[A-Z]\w*\s*=/.test(s)) return true;
  // Type annotations: function(x: Type)
  if (/\b\w+\s*:\s*(?:number|string|boolean|any|nil|never|unknown|Instance|\{)/.test(s)) return true;
  // Luau string interpolation
  if (/`[^`]*\{/.test(source)) return true;
  // game/workspace/Instance (Roblox Luau environment)
  if (/\bgame\s*[:.]/.test(s) || /\bworkspace\s*[:.]/.test(s)) return true;
  if (/\bInstance\.new\b/.test(s)) return true;
  return false;
}

async function obfuscate(sourceCode, options = {}, onProgress) {
  const {
    vmLayers   = 16,
    strings    = true,
    numbers    = true,
    junk       = true,
    security   = true,
    antiDecomp = true,
    constArr   = true,
    validate   = true,
    compress   = true,
    // Prometheus, Zartha, Hercules are ALWAYS forced — no option to disable
  } = options;

  if (typeof sourceCode !== 'string')      throw new Error('Input must be a string');
  if (sourceCode.length > 25 * 1024 * 1024) throw new Error('File too large (max 25 MB)');
  if (!sourceCode.trim())                  throw new Error('Empty input');

  sourceCode = sourceCode.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  // Auto-detect Luau if not explicitly set
  const isLuau = options.isLuau !== undefined ? options.isLuau : detectLuau(sourceCode);

  const log  = [];
  const step = async (msg) => {
    log.push(msg);
    if (onProgress) { try { await onProgress(msg); } catch (_) {} }
  };
  const L = m => log.push(m);

  const { flags: sf, reasons } = sanitize(sourceCode);
  if (reasons.length) await step('Safety: ' + reasons.join('; '));
  if (isLuau) await step('Luau mode detected — type annotations will be stripped');

  const doStrings    = strings    && sf.strings    !== false;
  const doConstArr   = constArr   && sf.constArr   !== false;
  const doFlatten    = !sf.skipFlatten;
  const doOpaque     = !sf.skipOpaque;
  const doProxyGlobs = !sf.skipProxyGlobals;

  let code = sourceCode;
  const srcBytes = sourceCode.length;

  // ── Inject universal bit32 polyfill (ensures ALL Lua/Luau environments work) ──
  await step('Injecting bit32 polyfill...');
  code = generateBit32Polyfill() + '\n' + code;

  // Strip Luau type annotations first (safe — won't break runtime)
  if (isLuau) {
    await step('Stripping Luau type annotations...');
    code = safe('stripTypeAnnotations', stripTypeAnnotations, code, L);
  }

  // Roblox-only execution lock (runs early so it gets encrypted by later passes)
  await step('Roblox-only lock...');
  code = safe('robloxOnlyLock', robloxOnlyLock, code, L);

  // ── PROMETHEUS — ALWAYS RUNS (retry up to 3 times) ──
  await step('Running Prometheus (FORCED)...');
  let promDone = false;
  for (let attempt = 1; attempt <= 3 && !promDone; attempt++) {
    try {
      code = await runPrometheus(code);
      promDone = true;
      await step(`  Prometheus done (attempt ${attempt})`);
    } catch (e) {
      await step(`  Prometheus attempt ${attempt} failed: ${e.message.split('\n')[0]}`);
      if (attempt < 3) await step('  Retrying Prometheus...');
    }
  }
  if (!promDone) await step('  ⚠ Prometheus failed all 3 attempts — continuing without it');

  // ── ZARTHA — ALWAYS RUNS (retry up to 3 times) ──
  let zarthaRan = false;
  await step('Running Zartha (FORCED)...');
  for (let attempt = 1; attempt <= 3 && !zarthaRan; attempt++) {
    try {
      code = await runZartha(code);
      zarthaRan = true;
      await step(`  Zartha done (attempt ${attempt})`);
    } catch (e) {
      await step(`  Zartha attempt ${attempt} failed: ${e.message.split('\n')[0]}`);
      if (attempt < 3) await step('  Retrying Zartha...');
    }
  }
  if (!zarthaRan) await step('  ⚠ Zartha failed all 3 attempts — continuing without it');

  await step('Number encoding...');
  if (numbers) code = safe('encodeNumbers', encodeNumbers, code, L);

  await step('Proxying globals...');
  if (doProxyGlobs) code = safe('proxyGlobals', proxyGlobals, code, L);

  await step('Constant array...');
  if (doConstArr) code = safe('constantArray', constantArray, code, L);

  await step('String encryption (pass 1)...');
  if (doStrings) code = safe('encryptStrings', encryptStrings, code, L);

  await step('String splitting...');
  code = safe('stringSplit', stringSplit, code, L);

  await step('Control flow flattening...');
  if (doFlatten) code = safe('flattenControlFlow', flattenControlFlow, code, L);

  await step('Opaque predicates (pass 1)...');
  if (doOpaque) {
    code = safe('opaqueWrap', opaqueWrap, code, L);
    code = safe('opaqueWrap', opaqueWrap, code, L);
  }

  await step('Anti-decompile poison...');
  if (antiDecomp) code = safe('antiDecompilePoison', antiDecompilePoison, code, L);

  await step('Junk injection...');
  if (junk) {
    const numJunk = Math.min(150, Math.max(10, Math.ceil(srcBytes / 300)));
    code = safe('injectJunk', c => injectJunk(c, numJunk), code, L);
  }

  await step('Renaming locals (pass 1)...');
  code = safe('renameLocals', renameLocals, code, L);

  await step('String encryption (pass 2)...');
  if (doStrings) code = safe('encryptStrings2', encryptStrings2, code, L);

  await step('Upvalue chain...');
  code = safe('upvalueChain', upvalueChain, code, L);

  await step('Renaming locals (pass 2)...');
  code = safe('renameLocals', renameLocals, code, L);

  await step('String char shuffle...');
  code = safe('stringCharShuffle', stringCharShuffle, code, L);

  await step('Table key obfuscation...');
  code = safe('tableKeyObfuscation', tableKeyObfuscation, code, L);

  await step('Dynamic dispatch...');
  code = safe('dynamicDispatch', dynamicDispatch, code, L);

  await step('Char code strings...');
  code = safe('charCodeStrings', charCodeStrings, code, L);

  await step('Enhanced opaque wrap...');
  code = safe('enhancedOpaqueWrap', enhancedOpaqueWrap, code, L);
  code = safe('enhancedOpaqueWrap', enhancedOpaqueWrap, code, L);

  await step('String encryption (pass 3 — final)...');
  if (doStrings) code = safe('encryptStrings', encryptStrings, code, L);

  await step('Control flow flattening (pass 2)...');
  if (doFlatten) code = safe('flattenControlFlow', flattenControlFlow, code, L);

  await step('Anti-tamper fake script decoy...');
  code = safe('antiTamperFakeScript', antiTamperFakeScript, code, L);

  await step('Injecting fake obfuscator signatures...');
  code = safe('injectFakeSignatures', injectFakeSignatures, code, L);

  await step('Minifying whitespace...');
  code = safe('minifyWhitespace', minifyWhitespace, code, L);

  await step('Anti-deobfuscation traps...');
  code = safe('antiDeobfuscationTraps', antiDeobfuscationTraps, code, L);

  // ── PASS 1: Minify to single line + Compress BEFORE VM layers ──
  if (compress) {
    await step('Pre-VM minify + compress...');
    try {
      // Minify to single line first — massively improves deflate ratio
      code = safe('minifyWhitespace', minifyWhitespace, code, L);
      const before = code.length;
      const comp   = wrapWithDecompressor(code);
      if (comp && comp.length > 0 && comp.length < before) {
        code = comp;
        const pct = Math.round((1 - code.length / before) * 100);
        await step(`  ${Math.round(before/1024)}KB -> ${Math.round(code.length/1024)}KB (-${pct}%)`);
      } else {
        await step(`  Pass 1 skipped (no size reduction)`);
      }
    } catch (e) { await step('  Compression pass 1 skipped: ' + e.message); }
  }

  // ── VM Layers with interleaved minify+compress for tight output ──
  // More layers = stronger protection. Interleaved compression keeps size manageable.
  const sizeKB = code.length / 1024;
  let maxLayers;
  if (zarthaRan)         maxLayers = 5;
  else if (sizeKB > 200) maxLayers = 3;
  else if (sizeKB > 100) maxLayers = 5;
  else if (sizeKB > 50)  maxLayers = 6;
  else if (sizeKB > 20)  maxLayers = 8;
  else                   maxLayers = 10;

  const layers = Math.min(Math.max(vmLayers, 1), maxLayers);
  await step(`Applying ${layers} VM layers with interleaved compression...`);

  // Apply VM layers in batches of 2, minify+compress between batches
  let remaining = layers;
  while (remaining > 0) {
    const batch = Math.min(2, remaining);
    try {
      const vmOut = applyVMLayers(code, batch, srcBytes);
      if (typeof vmOut === 'string' && vmOut.length > 0) code = vmOut;
    } catch (e) { await step('  VM batch skipped: ' + e.message); }
    remaining -= batch;

    // Minify to single line then compress between batches
    if (remaining > 0 && compress) {
      try {
        // Flatten to one line before compressing — deflate loves this
        code = safe('minifyWhitespace', minifyWhitespace, code, L);
        const before = code.length;
        const comp   = wrapWithDecompressor(code);
        if (comp && comp.length > 0 && comp.length < before) {
          const pct = Math.round((1 - comp.length / before) * 100);
          await step(`  Mid-VM minify+compress: ${Math.round(before/1024)}KB -> ${Math.round(comp.length/1024)}KB (-${pct}%)`);
          code = comp;
        }
      } catch (_) {}
    }
  }

  await step('Security header...');
  const BRAND = '--[[Goosefuscator]]--';
  let sec = '';
  if (security) {
    try { sec = generateSecurityHeader(srcBytes); }
    catch (e) { await step('  Security header skipped: ' + e.message); }
  }
  let wmHeader = '', wmFooter = '';
  try {
    const wm = makeWatermarks('Goosefuscator');
    wmHeader = wm.header || '';
    wmFooter = wm.footer || '';
  } catch (_) {}

  code = [BRAND, sec, code].filter(Boolean).join('\n\n');

  // ── HERCULES WRAPPER — ALWAYS FORCED (mandatory anti-tamper) ──
  await step('Hercules wrapper (FORCED)...');
  {
    const beforeHercules = code;
    let herculesDone = false;
    for (let attempt = 1; attempt <= 3 && !herculesDone; attempt++) {
      try {
        const result = herculesWrap(code);
        if (typeof result === 'string' && result.length > 0) {
          code = result;
          herculesDone = true;
          await step(`  Hercules done (attempt ${attempt})`);
        } else {
          await step(`  Hercules attempt ${attempt}: empty result`);
        }
      } catch (e) {
        await step(`  Hercules attempt ${attempt} failed: ${e.message.split('\n')[0]}`);
      }
    }
    if (!herculesDone) {
      code = beforeHercules;
      await step('  ⚠ Hercules failed all 3 attempts — keeping unwrapped code');
    }
  }

  code = stripLuaComments(code, BRAND);

  // ── PASS 2: Final minify to single line + compress for absolute smallest output ──
  if (compress) {
    await step('Final minify + compress...');
    try {
      // One last flatten to single line before final compression
      code = safe('minifyWhitespace', minifyWhitespace, code, L);
      const before = code.length;
      const comp   = wrapWithDecompressor(code);
      if (comp && comp.length > 0 && comp.length < before) {
        code = comp;
        const pct = Math.round((1 - code.length / before) * 100);
        await step(`  ${Math.round(before/1024)}KB -> ${Math.round(code.length/1024)}KB (-${pct}%)`);
      } else {
        await step(`  Final compress skipped (no size reduction)`);
      }
    } catch (e) { await step('  Final compression skipped: ' + e.message); }
  }

  if (wmHeader) code = wmHeader + '\n\n' + code;
  if (wmFooter) code = code + '\n\n' + wmFooter;

  const finalRatio = (code.length / sourceCode.length).toFixed(1);
  await step(`Done: ${formatSize(sourceCode.length)} -> ${formatSize(code.length)} (${finalRatio}x)`);
  return { output: code, log, vmLayersUsed: layers };
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + 'B';
  return (bytes / 1024).toFixed(1) + 'KB';
}

module.exports = { obfuscate };

