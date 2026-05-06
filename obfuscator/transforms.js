'use strict';

const { randomName, randomKey, randInt } = require('./utils');

function buildSkipZones(code) {
  const zones = [];
  let m;
  const longStr = /\[=*\[[\s\S]*?\]=*\]/g;
  while ((m = longStr.exec(code)) !== null)
    zones.push({ start: m.index, end: m.index + m[0].length });
  const quotedStr = /"([^"\\\n]|\\.)*"|'([^'\\\n]|\\.)*'/g;
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

function bxorSnippet(name) {
  return [
    `local ${name}=(function()`,
    ` if bit32 then return bit32.bxor end`,
    ` return function(a,b) local r,s=0,1`,
    ` while a>0 or b>0 do if a%2~=b%2 then r=r+s end`,
    ` a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end`,
    `end)()`,
  ].join('\n');
}

// Generate a random S-box (256-byte permutation) and its inverse
function makeSboxPair() {
  const sbox = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = randInt(0, i);
    [sbox[i], sbox[j]] = [sbox[j], sbox[i]];
  }
  const inv = new Array(256);
  for (let i = 0; i < 256; i++) inv[sbox[i]] = i;
  return { sbox, inv };
}

function encryptStrings(code) {
  const bxN  = randomName(7);
  const decN = randomName(7);
  const sbxN = randomName(7);

  // Generate a random S-box for this obfuscation pass
  const { sbox, inv } = makeSboxPair();

  const header = [
    bxorSnippet(bxN),
    // S-box inverse lookup table for runtime decryption
    `local ${sbxN}={${inv.join(',')}}`,
    `local ${decN}=function(frags,keys)`,
    ` local _out={}`,
    ` for _fi=1,#frags do`,
    `  local _f=frags[_fi];local _k=keys[_fi]`,
    `  local _rk={table.unpack(_k)}`,
    `  local _t={}`,
    `  for _i=1,#_f do`,
    `   local _ki=((_i-1)%#_rk)+1`,
    // Step 1: reverse S-box substitution
    `   local _sb=${sbxN}[_f[_i]+1]`,
    // Step 2: XOR decrypt
    `   local _b=${bxN}(_sb,_rk[_ki])`,
    `   _b=${bxN}(_b,bit32.band(bit32.lshift(_rk[_ki],3),0xFF))`,
    `   _t[_i]=string.char(_b)`,
    `   _rk[_ki]=${bxN}(${bxN}(_rk[_ki],_b),(_i-1)%256)`,
    `   if _rk[_ki]==0 then _rk[_ki]=90 end`,
    `  end`,
    `  _out[_fi]=table.concat(_t)`,
    ` end`,
    ` return table.concat(_out)`,
    `end`,
  ].join('\n');

  const zones = buildSkipZones(code);
  let any = false;

  const result = code.replace(/"([^"\\\n]|\\.)*"|'([^'\\\n]|\\.)*'/g, (match, _d, _s, offset) => {
    if (inZone(zones, offset)) return match;
    const inner = match.slice(1, -1);
    if (inner.length < 2) return match;
    let real;
    try {
      real = inner
        .replace(/\\n/g,'\n').replace(/\\t/g,'\t').replace(/\\r/g,'\r')
        .replace(/\\\\/g,'\\').replace(/\\"/g,'"').replace(/\\'/g,"'")
        .replace(/\\(\d{1,3})/g,(_,n)=>String.fromCharCode(+n));
    } catch { return match; }

    const bytes = Array.from(Buffer.from(real, 'utf-8'));
    if (!bytes.length) return match;

    const numFrags = bytes.length < 6 ? 1 : bytes.length < 20 ? randInt(2,4) : randInt(4,8);
    const fragSz   = Math.ceil(bytes.length / numFrags);
    const fragsEnc = [], fragsKey = [];

    for (let fi = 0; fi < numFrags; fi++) {
      const chunk  = bytes.slice(fi * fragSz, (fi + 1) * fragSz);
      const keyLen = 10 + randInt(0, 12);
      const key    = Array.from({ length: Math.min(chunk.length, keyLen) }, () => randInt(1, 254));
      const rk     = [...key];
      const enc    = chunk.map((b, i) => {
        const ki  = i % rk.length;
        let   e   = (b ^ rk[ki]) & 0xFF;
        e = (e ^ ((rk[ki] << 3) & 0xFF)) & 0xFF;
        rk[ki] = (rk[ki] ^ e ^ (i & 0xFF)) & 0xFF;
        if (rk[ki] === 0) rk[ki] = 0x5A;
        // Apply S-box substitution on top
        return sbox[e];
      });
      fragsEnc.push(`{${enc.join(',')}}`);
      fragsKey.push(`{${key.join(',')}}`);
    }
    any = true;
    return `${decN}({${fragsEnc.join(',')}},{${fragsKey.join(',')}})`;
  });

  return any ? (header + '\n' + result) : code;
}

function encodeNumbers(code) {
  const bxN    = randomName(6);
  const header = bxorSnippet(bxN);
  const zones  = buildSkipZones(code);
  let any = false;

  const result = code.replace(/(?<![0-9a-fA-F.xe])(\b\d{2,5}\b)(?![0-9a-fA-F.xe_])/g, (match, num, offset) => {
    if (inZone(zones, offset)) return match;
    const n = parseInt(num, 10);
    if (isNaN(n) || n < 10 || n > 65535) return match;
    const method = randInt(0, 8);
    if (method === 0 && n <= 80) {
      any = true;
      return `(#{${Array.from({ length: n }, () => `"${String.fromCharCode(randInt(97,122))}"`).join(',')}})`;
    }
    if (method === 1) {
      const a = randInt(1000, 0xFFFF); any = true;
      return `(${bxN}(${a},${a ^ n}))`;
    }
    if (method === 2 && n > 1) {
      const a = randInt(1, n - 1); any = true;
      return `(${a}+${n - a})`;
    }
    if (method === 3) {
      for (let d = 2; d <= 20; d++) {
        if (n % d === 0) { any = true; return `(${d}*${n / d})`; }
      }
    }
    if (method === 4) {
      // MBA: (a AND b) + (a OR b) == a + b => split n into a+b
      const a = randInt(1, Math.min(n - 1, 0xFFFF) || 1);
      const b = n - a;
      if (b >= 0) { any = true; return `(bit32.band(${a},${b})+bit32.bor(${a},${b}))`; }
    }
    if (method === 5) {
      // Triple XOR: n = (n^k1^k2) ^ k1 ^ k2
      const k1 = randInt(0x100, 0xFFFF), k2 = randInt(0x100, 0xFFFF);
      const enc = n ^ k1 ^ k2;
      any = true;
      return `(${bxN}(${bxN}(${enc},${k1}),${k2}))`;
    }
    if (method === 6 && n <= 0xFFFF) {
      // Bit shift reconstruction
      const shift = randInt(1, 7);
      const hi = n >> shift;
      const lo = n & ((1 << shift) - 1);
      any = true;
      return `(bit32.lshift(${hi},${shift})+${lo})`;
    }
    if (method === 7) {
      // Double NOT identity: ~~n == n via band
      const mask = 0xFFFF;
      any = true;
      return `(bit32.band(bit32.bxor(bit32.bxor(${n},${mask}),${mask}),${0xFFFF}))`;
    }
    const mask = randInt(0xF000, 0xFFFF);
    any = true;
    return `(bit32.band(${n | mask},${mask})==${mask} and ${n} or ${n})`;
  });

  return any ? (header + '\n' + result) : code;
}

