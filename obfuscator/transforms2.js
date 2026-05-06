'use strict';

const { randomName, randInt } = require('./utils');

// ── Zone helpers (shared with transforms.js) ───────────────────────
function buildSkipZones(code) {
  const zones = [];
  let m;
  const longStr = /\[=*\[[\s\S]*?\]=*\]/g;
  while ((m = longStr.exec(code)) !== null)
    zones.push({ start: m.index, end: m.index + m[0].length });
  const quotedStr = /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g;
  while ((m = quotedStr.exec(code)) !== null)
    if (!zones.some(z => m.index >= z.start && m.index < z.end))
      zones.push({ start: m.index, end: m.index + m[0].length });
  const lineComment = /--[^\n]*/g;
  while ((m = lineComment.exec(code)) !== null)
    if (!zones.some(z => m.index >= z.start && m.index < z.end))
      zones.push({ start: m.index, end: m.index + m[0].length });
  return zones;
}
function inZone(zones, i) {
  return zones.some(z => i >= z.start && i < z.end);
}

function opaqueFalse() {
  const method = randInt(0, 6);
  const a = randInt(100, 9999);
  if (method === 0) return `if math.random() > 2 then`;
  if (method === 1) return `if (${a}*0) ~= 0 then`;
  if (method === 2) return `if type(math)=="string" then`;
  if (method === 3) return `if math.abs(-${a}) < 0 then`;
  if (method === 4) return `if tostring(${a})==tostring(${a+1}) then`;
  if (method === 5) return `if #tostring(${a}) > 99 then`;
  return `if type(nil)=="number" then`;
}

// ── 1) Table key obfuscation ───────────────────────────────────────
// Replaces  t.fieldName  with  t[string.char(bytes)]  outside strings/comments
// Only targets identifiers that look like field accesses (after . or :)
function tableKeyObfuscation(code) {
  const zones = buildSkipZones(code);
  let any = false;

  // Match .identifier or :identifier but NOT ..  (concatenation)
  const result = code.replace(/([.:])([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, sep, field, offset) => {
    if (inZone(zones, offset)) return match;
    
    // Skip if preceded by function declaration (function tbl.method)
    const beforePart = code.slice(Math.max(0, offset - 40), offset);
    if (/\bfunction\s+[a-zA-Z0-9_.:]+$/.test(beforePart)) return match;

    // Skip if this is a .. (concat operator)
    if (sep === '.' && offset > 0 && code[offset - 1] === '.') return match;
    // Skip if next char is also . (would be ..)
    if (sep === '.' && code[offset + 1 + field.length] === '.') return match;
    // Skip Lua/Luau keywords that appear after . (these are method names we want to obfuscate)
    // skip very short names (1-2 chars) to avoid breaking things like t.x, t.y
    if (field.length < 3) return match;
    // Convert to string.char access
    const bytes = Array.from(field).map(c => c.charCodeAt(0));
    any = true;
    if (sep === ':') {
      // method call: obj:method(args) -> obj[string.char(...))(args) won't work
      // For : calls we need to be more careful, skip them
      return match;
    }
    return `[string.char(${bytes.join(',')})]`;
  });

  return any ? result : code;
}

// ── 2) Dynamic dispatch wrapping ───────────────────────────────────
// Wraps some function calls in indirect dispatch tables
// fn(args) -> ({fn})[1](args)  or  (select(1,fn))(args)
function dynamicDispatch(code) {
  const zones = buildSkipZones(code);
  let any = false;

  // Find function calls: identifier( but not keywords
  const LUA_KW = new Set([
    'and','break','do','else','elseif','end','false','for',
    'function','goto','if','in','local','nil','not','or',
    'repeat','return','then','true','until','while',
    'pcall','xpcall','require','type','typeof','error','assert',
    'print','warn','select','next','pairs','ipairs',
    'tostring','tonumber','rawget','rawset','rawequal','rawlen',
    'setmetatable','getmetatable','coroutine','table','string','math','bit32',
    'unpack','task',
  ]);

  const result = code.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, (match, fnName, offset) => {
    if (inZone(zones, offset)) return match;
    // Skip keywords and builtins (don't want to break calls to these)
    if (LUA_KW.has(fnName)) return match;
    
    // Skip if preceded by function keyword (function definition), including methods like function tbl:foo(
    const beforePart = code.slice(Math.max(0, offset - 40), offset);
    if (/\bfunction\s+(?:[a-zA-Z0-9_.:]+\s*)?$/.test(beforePart)) return match;
    if (/\blocal\s+$/.test(beforePart)) return match;

    any = true;
    const method = randInt(0, 2);
    if (method === 0) {
      return `({${fnName}})[1](`;
    } else if (method === 1) {
      return `(select(1,${fnName}))(`;
    } else {
      const tbl = randomName(5);
      // Can't insert a local before this easily, so use inline
      return `((function() return ${fnName} end)())(`;
    }
  });

  return any ? result : code;
}