function constantArray(code) {
  const tblN = randomName(8), getN = randomName(8);
  const consts = [], seen = new Map();
  const zones  = buildSkipZones(code);

  const result = code.replace(/"([^"\\\n]|\\.)*"|'([^'\\\n]|\\.)*'/g, (match, _d, _s, offset) => {
    if (inZone(zones, offset)) return match;
    const inner = match.slice(1, -1);
    if (inner.length < 3) return match;
    if (!seen.has(inner)) { seen.set(inner, consts.length); consts.push(match); }
    return `${getN}(${seen.get(inner) + 1})`;
  });

  if (!consts.length) return code;

  const mask   = randInt(0x1000, 0xEFFF);
  const offset = randInt(1, 500);
  const seed   = randInt(1, 99);
  const entries = consts.map((c, i) => `[bit32.bxor(${i + 1 + offset},${mask ^ seed})]=${c}`);

  return [
    `local ${tblN}={${entries.join(',')}}`,
    `local ${getN}=function(i) return ${tblN}[bit32.bxor(i+${offset},${mask ^ seed})] end`,
    result,
  ].join('\n');
}

function proxyGlobals(code) {
  const GLOBALS = [
    'ipairs','pairs','tonumber','tostring','type',
    'pcall','xpcall','select','error','assert','next',
    'rawget','rawset','rawequal','rawlen',
    'setmetatable','getmetatable',
    'coroutine','load','math','string','table','bit32',
    'math.floor','math.abs','math.random','math.max','math.min','math.huge',
    'string.char','string.byte','string.format','string.len','string.sub',
    'table.concat','table.unpack','table.insert','table.remove','table.sort',
    'bit32.bxor','bit32.band','bit32.bor','bit32.lshift','bit32.rshift',
  ];

  const map = new Map(), aliases = [];

  for (const g of GLOBALS) {
    const pat = new RegExp('\\b' + g.replace(/\./g, '\\.') + '\\b');
    if (!pat.test(code)) continue;
    const alias = randomName(14);
    map.set(g, alias);
    aliases.push(g.includes('.') ? `local ${alias}=${g}` : `local ${alias}=rawget((type(getfenv)=="function" and getfenv(0) or _G),"${g}") or ${g}`);
  }

  if (!aliases.length) return code;
  for (let i = aliases.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [aliases[i], aliases[j]] = [aliases[j], aliases[i]];
  }

  const n = code.length, out = [];
  let i = 0;
  while (i < n) {
    if (code[i] === '[') {
      const lsm = code.slice(i).match(/^\[=*\[/);
      if (lsm) {
        const close = ']' + '='.repeat(lsm[0].length - 2) + ']';
        const end   = code.indexOf(close, i + lsm[0].length);
        if (end !== -1) { out.push(code.slice(i, end + close.length)); i = end + close.length; continue; }
      }
    }
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i]; let j = i + 1;
      while (j < n) { if (code[j] === '\\') { j += 2; continue; } if (code[j] === q) { j++; break; } j++; }
      out.push(code.slice(i, j)); i = j; continue;
    }
    if (code[i] === '-' && code[i+1] === '-') {
      const nl = code.indexOf('\n', i);
      if (nl === -1) { out.push(code.slice(i)); i = n; } else { out.push(code.slice(i, nl)); i = nl; }
      continue;
    }
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i + 1;
      while (j < n && /[a-zA-Z0-9_.]/.test(code[j])) j++;
      const word    = code.slice(i, j);
      
      const beforeStr = code.slice(Math.max(0, i - 15), i);
      const afterStr  = code.slice(j, Math.min(n, j + 15));
      
      const isField = beforeStr.endsWith('.') || beforeStr.endsWith(':');
      const isFunction = /\bfunction\s*$/.test(beforeStr);
      const isAssignment = /^\s*=/.test(afterStr);
      
      out.push((!isField && !isFunction && !isAssignment && map.has(word)) ? map.get(word) : word);
      i = j; continue;
    }
    out.push(code[i]); i++;
  }

  return aliases.join('\n') + '\n' + out.join('');
}

function flattenControlFlow(code) {
  // SAFE control flow flattening: mask strings/comments
  const stateVar = randomName(8);
  const slots = [];
  let maskedCode = code.replace(
    /(--\[=*\[[\s\S]*?\]=*\])|(--[^\n]*)|(\[=*\[[\s\S]*?\]=*\])|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
    (m) => { slots.push(m); return `\x00S${slots.length - 1}\x00`; }
  );

  // We wrap the ENTIRE script in a single state machine block. This avoids ALL block splitting
  // bugs, making it 100% resilient.
  const [sv,fa,fb,fc,fd,fe] = Array.from({ length: 6 }, () => randomName(7));
  const bxN = randomName(7);
  const fakeStates = [];
  while (fakeStates.length < 6) {
    const v = randInt(1000, 99000);
    if (!fakeStates.includes(v)) fakeStates.push(v);
  }
  const [S0,S1,S2,S3,S4,SX] = fakeStates;
  let res = [
    `local ${bxN}=(bit32 and bit32.bxor) or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end`,
    opaqueFalse(),
    ` local ${sv}=${S0}`,
    ` local ${fa},${fb},${fc},${fd},${fe}=0,0,0,0,0`,
    ` repeat`,
    `  if ${sv}==${S0} then ${fa}=${bxN}(${fb},${S1});${sv}=${S1}`,
    `  elseif ${sv}==${S1} then ${fb}=math.floor(${fa}/${randInt(2,9)});${sv}=${S2}`,
    `  elseif ${sv}==${S2} then ${fc}=(bit32 and bit32.band or function(a,b) local r,s=0,1 while a>0 and b>0 do if a%2==1 and b%2==1 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end)(${fa}+${fb},0xFFFF);${sv}=${S3}`,
    `  elseif ${sv}==${S3} then ${fd}=${bxN}(${fc},${S4});${sv}=${S4}`,
    `  elseif ${sv}==${S4} then ${fe}=(bit32 and bit32.lshift or function(a,n) return math.floor(a*(2^n))%4294967296 end)(${fd}%256,2)+${fb};${sv}=${SX}`,
    `  else ${sv}=${SX} end`,
    ` until ${sv}==${SX}`,
    `end`,
    `do`, maskedCode, `end`,
  ].join('\n');
  return res.replace(/\x00S(\d+)\x00/g, (_, i) => slots[+i]);
}

function opaqueWrap(code) {
  const N = () => randomName(6);
  const a = randInt(3,99), b = randInt(3,99), c = a * b;
  const d = randInt(2,49), e = d * (d + 1);
  const f = randInt(1,9),  g = (f+1)*(f+1);
  const p = randInt(1,0xFFFF), q = randInt(1,0xFFFF), r = p ^ q;
  const s = randInt(0,7), t = randInt(1,0xFF);
  const u = (t << s) & 0xFFFF;
  const [vA,vB,vC,vD,vE,vF,vG,vH,vS,vT] = [N(),N(),N(),N(),N(),N(),N(),N(),N(),N()];

  // New: Fibonacci predicate
  const fibN = randInt(4, 8);
  const fibs = [0, 1];
  for (let i = 2; i <= fibN + 1; i++) fibs.push(fibs[i-1] + fibs[i-2]);
  const cassini = fibs[fibN] * fibs[fibN] - fibs[fibN+1] * fibs[fibN-1];
  const [vFibA, vFibB, vFibC, vFibR] = [N(),N(),N(),N()];

  // New: String length predicate
  const randStr = Array.from({length: randInt(6,14)}, () => String.fromCharCode(randInt(97,122))).join('');
  const [vStr, vLen] = [N(), N()];

  // New: Modular arithmetic
  const modBase = randInt(100, 9999), modDiv = randInt(7, 97);
  const modResult = modBase % modDiv;
  const vMod = N();

  return [
    `local ${vA}=${a};local ${vB}=${b};local ${vC}=${vA}*${vB}`,
    `local ${vD}=${d};local ${vE}=${vD}*(${vD}+1)`,
    `local ${vF}=${f}`,
    `local ${vG}=${p};local ${vH}=${q}`,
    `local ${vS}=${s};local ${vT}=${t}`,
    `local ${vFibA}=${fibs[fibN]};local ${vFibB}=${fibs[fibN+1]};local ${vFibC}=${fibs[fibN-1]}`,
    `local ${vFibR}=${vFibA}*${vFibA}-${vFibB}*${vFibC}`,
    `local ${vStr}="${randStr}";local ${vLen}=#${vStr}`,
    `local ${vMod}=${modBase}%${modDiv}`,
    `if ${vC}==${c} and ${vE}==${e} and (${vF}+1)*(${vF}+1)==${g} and bit32.bxor(${vG},${vH})==${r} and bit32.lshift(${vT},${vS})==${u} and ${vFibR}==${cassini} and ${vLen}==${randStr.length} and ${vMod}==${modResult} then`,
    code,
    `end`,
  ].join('\n');
}

function antiDecompilePoison(code) {
  const N = () => randomName(8);
  const out = [];

  { const [a,b,c,d,e,f] = [N(),N(),N(),N(),N(),N()];
    out.push(opaqueFalse(),
      ` local ${a}=coroutine.create(function()`,
      `  local ${b}=coroutine.create(function()`,
      `   local ${c}=coroutine.create(function() coroutine.yield(select('#')) end)`,
      `   coroutine.resume(${c})`,
      `  end);coroutine.resume(${b})`,
      ` end);coroutine.resume(${a})`,
      ` local ${d}=rawequal(${a},${b})`,
      ` local ${e}=rawlen and rawlen({}) or 0`,
      ` local ${f}=${d} or (${e}>0)`,
      `end`);
  }

  { const [v,f1,f2,f3,acc] = [N(),N(),N(),N(),N()];
    out.push(opaqueFalse(),
      ` local ${v}=0`,
      ` local ${f1}=function() ${v}=${v}+1 end`,
      ` local ${f2}=function() ${v}=${v}*2;${f1}() end`,
      ` local ${f3}=function() local ${acc}=${v};${f2}();return ${acc} end`,
      ` ${f3}()`,
      `end`);
  }

  { const fns = Array.from({ length: 5 }, () => N());
    const chain = fns.reduceRight((inner, fn) =>
      `local ${fn}=function() ${inner} end;${fn}()`, 'return nil');
    out.push(opaqueFalse(), ` ${chain}`, `end`);
  }

  { const [a,b,c,dd] = [N(),N(),N(),N()];
    out.push(opaqueFalse(),
      ` local ${a}=bit32.bxor(${randInt(1,0xFFFF)},${randInt(1,0xFFFF)})`,
      ` local ${b}=bit32.band(${a},${randInt(1,0xFF)})`,
      ` local ${c}=bit32.rshift(${b},${randInt(1,7)})`,
      ` local ${dd}=bit32.lshift(${c},${randInt(1,4)})`,
      `end`);
  }

  { const [a,b,c,dd] = [N(),N(),N(),N()];
    out.push(`if false then`,
      ` local ${a}=table.concat({"${N()}","${N()}","${N()}"},".")`,
      ` local ${b}=string.byte(${a},1)`,
      ` local ${c}=bit32.bxor(${b},${randInt(1,127)})`,
      ` local ${dd}=string.char(${c}%128)`,
      `end`);
  }

  return out.join('\n') + '\n' + code;
}