// ── 3) String char shuffle with reconstruction ─────────────────────
// Takes strings and converts them to shuffled byte arrays that get
// unshuffled at runtime via a permutation table
function stringCharShuffle(code) {
  const zones = buildSkipZones(code);
  const decN = randomName(8);
  let any = false;

  const result = code.replace(/"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, (match, _d, _s, offset) => {
    if (inZone(zones, offset)) return match;
    const inner = match.slice(1, -1);
    if (inner.length < 4 || inner.length > 40) return match;

    let real;
    try {
      real = inner
        .replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r')
        .replace(/\\\\/g, '\\').replace(/\\"/g, '"').replace(/\\'/g, "'")
        .replace(/\\(\d{1,3})/g, (_, n) => String.fromCharCode(+n));
    } catch { return match; }

    const bytes = Array.from(Buffer.from(real, 'utf-8'));
    if (!bytes.length || bytes.some(b => b > 254)) return match;

    // Create a random permutation
    const n = bytes.length;
    const perm = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = randInt(0, i);
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }

    // Create shuffled array
    const shuffled = new Array(n);
    for (let i = 0; i < n; i++) {
      shuffled[perm[i]] = bytes[i];
    }

    // Create inverse permutation for reconstruction
    const inv = new Array(n);
    for (let i = 0; i < n; i++) {
      inv[perm[i]] = i + 1; // Lua 1-indexed
    }

    any = true;
    // Generate inline reconstruction
    return `(function() local _s={${shuffled.join(',')}};local _p={${inv.join(',')}};local _o={};for _i=1,${n} do _o[_i]=string.char(_s[_p[_i]]) end;return table.concat(_o) end)()`;
  });

  return any ? result : code;
}

// ── 4) MBA (Mixed Boolean Arithmetic) number expressions ───────────
// Creates mathematically equivalent but hard-to-simplify expressions
function mbaNumber(n) {
  n = n & 0xFFFFFFFF;
  const method = randInt(0, 5);

  if (method === 0) {
    // (a AND b) + (a OR b) == a + b
    // So n = ((n-k) AND k) + ((n-k) OR k)  for random k
    const k = randInt(1, 0xFFFF);
    const a = (n - k) & 0xFFFF;
    return `(bit32.band(${a},${k})+bit32.bor(${a},${k}))`;
  }
  if (method === 1) {
    // x = (x XOR m) XOR m
    const m = randInt(0x1000, 0xFFFF);
    return `bit32.bxor(bit32.bxor(${n ^ m},${m}),0)`;
  }
  if (method === 2) {
    // x = 2*(x AND m) + (x XOR m) where m is any mask
    // identity: 2*(a&b) + (a^b) = a+b, so we need a+b=n
    const a = randInt(1, n > 1 ? n - 1 : 1);
    const b = n - a;
    const m = randInt(1, 0xFFFF);
    return `(2*bit32.band(${a},${b})+bit32.bxor(${a},${b}))`;
  }
  if (method === 3) {
    // Nested XOR chain
    const k1 = randInt(0x100, 0xFFFF);
    const k2 = randInt(0x100, 0xFFFF);
    const enc = n ^ k1 ^ k2;
    return `bit32.bxor(bit32.bxor(${enc},${k1}),${k2})`;
  }
  if (method === 4) {
    // bit rotation identity
    const shift = randInt(1, 7);
    const mask = (1 << shift) - 1;
    const hi = (n >> shift) & 0xFFFF;
    const lo = n & mask;
    return `(bit32.lshift(${hi},${shift})+${lo})`;
  }
  // method 5: arithmetic chain
  const a = randInt(100, 5000);
  const b = randInt(2, 50);
  const c = n - (a * b);
  if (c >= 0) {
    return `(${a}*${b}+${c})`;
  }
  return `(${n})`;
}

// ── 5) Enhanced opaque predicates ──────────────────────────────────
// More complex predicates that are always true but hard to prove statically
function enhancedOpaqueWrap(code) {
  const N = () => randomName(7);
  const predicates = [];

  // Predicate 1: Fibonacci identity — fib(n)^2 - fib(n+1)*fib(n-1) == (-1)^(n-1)
  {
    const n = randInt(3, 8);
    // compute fib values
    let a = 0, b = 1;
    for (let i = 0; i < n; i++) { [a, b] = [b, a + b]; }
    const fibN = a, fibN1 = b;
    let c = 0, d = 1;
    for (let i = 0; i < n - 1; i++) { [c, d] = [c + d, c]; c = d + c - d; /* recompute */ }
    // Just use simple approach
    const fibs = [0, 1];
    for (let i = 2; i <= n + 1; i++) fibs.push(fibs[i-1] + fibs[i-2]);
    const fN = fibs[n], fN1 = fibs[n+1], fNm1 = fibs[n-1];
    const cassini = fN * fN - fN1 * fNm1; // should be (-1)^(n-1)
    const [vA, vB, vC, vR] = [N(), N(), N(), N()];
    predicates.push(
      `local ${vA}=${fN};local ${vB}=${fN1};local ${vC}=${fNm1}`,
      `local ${vR}=${vA}*${vA}-${vB}*${vC}`,
      `if ${vR}~=${cassini} then return end`
    );
  }

  // Predicate 2: String length verification
  {
    const str = Array.from({ length: randInt(5, 12) }, () =>
      String.fromCharCode(randInt(97, 122))).join('');
    const vS = N(), vL = N();
    predicates.push(
      `local ${vS}="${str}"`,
      `local ${vL}=#${vS}`,
      `if ${vL}~=${str.length} then return end`
    );
  }

  // Predicate 3: Modular arithmetic chain
  {
    const base = randInt(100, 9999);
    const mod = randInt(7, 97);
    const result = base % mod;
    const vV = N();
    predicates.push(
      `local ${vV}=${base}%${mod}`,
      `if ${vV}~=${result} then return end`
    );
  }

  // Predicate 4: XOR nilpotent check
  {
    const a = randInt(1, 0xFFFF);
    const vX = N();
    predicates.push(
      `local ${vX}=bit32.bxor(${a},${a})`,
      `if ${vX}~=0 then return end`
    );
  }

  // Predicate 5: Multiplication distributivity
  {
    const x = randInt(2, 50), y = randInt(2, 50), z = randInt(2, 50);
    const lhs = x * (y + z);
    const vL = N(), vR = N();
    predicates.push(
      `local ${vL}=${x}*(${y}+${z})`,
      `local ${vR}=${x}*${y}+${x}*${z}`,
      `if ${vL}~=${vR} then return end`
    );
  }

  return [
    `do`,
    ...predicates,
    code,
    `end`,
  ].join('\n');
}