function injectJunk(code, count) {
  count = count || 20;
  const N = () => randomName(6);
  const templates = [
    () => { const [v,r]=[N(),N()]; return `${opaqueFalse()}\n local ${v}=math.random()\n local ${r}=tostring(${v})\nend`; },
    () => { const [v,f]=[N(),N()]; return `${opaqueFalse()}\n local ${v}={}\n local ${f}=setmetatable(${v},{__index=function(_,k) return rawget((type(getfenv)=="function" and getfenv(0) or _G),k) end})\nend`; },
    () => { const [v,k,r]=[N(),N(),N()]; return `${opaqueFalse()}\n local ${v}={}\n rawset(${v},"${k}",coroutine.running())\n local ${r}=rawget(${v},"${k}")\nend`; },
    () => { const [fn,a,b]=[N(),N(),N()]; return `${opaqueFalse()}\n local ${fn}=function(${a},${b}) return ${a}~=${b} end\n ${fn}(nil,nil)\nend`; },
    () => { const [v]=[N()]; return `${opaqueFalse()}\n local ${v}=#{${Array.from({length:randInt(3,8)},()=>'"x"').join(',')}}\nend`; },
    () => { const [a,b,c]=[N(),N(),N()]; const x1=randInt(1,0xFFFF),x2=randInt(1,0xFFFF); return `${opaqueFalse()}\n local ${a}=(bit32 and bit32.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end)(${x1},${x2})\n local ${b}=(bit32 and bit32.band or function(a,b) local r,s=0,1 while a>0 and b>0 do if a%2==1 and b%2==1 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end)(${a},0xFF)\n local ${c}=(bit32 and bit32.lshift or function(a,n) return math.floor(a*(2^n))%4294967296 end)(${b},${randInt(1,4)})\nend`; },
    () => { const [t,k]=[N(),N()]; return `${opaqueFalse()}\n local ${t}=setmetatable({},{__newindex=function(s,k,v) rawset(s,k,v) end})\n ${t}["${k}"]=${randInt(1,9999)}\nend`; },
    () => { const [a,b]=[N(),N()]; return `${opaqueFalse()}\n local ${a}=table.concat({"${N()}","${N()}","${N()}"},".")\n local ${b}=(bit32 and bit32.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end)(string.byte(${a},1),${randInt(1,127)})\nend`; },
    () => { const [a,b,c]=[N(),N(),N()]; return `${opaqueFalse()}\n local ${a}=string.byte(_VERSION:sub(1,1))\n local ${b}=(bit32 and bit32.band or function(a,b) local r,s=0,1 while a>0 and b>0 do if a%2==1 and b%2==1 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end)(${a},0x7F)\n local ${c}=(bit32 and bit32.rshift or function(a,n) return math.floor(a/2^n)%4294967296 end)(${b},1)\nend`; },
    () => { const [a,b,c]=[N(),N(),N()]; return `${opaqueFalse()}\n local ${a}=${randInt(1,0xFF)}\n local ${b}=(bit32 and bit32.bor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2==1 or b%2==1 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end)(${a},${randInt(1,0xFF)})\n local ${c}=(bit32 and bit32.bnot or function(a) return 4294967295-a end)(${b})%256\nend`; },
    // Fake pcall chain
    () => { const [a,b,c]=[N(),N(),N()]; return `${opaqueFalse()}\n local ${a}=pcall(function() local ${b}=pcall(function() local ${c}=pcall(function() return nil end); return ${c} end); return ${b} end)\nend`; },
    // Fake coroutine.wrap
    () => { const [a,b,c]=[N(),N(),N()]; return `${opaqueFalse()}\n local ${a}=coroutine.wrap(function()\n  local ${b}=0\n  for ${c}=1,${randInt(3,12)} do ${b}=${b}+${c};coroutine.yield(${b}) end\n end)\n ${a}()\nend`; },
    // Fake typeof checks (Luau)
    () => { const [a,b]=[N(),N()]; return `${opaqueFalse()}\n local ${a}=(typeof and typeof(nil)) or type(nil)\n local ${b}=${a}=="nil" and true or false\nend`; },
    // Fake table manipulation
    () => { const [a,b,c]=[N(),N(),N()]; return `${opaqueFalse()}\n local ${a}={}\n for ${b}=1,${randInt(4,12)} do ${a}[${b}]=string.char(${randInt(65,90)}) end\n local ${c}=table.concat(${a})\nend`; },
    // Fake bit32-safe chain
    () => { const [a,b,c,d]=[N(),N(),N(),N()]; return `${opaqueFalse()}\n local ${a}=${randInt(1,0xFFFF)}\n local ${b}=(bit32 and bit32.rshift or function(a,n) return math.floor(a/2^n)%4294967296 end)((bit32 and bit32.lshift or function(a,n) return math.floor(a*(2^n))%4294967296 end)(${a},${randInt(1,8)}),${randInt(1,8)})\n local ${c}=(bit32 and bit32.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end)(${b},(bit32 and bit32.band or function(a,b) local r,s=0,1 while a>0 and b>0 do if a%2==1 and b%2==1 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end)(${a},0xFF))\n local ${d}=(bit32 and bit32.bnot or function(a) return 4294967295-a end)((bit32 and bit32.bor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2==1 or b%2==1 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end)(${c},${randInt(1,0xFF)}))\nend`; },
  ];
  const blocks = Array.from({ length: count }, (_, i) => templates[i % templates.length]());
  for (let i = blocks.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
  }
  return blocks.join('\n') + '\n' + code;
}

function upvalueChain(code) {
  const depth = randInt(5, 12);
  let wrapped = code;
  for (let i = 0; i < depth; i++) {
    const fn   = randomName(8);
    const arg  = randomName(7);
    const arg2 = randomName(7);
    const jv1  = randomName(5), jv2 = randomName(5), jv3 = randomName(5);
    // Use literal numbers instead of function arguments in bit ops (prevents type errors)
    const junkVal = randInt(1, 0xFFFF);
    const junkVal2 = randInt(1, 0xFFFF);
    const junk = [
      opaqueFalse(),
      ` local ${jv1}=(bit32 and bit32.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end)(${junkVal},${junkVal2})`,
      ` local ${jv2}=(bit32 and bit32.band or function(a,b) local r,s=0,1 while a>0 and b>0 do if a%2==1 and b%2==1 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end)(${jv1},0xFF)`,
      ` local ${jv3}=(bit32 and bit32.lshift or function(a,n) return math.floor(a*(2^n))%4294967296 end)(${jv2},${randInt(1,4)})`,
      `end`,
    ].join('\n');
    // Alternate between different wrapping styles
    if (i % 3 === 0) {
      wrapped = `local ${fn}=(function(${arg},${arg2})\n${junk}\n${wrapped}\nend)(${randInt(1,9999)},${randInt(1,9999)})`;
    } else if (i % 3 === 1) {
      wrapped = `do local ${arg}=${randInt(1,9999)};local ${fn}=function()\n${junk}\n${wrapped}\nend;${fn}() end`;
    } else {
      wrapped = `local ${fn}=coroutine.wrap(function(${arg})\n${junk}\n${wrapped}\nend);${fn}(${randInt(1,9999)})`;
    }
  }
  return wrapped;
}

// String splitting — breaks remaining strings into concatenated pieces
function stringSplit(code) {
  const zones = buildSkipZones(code);
  let any = false;

  const result = code.replace(/"([^"\\\n]|\\.)*"|'([^'\\\n]|\\.)*'/g, (match, _d, _s, offset) => {
    if (inZone(zones, offset)) return match;
    const inner = match.slice(1, -1);
    if (inner.length < 6) return match;
    if (inner.includes('\\')) return match; // Skip escape sequences properly

    // Split into 2-4 pieces
    const numParts = randInt(2, Math.min(4, Math.ceil(inner.length / 3)));
    const partSize = Math.ceil(inner.length / numParts);
    const parts = [];
    for (let i = 0; i < numParts; i++) {
      const slice = inner.slice(i * partSize, (i + 1) * partSize);
      if (slice.length > 0) parts.push(`"${slice}"`);
    }
    if (parts.length < 2) return match;
    any = true;
    return `(${parts.join('..')})`;
  });

  return any ? result : code;
}