// ── 6) Luau type annotation stripper ───────────────────────────────
// Removes type annotations without breaking code
function stripTypeAnnotations(code) {
  const zones = buildSkipZones(code);

  // Strip : type after parameters — e.g., function(a: number, b: string)
  // But be careful not to strip ternary or other : uses
  let result = code;

  // Strip export type and type alias declarations
  result = result.replace(/^(\s*)(?:export\s+)?type\s+[a-zA-Z_]\w*\s*(?:<[^>]*>)?\s*=\s*[^\n]*/gm, (m, indent, offset) => {
    if (inZone(zones, offset)) return m;
    return indent + '-- stripped type';
  });

  // Strip parameter type annotations: (name: Type) -> (name)
  // Pattern: identifier colon type-expr (up to comma or closing paren)
  result = result.replace(/(\b[a-zA-Z_]\w*)\s*:\s*(?:(?:\{[^}]*\})|(?:[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*(?:<[^>]*>)?(?:\?)?(?:\s*\|\s*[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*(?:<[^>]*>)?(?:\?)?)*))/g, (m, name, offset) => {
    if (inZone(zones, offset)) return m;
    // Check if this looks like it's in a function param context
    // Be conservative — only strip if we're confident
    const before = code.slice(Math.max(0, offset - 30), offset);
    if (/(?:function\s*\w*\s*\(|,\s*)$/.test(before)) {
      return name;
    }
    // Also strip return type annotations after )
    return m; // conservative: keep if unsure
  });

  // Strip -> ReturnType after function signatures
  result = result.replace(/\)\s*:\s*(?:\([^)]*\)|(?:(?:\{[^}]*\})|(?:[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*(?:<[^>]*>)?(?:\?)?(?:\s*\|\s*[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*(?:<[^>]*>)?(?:\?)?)*)))\s*(?=\n|$)/gm, (m, offset) => {
    if (inZone(zones, offset)) return m;
    // Find just the ) and strip the rest
    const parenIdx = m.indexOf(')');
    return m.slice(0, parenIdx + 1);
  });

  return result;
}

// ── 7) Fake obfuscator signatures ──────────────────────────────────
function injectFakeSignatures(code) {
  const sigs = [];
  sigs.push(`${opaqueFalse()} local _LPH_JIT=true;local _LPH_NO_VIRTUALIZE=false;local _LPH_ENCKEY="${randomName(16)}";local _LPH_STRENC=true end`);
  sigs.push(`${opaqueFalse()} local _PSU_WATERMARK="${randInt(100000, 999999)}";local _PSU_HWID=string.char(${Array.from({length:16},()=>randInt(48,122)).join(',')}) end`);
  sigs.push(`${opaqueFalse()} local _XEN_VERSION="2.${randInt(0,9)}.${randInt(0,9)}";local _XEN_HWID="${randomName(20)}";local __XEN_CIPHER=${randInt(1,9999)} end`);
  sigs.push(`${opaqueFalse()} local _IB2_SALT="${randomName(12)}";local _IB2_VMKEY=${randInt(10000,99999)} end`);
  sigs.push(`${opaqueFalse()} local _MS_V3_KEY="${randomName(24)}";local _MS_V3_LAYER=${randInt(1,8)} end`);
  for (let i = sigs.length - 1; i > 0; i--) { const j = randInt(0, i); [sigs[i], sigs[j]] = [sigs[j], sigs[i]]; }
  return sigs.join('\n') + '\n' + code;
}

// ── 8) Roblox-only execution lock ──────────────────────────────────
function robloxOnlyLock(code) {
  const N = () => randomName(8);
  const sc = (s) => `string.char(${Array.from(s).map(c => c.charCodeAt(0)).join(',')})`;
  const [vK,vP,vKF,vT] = [N(),N(),N(),N()];
  const L = [];
  L.push(`local ${vK}=false`,`local ${vP}=pcall`);
  L.push(`local ${vKF}=function() ${vP}(function() local _r=game:GetService(${sc('RunService')});while true do _r.Heartbeat:Wait() end end);local ${vT}=coroutine.wrap(function() while true do coroutine.yield() end end);while true do ${vP}(${vT}) end end`);
  L.push(`${vP}(function() local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')});if not _g then ${vK}=true;return end;if typeof(_g)~=${sc('Instance')} then ${vK}=true;return end;if _g.ClassName~=${sc('DataModel')} then ${vK}=true end end)`);
  L.push(`${vP}(function() local _w=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('workspace')});if not _w then ${vK}=true;return end;if typeof(_w)~=${sc('Instance')} then ${vK}=true end end)`);
  L.push(`${vP}(function() local _r=game:GetService(${sc('RunService')});if not _r or typeof(_r)~=${sc('Instance')} then ${vK}=true end end)`);
  L.push(`${vP}(function() local _p=game:GetService(${sc('Players')});if not _p or typeof(_p)~=${sc('Instance')} then ${vK}=true end;if _p and _p.ClassName~=${sc('Players')} then ${vK}=true end end)`);
  L.push(`${vP}(function() local _tf=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('typeof')});if not _tf then ${vK}=true;return end;if _tf(true)~=${sc('boolean')} then ${vK}=true end end)`);
  L.push(`${vP}(function() local _ok=pcall(function() game() end);if _ok then ${vK}=true end end)`);
  const sn = randomName(10);
  L.push(`${vP}(function() local _gf=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getfenv')});if type(_gf)~=${sc('function')} then return end;rawset(_G,${sc(sn)},true);local _e=_gf();if not _e[${sc(sn)}] then ${vK}=true end;rawset(_G,${sc(sn)},nil) end)`);
  const exG = ['hookfunction','hookmetamethod','newcclosure','replaceclosure','getgenv','getrenv','getreg','getgc','getinstances','getnilinstances','getconnections','firesignal','fireclickdetector','firetouchinterest','fireproximityprompt','setclipboard','setfflag','getnamecallmethod','checkcaller','islclosure','iscclosure','getthreadidentity','setthreadidentity','identifyexecutor','getexecutorname','is_synapse_function','Drawing','crypt','request','http_request','syn_request','getscriptbytecode','getscriptclosure','decompile','dumpstring','saveinstance','writefile','readfile','isfile','delfile','listfiles','makefolder','isfolder','delfolder','appendfile','syn','fluxus','krnl','Synapse','KRNL_LOADED'];
  L.push(`do`);
  for (const g of exG) L.push(` if rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc(g)})~=nil then ${vK}=true end`);
  L.push(`end`);
  L.push(`${vP}(function() local _d=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('debug')});if not _d or not _d.getinfo then return end;local _i=_d.getinfo(rawget);if _i and _i.what~=${sc('C')} then ${vK}=true end end)`);
  L.push(`if ${vK} then ${vP}(function() rawset(_G,${sc('warn')},function()end) end);${vP}(function() rawset(_G,${sc('print')},function()end) end);${vKF}();return end`);
  L.push(`${vP}(function() rawset(_G,${sc('decompile')},function()error(${sc('')})end);rawset(_G,${sc('dumpstring')},function()error(${sc('')})end);rawset(_G,${sc('getscriptbytecode')},function()return ${sc('')} end) end)`);
  L.push(`${vP}(function() local _rs=game:GetService(${sc('RunService')});local _tk=0;_rs.Heartbeat:Connect(function(_dt) _tk=_tk+_dt;if _tk<3 then return end;_tk=0;if rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('hookfunction')})~=nil then ${vKF}() end;if rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('newcclosure')})~=nil then ${vKF}() end;if rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getgenv')})~=nil then ${vKF}() end end) end)`);
  return L.join('\n') + '\n' + code;
}

// ── 9) Anti-deobfuscation traps ────────────────────────────────────
function antiDeobfuscationTraps(code) {
  const N = () => randomName(8);
  const sc = (s) => `string.char(${Array.from(s).map(c => c.charCodeAt(0)).join(',')})`;
  const [vP,vKF] = [N(),N()];
  const L = [];
  L.push(`local ${vP}=pcall`);
  L.push(`local ${vKF}=function() local _c=coroutine.wrap(function() while true do coroutine.yield() end end);while true do pcall(_c) end end`);
  const hv = Array.from({length:3},()=>N());
  L.push(`do`);
  for (const h of hv) L.push(` local ${h}=setmetatable({},{__index=function() ${vKF}() end,__tostring=function() ${vKF}() end,__len=function() ${vKF}() end,__call=function() ${vKF}() end})`);
  L.push(`end`);
  L.push(`${vP}(function() local _p=function() end;local _a=tostring(_p);if type(_a)~=${sc('string')} then ${vKF}() end;if tostring(_p)~=_a then ${vKF}() end end)`);
  L.push(`${vP}(function() local _t1=os.clock();local _s=0;for _i=1,50000 do _s=_s+_i end;if os.clock()<=_t1 then ${vKF}() end end)`);
  L.push(`${vP}(function() if pcall(function() end)~=true then ${vKF}() end;if pcall(function() error(${sc('')}) end)~=false then ${vKF}() end end)`);
  const tk=randomName(8),tv=randomName(8);
  L.push(`${vP}(function() local _t={};rawset(_t,${sc(tk)},${sc(tv)});if rawget(_t,${sc(tk)})~=${sc(tv)} then ${vKF}() end end)`);
  L.push(`${vP}(function() local _co=coroutine.running();if _co~=nil and coroutine.status(_co)~=${sc('running')} then ${vKF}() end end)`);
  L.push(`${vP}(function() local _d=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('debug')});if not _d then return end;if _d.getupvalues then rawset(_d,${sc('getupvalues')},function() return {} end) end;if _d.getconstants then rawset(_d,${sc('getconstants')},function() local _r={};for _i=1,math.random(5,15) do _r[_i]=tostring(math.random(100000,999999)) end;return _r end) end;if _d.getprotos then rawset(_d,${sc('getprotos')},function() return {} end) end;if _d.getinfo then local _gi=_d.getinfo;rawset(_d,${sc('getinfo')},function(...) local _ok,_r=pcall(_gi,...);if _ok and _r then _r.source=${sc('[C]')};_r.short_src=${sc('[C]')};_r.name=nil end;return _r end) end end)`);
  L.push(`${vP}(function() if rawget(string,${sc('dump')}) then rawset(string,${sc('dump')},function() error(${sc('')}) end) end end)`);
  return L.join('\n') + '\n' + code;
}

module.exports = {
  tableKeyObfuscation, dynamicDispatch, stringCharShuffle, mbaNumber,
  enhancedOpaqueWrap, stripTypeAnnotations, injectFakeSignatures,
  robloxOnlyLock, antiDeobfuscationTraps,
};