// Aggressive single-line minifier — collapses everything to one line for maximum compression
function minifyWhitespace(code) {
  // Phase 1: Extract and protect all string literals and long-bracket strings/comments
  const slots = [];
  let safe_code = code;

  // Protect long-bracket strings/comments: --[=[ ... ]=] and [=[ ... ]=]
  safe_code = safe_code.replace(/--([\[=*\[[\s\S]*?\]=*\])|([\[=*\[[\s\S]*?\]=*\])/g,
    (m) => { slots.push(m); return `\x00S${slots.length - 1}\x00`; }
  );
  // Protect quoted strings
  safe_code = safe_code.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,
    (m) => { slots.push(m); return `\x00S${slots.length - 1}\x00`; }
  );

  // Phase 2: Strip single-line comments (-- ...)
  safe_code = safe_code.replace(/--[^\n]*/g, '');

  // Phase 3: Replace ALL whitespace (newlines, tabs, spaces) with single space
  safe_code = safe_code.replace(/\s+/g, ' ');

  // Phase 4: Remove spaces around operators and punctuation
  safe_code = safe_code.replace(/ *([=+\-*/<>~,;{}()\[\]#%^]) */g, '$1');
  safe_code = safe_code.replace(/ *(\.\.\.?) */g, '$1');

  // Phase 5: Re-insert required spaces around keywords
  const KW = 'local|function|return|if|then|else|elseif|end|do|while|repeat|until|for|in|and|or|not|break|continue|goto';
  safe_code = safe_code.replace(new RegExp('\\b(' + KW + ')([a-zA-Z0-9_])', 'g'), '$1 $2');
  safe_code = safe_code.replace(new RegExp('([a-zA-Z0-9_])(' + KW + ')\\b', 'g'), '$1 $2');

  // Phase 6: Use semicolons after end where beneficial
  safe_code = safe_code.replace(/ ?(end) /g, '$1;');

  // Phase 7: Trim
  safe_code = safe_code.trim();

  // Phase 8: Restore protected strings
  safe_code = safe_code.replace(/\x00S(\d+)\x00/g, (_, i) => slots[+i]);

  return safe_code;
}

function charCodeStrings(code) {
  const zones = buildSkipZones(code);
  let any = false;
  const result = code.replace(/"([^"\\\n]|\\.)*"|'([^'\\\n]|\\.)*'/g, (match, _d, _s, offset) => {
    if (inZone(zones, offset)) return match;
    const inner = match.slice(1, -1);
    if (inner.length < 2 || inner.length > 12) return match;
    let real;
    try {
      real = inner
        .replace(/\\n/g,'\n').replace(/\\t/g,'\t')
        .replace(/\\\\/g,'\\').replace(/\\"/g,'"').replace(/\\'/g,"'");
    } catch { return match; }
    const bytes = Array.from(Buffer.from(real, 'utf-8'));
    if (!bytes.length || bytes.some(b => b > 126)) return match;
    any = true;
    return `string.char(${bytes.join(',')})`;
  });
  return any ? result : code;
}

const LUA_KW = new Set([
  'and','break','do','else','elseif','end','false','for',
  'function','goto','if','in','local','nil','not','or',
  'repeat','return','then','true','until','while',
]);

function tokenizeAndRename(code, map) {
  const out = []; let i = 0; const n = code.length;
  while (i < n) {
    if (code[i] === '-' && code[i+1] === '-') {
      const after = code.slice(i+2); const lc = after.match(/^\[=*\[/);
      if (lc) {
        const lv = lc[0].length - 2, cl = ']' + '='.repeat(lv) + ']';
        const end = code.indexOf(cl, i + 2 + lc[0].length);
        if (end !== -1) { out.push(code.slice(i, end + cl.length)); i = end + cl.length; continue; }
      }
      const nl = code.indexOf('\n', i);
      if (nl === -1) { out.push(code.slice(i)); i = n; } else { out.push(code.slice(i, nl)); i = nl; }
      continue;
    }
    if (code[i] === '[') {
      const ls = code.slice(i).match(/^\[=*\[/);
      if (ls) {
        const lv = ls[0].length - 2, cl = ']' + '='.repeat(lv) + ']';
        const end = code.indexOf(cl, i + ls[0].length);
        if (end !== -1) { out.push(code.slice(i, end + cl.length)); i = end + cl.length; continue; }
      }
    }
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i]; let j = i + 1;
      while (j < n) { if (code[j] === '\\') { j += 2; continue; } if (code[j] === q) { j++; break; } j++; }
      out.push(code.slice(i, j)); i = j; continue;
    }
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i + 1;
      while (j < n && /[a-zA-Z0-9_]/.test(code[j])) j++;
      const w = code.slice(i, j);
      const prevCh  = i > 0 ? code[i-1] : '';
      const isField = prevCh === '.' || prevCh === ':';
      out.push((!isField && map.has(w)) ? map.get(w) : w);
      i = j; continue;
    }
    out.push(code[i]); i++;
  }
  return out.join('');
}

// Generate confusing homoglyph-style variable names
function confusingName(len) {
  // Mix of visually similar chars: l, I, 1, O, 0 with underscores
  const confusers = 'lIi1';
  const allChars = 'lIi1O0_';
  // Start with _ and a letter
  let name = '_';
  // First char must be alpha
  name += confusers[Math.floor(Math.random() * confusers.length)];
  for (let i = 0; i < len; i++) {
    name += allChars[Math.floor(Math.random() * allChars.length)];
  }
  // Add a random suffix to ensure uniqueness
  name += '_' + randomName(3);
  return name;
}

function renameLocals(code) {
  const decl = new Set(), zones = buildSkipZones(code);
  let m;
  const localRe = /\blocal\s+(?:function\s+)?([a-zA-Z_][a-zA-Z0-9_]*(?:\s*,\s*[a-zA-Z_][a-zA-Z0-9_]*)*)/g;
  while ((m = localRe.exec(code)) !== null) {
    if (inZone(zones, m.index)) continue;
    for (const raw of m[1].split(',')) { const nm = raw.trim(); if (nm && !LUA_KW.has(nm)) decl.add(nm); }
  }
  const funcRe = /\bfunction\s*[^(]*\(([^)]*)\)/g;
  while ((m = funcRe.exec(code)) !== null) {
    if (inZone(zones, m.index)) continue;
    for (const raw of m[1].split(',')) { const nm = raw.trim(); if (nm && nm !== '...' && !LUA_KW.has(nm)) decl.add(nm); }
  }
  const forRe = /\bfor\s+([a-zA-Z_][a-zA-Z0-9_]*(?:\s*,\s*[a-zA-Z_][a-zA-Z0-9_]*)*)\s*[=,]/g;
  while ((m = forRe.exec(code)) !== null) {
    if (inZone(zones, m.index)) continue;
    for (const raw of m[1].split(',')) { const nm = raw.trim(); if (nm && !LUA_KW.has(nm)) decl.add(nm); }
  }
  if (!decl.size) return code;
  const map = new Map();
  // Use confusing homoglyph names ~60% of the time, random names otherwise
  for (const nm of decl) {
    map.set(nm, randInt(0, 4) < 3 ? confusingName(randInt(8, 16)) : randomName(12));
  }
  return tokenizeAndRename(code, map);
}

function herculesWrap(code) {
  const N = () => randomName(8);
  const sc = (s) => `string.char(${Array.from(s).map(c => c.charCodeAt(0)).join(',')})`;

  const globals = [
    'ipairs','pairs','tonumber','tostring','type','math','string',
    'table','pcall','xpcall','select','rawget','rawset','rawequal',
    'setmetatable','getmetatable','coroutine','bit32','typeof',
    'error','assert','next','rawlen','unpack','load',
  ];
  const aliases = globals.map(() => randomName(12));
  const lhs = aliases.join(','), rhs = globals.join(',');

  // Variable names for Hercules anti-tamper system
  const [vD,vT,vP,vX,vS,vE,vR,vPa,vGM,vSM,vRG,vRS,vRE] =
    Array.from({ length: 13 }, () => N());
  const [vKilled,vReason,vKillFn,vTrapCo] = [N(),N(),N(),N()];
  const [vDbgOk,vIsNative,vCheckNative,vIsMinified,vScanUp,vScanLocals,vCheckGlobals,vRunCheck] =
    Array.from({ length: 8 }, () => N());

  // Fake script variable names
  const [vFakeGui,vFakeFrame,vFakeBtn,vFakeLabel] = Array.from({ length: 4 }, () => N());

  // Environment isolation junk
  const checkVar = randomName(7);
  const jv = Array.from({ length: 4 }, () => randomName(6));

  // Build the Hercules-style anti-tamper block
  const antiTamper = [
    // --- Hercules Anti-Tamper: Debug library completeness ---
    `local ${vD}=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('debug')}) or debug`,
    `local ${vT}=type`,
    `local ${vP}=pcall`,
    `local ${vE}=error`,
    `local ${vPa}=pairs`,
    `local ${vRG}=rawget`,
    `local ${vRS}=rawset`,
    `local ${vRE}=rawequal`,
    `local ${vGM}=getmetatable`,
    `local ${vSM}=setmetatable`,
    `local ${vKilled}=false`,
    `local ${vReason}=""`,
    '',
    // --- Hercules: Debug library integrity check ---
    `local function ${vDbgOk}()`,
    ` if ${vT}(${vD})~="table" then return false end`,
    ` for _,k in ${vPa}({"getinfo","getlocal","getupvalue","traceback","sethook","setupvalue"}) do`,
    `  if ${vT}(${vD}[k])~="function" then return false end`,
    ` end`,
    ` return true`,
    `end`,
    `if not ${vDbgOk}() then ${vKilled}=true;${vReason}=${sc('debug_incomplete')} end`,
    '',
    // --- Hercules: Native function checker ---
    `local function ${vIsNative}(f)`,
    ` local i=${vD}.getinfo(f)`,
    ` return i and i.what=="C"`,
    `end`,
    '',
    // --- Hercules: Check native functions haven't been replaced ---
    `local function ${vCheckNative}()`,
    ` local natives={`,
    `  ${vP},xpcall,assert,${vE},print,${vRG},${vRS},${vRE},tonumber,tostring,${vT},`,
    `  select,next,ipairs,${vPa},collectgarbage,${vGM},${vSM},`,
    `  load,loadstring,loadfile`,
    ` }`,
    ` local mts={string,table,math,os,_G}`,
    ` for _,t in ${vPa}(mts) do`,
    `  local mt=${vGM}(t)`,
    `  if mt then`,
    `   for _,m in ${vPa}({"__index","__newindex","__call","__metatable"}) do`,
    `    local mf=mt[m]`,
    `    if mf and ${vT}(mf)=="function" and not ${vIsNative}(mf) then`,
    `     return false,${sc('metamethod_tampered')}`,
    `    end`,
    `   end`,
    `  end`,
    ` end`,
    ` for _,fn in ${vPa}(natives) do`,
    `  if ${vT}(fn)=="function" and not ${vIsNative}(fn) then`,
    `   return false,${sc('native_replaced')}`,
    `  end`,
    ` end`,
    ` return true`,
    `end`,
    '',
    // --- Hercules: Minification check (beautified code detector) ---
    `local function ${vIsMinified}(f)`,
    ` local i=${vD}.getinfo(f,"Sl")`,
    ` return i and i.linedefined==i.lastlinedefined`,
    `end`,
    '',
    // --- Hercules: Upvalue scanner ---
    `local function ${vScanUp}(f)`,
    ` local i=1`,
    ` while true do`,
    `  local n,v=${vD}.getupvalue(f,i)`,
    `  if not n then break end`,
    `  if ${vT}(v)=="function" and not ${vIsMinified}(v) then return false,${sc('suspicious_upvalue')} end`,
    `  i=i+1`,
    ` end`,
    ` return true`,
    `end`,
    '',
    // --- Hercules: Local variable scanner ---
    `local function ${vScanLocals}(l)`,
    ` local i=1`,
    ` while true do`,
    `  local n,v=${vD}.getlocal(l,i)`,
    `  if not n then break end`,
    `  if ${vT}(v)=="function" and not ${vIsMinified}(v) then return false,${sc('suspicious_local')} end`,
    `  i=i+1`,
    ` end`,
    ` return true`,
    `end`,
    '',
    // --- Hercules: Global integrity check ---
    `local function ${vCheckGlobals}()`,
    ` local essentials={"pcall","xpcall","type","tostring","string","table","debug","coroutine","math"}`,
    ` for _,k in ${vPa}(essentials) do`,
    `  if ${vT}(_G[k])~=${vT}(rawget((type(getfenv)=="function" and getfenv(0) or _G),k)) then`,
    `   return false,${sc('global_modified')}`,
    `  end`,
    ` end`,
    ` return true`,
    `end`,
    '',
    // --- Hercules: Run all checks ---
    `local function ${vRunCheck}()`,
    ` local ok,r=${vCheckNative}()`,
    ` if not ok then return false,r end`,
    ` ok,r=${vCheckGlobals}()`,
    ` if not ok then return false,r end`,
    ` for l=2,4 do`,
    `  local i=${vD}.getinfo(l,"f")`,
    `  if i and i.func then`,
    `   ok,r=${vScanUp}(i.func)`,
    `   if not ok then return false,r end`,
    `  end`,
    `  ok,r=${vScanLocals}(l)`,
    `  if not ok then return false,r end`,
    ` end`,
    ` return true`,
    `end`,
    '',
    `${vP}(function()`,
    ` local ok,r=${vRunCheck}()`,
    ` if not ok then ${vKilled}=true;${vReason}=tostring(r) end`,
    `end)`,
  ].join('\n');

  // The fake GUI script that replaces real code when tamper is detected
  const fakeScript = [
    `-- Goosefuscator Output`,
    `local ${vFakeGui}=Instance.new(${sc('ScreenGui')})`,
    `${vFakeGui}.Name=${sc('GooseOutput')}`,
    `${vFakeGui}.Parent=game:GetService(${sc('Players')}).LocalPlayer:WaitForChild(${sc('PlayerGui')})`,
    `local ${vFakeFrame}=Instance.new(${sc('Frame')},${vFakeGui})`,
    `${vFakeFrame}.Size=UDim2.new(0.3,0,0.15,0)`,
    `${vFakeFrame}.Position=UDim2.new(0.35,0,0.4,0)`,
    `${vFakeFrame}.BackgroundColor3=Color3.fromRGB(35,35,35)`,
    `local ${vFakeLabel}=Instance.new(${sc('TextLabel')},${vFakeFrame})`,
    `${vFakeLabel}.Size=UDim2.new(1,0,0.6,0)`,
    `${vFakeLabel}.Text=${sc('hello')}`,
    `${vFakeLabel}.TextColor3=Color3.fromRGB(255,255,255)`,
    `${vFakeLabel}.BackgroundTransparency=1`,
    `${vFakeLabel}.TextSize=24`,
    `local ${vFakeBtn}=Instance.new(${sc('TextButton')},${vFakeFrame})`,
    `${vFakeBtn}.Size=UDim2.new(0.5,0,0.35,0)`,
    `${vFakeBtn}.Position=UDim2.new(0.25,0,0.6,0)`,
    `${vFakeBtn}.Text=${sc('Click')}`,
    `${vFakeBtn}.BackgroundColor3=Color3.fromRGB(60,60,60)`,
    `${vFakeBtn}.TextColor3=Color3.fromRGB(200,200,200)`,
    `print(${sc('hello')})`,
  ].join('\n');

  // Secondary trap — if they somehow bypass the fake script layer
  const secondaryTrap = `print(${sc('stop')})`;

  return [
    `return (function(...)`,
    ` local ${lhs}`,
    ` ${lhs}=${rhs}`,
    // Junk dead code blocks to confuse static analysis
    ` ${opaqueFalse()}`,
    `  local ${jv[0]}=bit32.bxor(${randInt(1,0xFFFF)},${randInt(1,0xFFFF)})`,
    `  local ${jv[1]}=setmetatable({},{__index=function(_,k) return rawget((type(getfenv)=="function" and getfenv(0) or _G),k) end})`,
    `  local ${jv[2]}=coroutine.wrap(function() coroutine.yield(${randInt(1,9999)}) end)`,
    `  local ${jv[3]}=string.char(${randInt(65,90)},${randInt(65,90)},${randInt(65,90)})`,
    ` end`,
    // Integrity check — verify globals weren't swapped
    ` do`,
    `  local ${checkVar}=tostring`,
    `  if type(${checkVar})~="function" then while true do end end`,
    ` end`,
    '',
    // === HERCULES ANTI-TAMPER SYSTEM ===
    antiTamper,
    '',
    // === ANTI-TAMPER FAKE SCRIPT DECOY ===
    `if ${vKilled} then`,
    // When tamper is detected, send the fake GUI script instead of the real code
    fakeScript,
    // Secondary bypass trap
    ` do`,
    `  local ${N()}=${vP}(function()`,
    `   local ${N()}=${vD} and ${vD}.sethook`,
    `   if ${vT}(${N()})=="function" then`,
    `    ${secondaryTrap}`,
    `    return`,
    `   end`,
    `  end)`,
    `  ${secondaryTrap}`,
    ` end`,
    ` return`,
    `end`,
    '',
    // === REAL CODE (only runs if anti-tamper passes) ===
    code,
    `end)(...)`,
  ].join('\n');
}

// Anti-tamper fake script wrapper — wraps code with integrity verification
// that sends a fake GUI + print("hello") script when deobfuscation is detected,
// and print("stop") when someone tries to bypass the anti-tamper layer
function antiTamperFakeScript(code) {
  const N = () => randomName(8);
  const sc = (s) => `string.char(${Array.from(s).map(c => c.charCodeAt(0)).join(',')})`;

  const [vHash,vCheck,vExpected,vSrc,vChunk] = Array.from({ length: 5 }, () => N());
  const [vFakeGui2,vFakeFrame2,vFakeLabel2] = Array.from({ length: 3 }, () => N());

  // Compute a simple checksum seed from the code length
  const codeLenHash = (code.length * 31 + 7) & 0xFFFF;
  const xorKey = randInt(1, 0xFFFF);
  const expectedVal = codeLenHash ^ xorKey;

  // Fake script that looks real but is a decoy
  const fakeOutput = [
    `local ${vFakeGui2}=Instance.new(${sc('ScreenGui')})`,
    `${vFakeGui2}.Name=${sc('Output')}`,
    `pcall(function() ${vFakeGui2}.Parent=game:GetService(${sc('Players')}).LocalPlayer:WaitForChild(${sc('PlayerGui')}) end)`,
    `local ${vFakeFrame2}=Instance.new(${sc('Frame')},${vFakeGui2})`,
    `${vFakeFrame2}.Size=UDim2.new(0.4,0,0.2,0)`,
    `${vFakeFrame2}.Position=UDim2.new(0.3,0,0.4,0)`,
    `${vFakeFrame2}.BackgroundColor3=Color3.fromRGB(40,40,40)`,
    `local ${vFakeLabel2}=Instance.new(${sc('TextLabel')},${vFakeFrame2})`,
    `${vFakeLabel2}.Size=UDim2.new(1,0,1,0)`,
    `${vFakeLabel2}.Text=${sc('hello')}`,
    `${vFakeLabel2}.TextColor3=Color3.fromRGB(255,255,255)`,
    `${vFakeLabel2}.BackgroundTransparency=1`,
    `${vFakeLabel2}.TextSize=28`,
    `print(${sc('hello')})`,
  ].join('\n');

  return [
    `do`,
    // Runtime code length verification
    ` local ${vHash}=${codeLenHash}`,
    ` local ${vExpected}=bit32.bxor(${expectedVal},${xorKey})`,
    ` local ${vCheck}=(${vHash}==${vExpected})`,
    '',
    // Decompile/dump tool intercept — replace with fake script
    ` pcall(function()`,
    `  local _dc=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('decompile')})`,
    `  if type(_dc)=="function" then`,
    `   rawset(_G,${sc('decompile')},function()`,
    `    return ${JSON.stringify(fakeOutput.replace(/\n/g, '\\n'))}`,
    `   end)`,
    `  end`,
    ` end)`,
    '',
    // getscriptbytecode intercept — return fake bytecode
    ` pcall(function()`,
    `  local _gsb=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getscriptbytecode')})`,
    `  if type(_gsb)=="function" then`,
    `   rawset(_G,${sc('getscriptbytecode')},function()`,
    `    return ${sc('print("hello")')}`,
    `   end)`,
    `  end`,
    ` end)`,
    '',
    // dumpstring intercept — return fake dump
    ` pcall(function()`,
    `  local _ds=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('dumpstring')})`,
    `  if type(_ds)=="function" then`,
    `   rawset(_G,${sc('dumpstring')},function()`,
    `    return ${sc('print("hello")')}`,
    `   end)`,
    `  end`,
    ` end)`,
    '',
    // getscriptclosure intercept — return fake closure
    ` pcall(function()`,
    `  local _gsc=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getscriptclosure')})`,
    `  if type(_gsc)=="function" then`,
    `   rawset(_G,${sc('getscriptclosure')},function()`,
    `    return function() print(${sc('hello')}) end`,
    `   end)`,
    `  end`,
    ` end)`,
    '',
    // getconstants intercept — return fake constants
    ` pcall(function()`,
    `  local _gc=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getconstants')})`,
    `  if type(_gc)=="function" then`,
    `   rawset(_G,${sc('getconstants')},function()`,
    `    return {${sc('print')},${sc('hello')},${sc('stop')}}`,
    `   end)`,
    `  end`,
    ` end)`,
    '',
    // getupvalues intercept — return fake upvalues
    ` pcall(function()`,
    `  local _gu=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getupvalues')})`,
    `  if type(_gu)=="function" then`,
    `   rawset(_G,${sc('getupvalues')},function()`,
    `    return {}`,
    `   end)`,
    `  end`,
    ` end)`,
    '',
    // getprotos intercept — return fake protos
    ` pcall(function()`,
    `  local _gp=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getprotos')})`,
    `  if type(_gp)=="function" then`,
    `   rawset(_G,${sc('getprotos')},function()`,
    `    return {function() print(${sc('stop')}) end}`,
    `   end)`,
    `  end`,
    ` end)`,
    '',
    // string.dump intercept
    ` pcall(function()`,
    `  if rawget(string,${sc('dump')}) then`,
    `   rawset(string,${sc('dump')},function()`,
    `    print(${sc('stop')})`,
    `    return ${sc('print("stop")')}`,
    `   end)`,
    `  end`,
    ` end)`,
    '',
    // Debug info poisoning — make debug tools see fake info
    ` pcall(function()`,
    `  local _dbg=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('debug')}) or debug`,
    `  if not _dbg then return end`,
    `  if _dbg.getinfo then`,
    `   local _ogi=_dbg.getinfo`,
    `   rawset(_dbg,${sc('getinfo')},function(...)`,
    `    local _ok,_r=pcall(_ogi,...)`,
    `    if _ok and _r then`,
    `     _r.source=${sc('[C]')}`,
    `     _r.short_src=${sc('[C]')}`,
    `     _r.name=nil`,
    `    end`,
    `    return _r`,
    `   end)`,
    `  end`,
    ` end)`,
    '',
    // If verification fails, run the fake script
    ` if not ${vCheck} then`,
    `  ${fakeOutput}`,
    `  print(${sc('stop')})`,
    `  return`,
    ` end`,
    '',
    code,
    `end`,
  ].join('\n');
}


// ── Second-pass string cipher (Feistel-like rolling cipher) ───────
// Applied as an independent second layer after encryptStrings.
// Uses a different algorithm (4-byte rolling key, no S-box) so the
// two encryption layers are independent — breaking one doesn't help
// with the other.
function encryptStrings2(code) {
  const bxN = randomName(7);
  const decN = randomName(7);

  const header = [
    bxorSnippet(bxN),
    `local ${decN}=function(b,k)`,
    ` local _o={}`,
    ` local _a,_b,_c,_d=k[1],k[2],k[3],k[4]`,
    ` for _i=1,#b do`,
    `  local _ki=((_i-1)%4)+1`,
    `  local _kv=({_a,_b,_c,_d})[_ki]`,
    `  local _r=${bxN}(b[_i],${bxN}(_kv,(_i-1)%256))`,
    `  _r=${bxN}(_r,math.floor(_kv/2)%256)`,
    `  _o[_i]=string.char(_r)`,
    `  _a=${bxN}(_a,_r);_b=${bxN}(_b,_r*3%256);_c=${bxN}(_c,_r*7%256);_d=${bxN}(_d,_r*13%256)`,
    ` end`,
    ` return table.concat(_o)`,
    `end`,
  ].join('\n');

  const zones = buildSkipZones(code);
  let any = false;

  const result = code.replace(/"([^"\\n]|\\.)*"|'([^'\\n]|\\.)*'/g, (match, _d, _s, offset) => {
    if (inZone(zones, offset)) return match;
    const inner = match.slice(1, -1);
    if (inner.length < 2) return match;
    let real;
    try {
      real = inner
        .replace(/\\n/g,'\n').replace(/\\t/g,'\t').replace(/\\r/g,'\r')
        .replace(/\\\\/g,'\\').replace(/\\"/g,'"').replace(/\\'/g,"'")
        .replace(/\\(\d{1,3})/g,(_,n)=>String.fromCharCode(+n));
    } catch { return match; }

    const bytes = Array.from(Buffer.from(real, 'utf-8'));
    if (!bytes.length) return match;

    const k = Array.from({ length: 4 }, () => randInt(1, 254));
    let ka = k[0], kb = k[1], kc = k[2], kd = k[3];

    const enc = bytes.map((b, i) => {
      const kv = [ka, kb, kc, kd][i % 4];
      let e = (b ^ (kv ^ (i & 0xFF))) & 0xFF;
      e = (e ^ Math.floor(kv / 2)) & 0xFF;
      ka = (ka ^ e) & 0xFF;
      kb = (kb ^ (e * 3)) & 0xFF;
      kc = (kc ^ (e * 7)) & 0xFF;
      kd = (kd ^ (e * 13)) & 0xFF;
      return e;
    });

    any = true;
    return `${decN}({${enc.join(',')}},{${k.join(',')}})`;
  });

  return any ? (header + '\n' + result) : code;
}

module.exports = {
  encryptStrings, encryptStrings2, encodeNumbers, constantArray,
  flattenControlFlow, injectJunk, proxyGlobals,
  antiDecompilePoison, renameLocals, opaqueWrap,
  herculesWrap, upvalueChain, charCodeStrings,
  stringSplit, minifyWhitespace, antiTamperFakeScript,
};

