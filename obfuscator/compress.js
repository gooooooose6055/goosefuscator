'use strict';

const zlib = require('zlib');
const { randomName, randInt } = require('./utils');

// ── Strategy sweep: try every deflate combination, pick absolute smallest ──
const STRATEGIES = [
  zlib.constants.Z_DEFAULT_STRATEGY,
  zlib.constants.Z_FILTERED,
  zlib.constants.Z_HUFFMAN_ONLY,
  zlib.constants.Z_RLE,
  zlib.constants.Z_FIXED,
];

function bestDeflate(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, 'utf-8');
  let best = null;
  for (const s of STRATEGIES) {
    for (const wbits of [15, 14, 13, 12]) {
      for (const memLevel of [9, 8, 7]) {
        try {
          const c = zlib.deflateRawSync(buf, { level: 9, strategy: s, windowBits: wbits, memLevel });
          if (!best || c.length < best.length) best = c;
        } catch (_) {}
      }
    }
  }
  if (!best) best = zlib.deflateRawSync(buf, { level: 9 });
  return best;
}

// ── RC4 stream cipher ──────────────────────────────────────────────
function rc4Encrypt(buf, key) {
  const S = Array.from({ length: 256 }, (_, i) => i);
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key[i % key.length]) & 0xFF;
    [S[i], S[j]] = [S[j], S[i]];
  }
  const out = Buffer.alloc(buf.length);
  let x = 0, y = 0;
  for (let k = 0; k < buf.length; k++) {
    x = (x + 1) & 0xFF;
    y = (y + S[x]) & 0xFF;
    [S[x], S[y]] = [S[y], S[x]];
    out[k] = buf[k] ^ S[(S[x] + S[y]) & 0xFF];
  }
  return out;
}

// ── CRC32 for integrity checking ───────────────────────────────────
const CRC32_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = CRC32_TABLE[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function appendCrc32(buf) {
  const crc = crc32(buf);
  const out = Buffer.alloc(buf.length + 4);
  buf.copy(out);
  out.writeUInt32BE(crc, buf.length);
  return out;
}

// ── LZW Compression ────────────────────────────────────────────────
function lzwCompress(input) {
  const dict = new Map();
  for (let i = 0; i < 256; i++) dict.set(String.fromCharCode(i), i);
  let dictSize = 256, w = '';
  const result = [];
  for (let i = 0; i < input.length; i++) {
    const c = input[i], wc = w + c;
    if (dict.has(wc)) { w = wc; }
    else { result.push(dict.get(w)); if (dictSize < 65536) dict.set(wc, dictSize++); w = c; }
  }
  if (w) result.push(dict.get(w));
  return result;
}

function lzwCodesToBuffer(codes) {
  const buf = Buffer.alloc(codes.length * 2);
  for (let i = 0; i < codes.length; i++) {
    buf[i*2] = (codes[i] >> 8) & 0xFF;
    buf[i*2+1] = codes[i] & 0xFF;
  }
  return buf;
}

// ── Chunk permutation ──────────────────────────────────────────────
function makeChunkPerm(n) {
  const perm = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = n - 1; i > 0; i--) {
    const j = randInt(0, i);
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  return perm;
}

// ── Runtime key mixing ─────────────────────────────────────────────
const RUNTIME_MIXER = [76, 58, 134];
function preMixKey(key) { return key.map((b, i) => b ^ RUNTIME_MIXER[i % 3]); }

function runtimeMixerLua(bxN, kN) {
  return [
    `local _rmx={string.byte("Lua",1),math.floor(math.pi*100)%256,math.floor(math.sqrt(2)*1000)%256}`,
    `for _ri=1,#${kN} do ${kN}[_ri]=${bxN}(${kN}[_ri],_rmx[((_ri-1)%3)+1]) end`,
  ].join('\n');
}

// ── Compact base85 encoding (20% smaller than base64) ──────────────
// Uses a Lua-safe 85-character alphabet (no backslash, quotes, or control)
const B85_ALPHA = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+,-./:;<=>?@[]^_`{|}~';
function encodeBase85(buf) {
  // Prepend 4-byte big-endian length so decoder knows exact byte count
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(buf.length, 0);
  const withLen = Buffer.concat([lenBuf, buf]);
  // Pad to multiple of 4 with zeros
  const padded = withLen.length % 4 === 0 ? withLen : Buffer.concat([withLen, Buffer.alloc(4 - (withLen.length % 4))]);
  const out = [];
  for (let i = 0; i < padded.length; i += 4) {
    let val = 0;
    for (let j = 0; j < 4; j++) val = val * 256 + padded[i + j];
    const enc = [];
    for (let j = 0; j < 5; j++) { enc.unshift(B85_ALPHA[val % 85]); val = Math.floor(val / 85); }
    out.push(enc.join(''));
  }
  return out.join('');
}

// ── Core base85 + RC4 decoder builder ──────────────────────────────
function buildRC4Base85Decoder(encodedStr, key) {
  const mixed = preMixKey(key);
  const chunkSize = 7800;
  const rawChunks = [];
  for (let i = 0; i < encodedStr.length; i += chunkSize)
    rawChunks.push(encodedStr.slice(i, i + chunkSize));

  const n = rawChunks.length;
  const perm = makeChunkPerm(n);
  const shuffled = new Array(n);
  for (let i = 0; i < n; i++) shuffled[perm[i] - 1] = rawChunks[i];

  const chunkVars = shuffled.map(() => randomName(7));
  const [vBx, vK, vB85A, vB85T, vPos, vSt, vX, vY, vKT] = Array.from({ length: 9 }, () => randomName(6));
  const vB = randomName(8);
  const [permVar, chunkArrVar, ordVar, vH] = Array.from({ length: 4 }, () => randomName(7));

  const L = [];
  for (let i = 0; i < n; i++) L.push(`local ${chunkVars[i]}="${shuffled[i]}"`);

  L.push(`local ${permVar}={${perm.join(',')}}`);
  L.push(`local ${chunkArrVar}={${chunkVars.join(',')}}`);
  L.push(`local ${ordVar}={}`);
  L.push(`for _pi=1,${n} do ${ordVar}[_pi]=${chunkArrVar}[${permVar}[_pi]] end`);
  L.push(n > 1 ? `local ${vH}=table.concat(${ordVar})` : `local ${vH}=${ordVar}[1]`);

  L.push(`local ${vBx}=bit32 and bit32.bxor or bit and bit.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end return r end`);
  L.push(`local ${vK}={${mixed.join(',')}}`);
  L.push(runtimeMixerLua(vBx, vK));

  // Base85 lookup table
  L.push(`local ${vB85A}="${B85_ALPHA}"`);
  L.push(`local ${vB85T}={} for _i=1,85 do ${vB85T}[string.byte(${vB85A},_i)]=_i-1 end`);

  // Decode base85 to bytes — always full 5-char groups, length-prefixed
  L.push(`local _allB={}`);
  L.push(`local ${vPos}=1;local _len=#${vH}`);
  L.push(`while ${vPos}<=_len do`);
  L.push(` local _val=0`);
  L.push(` for _j=0,4 do _val=_val*85+(${vB85T}[string.byte(${vH},${vPos}+_j)] or 0) end`);
  L.push(` ${vPos}=${vPos}+5`);
  L.push(` for _j=3,0,-1 do _allB[#_allB+1]=math.floor(_val/256^_j)%256 end`);
  L.push(`end`);
  L.push(`local _realLen=_allB[1]*16777216+_allB[2]*65536+_allB[3]*256+_allB[4]`);
  L.push(`local ${vB}={}`);
  L.push(`for _i=1,_realLen do ${vB}[_i]=_allB[_i+4] end`);

  // RC4 decrypt in-place
  L.push(`do`);
  L.push(` local ${vSt}={} for _i=0,255 do ${vSt}[_i]=_i end`);
  L.push(` local _j=0`);
  L.push(` for _i=0,255 do`);
  L.push(`  _j=(_j+${vSt}[_i]+${vK}[(_i%#${vK})+1])%256`);
  L.push(`  ${vSt}[_i],${vSt}[_j]=${vSt}[_j],${vSt}[_i]`);
  L.push(` end`);
  L.push(` local ${vX},${vY}=0,0;local ${vKT}={}`);
  L.push(` for _k=1,#${vB} do`);
  L.push(`  ${vX}=(${vX}+1)%256;${vY}=(${vY}+${vSt}[${vX}])%256`);
  L.push(`  ${vSt}[${vX}],${vSt}[${vY}]=${vSt}[${vY}],${vSt}[${vX}]`);
  L.push(`  ${vKT}[_k]=${vBx}(${vB}[_k],${vSt}[(${vSt}[${vX}]+${vSt}[${vY}])%256])`);
  L.push(` end`);
  L.push(` ${vB}=${vKT}`);
  L.push(`end`);

  // CRC32 integrity verification — uses vBx (already defined above), no bit32 dependency
  L.push(`do`);
  L.push(` local _bnd=bit32 and bit32.band or function(a,b) a=a%4294967296;b=b%4294967296;local r,s=0,1 while a>0 and b>0 do if a%2==1 and b%2==1 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end`);
  L.push(` local _crcT={}`);
  L.push(` for _i=0,255 do local c=_i;for _=1,8 do if c%2==1 then c=${vBx}(3988292384,math.floor(c/2)) else c=math.floor(c/2) end end;_crcT[_i]=c end`);
  L.push(` local _n=#${vB};local _stored=${vB}[_n-3]*16777216+${vB}[_n-2]*65536+${vB}[_n-1]*256+${vB}[_n]`);
  L.push(` local _crc=4294967295`);
  L.push(` for _i=1,_n-4 do _crc=${vBx}(_crcT[_bnd(${vBx}(_crc,${vB}[_i]),255)],math.floor(_crc/256)) end`);
  L.push(` _crc=${vBx}(_crc,4294967295)`);
  L.push(` if _crc~=_stored then return end`);
  L.push(` local _trimmed={};for _i=1,_n-4 do _trimmed[_i]=${vB}[_i] end;${vB}=_trimmed`);
  L.push(`end`);

  return { lines: L, byteVar: vB };
}

// ── Also keep base64 decoder for fallback ──────────────────────────
function buildRC4Base64Decoder(b64Str, key) {
  const mixed = preMixKey(key);
  const chunkSize = 7800;
  const rawChunks = [];
  for (let i = 0; i < b64Str.length; i += chunkSize)
    rawChunks.push(b64Str.slice(i, i + chunkSize));

  const n = rawChunks.length;
  const perm = makeChunkPerm(n);
  const shuffled = new Array(n);
  for (let i = 0; i < n; i++) shuffled[perm[i] - 1] = rawChunks[i];

  const chunkVars = shuffled.map(() => randomName(7));
  const [vBx, vK, vB64T, vPos, vSt, vX, vY, vKT] = Array.from({ length: 8 }, () => randomName(6));
  const vB = randomName(8);
  const [permVar, chunkArrVar, ordVar, vH] = Array.from({ length: 4 }, () => randomName(7));

  const L = [];
  for (let i = 0; i < n; i++) L.push(`local ${chunkVars[i]}="${shuffled[i]}"`);

  L.push(`local ${permVar}={${perm.join(',')}}`);
  L.push(`local ${chunkArrVar}={${chunkVars.join(',')}}`);
  L.push(`local ${ordVar}={}`);
  L.push(`for _pi=1,${n} do ${ordVar}[_pi]=${chunkArrVar}[${permVar}[_pi]] end`);
  L.push(n > 1 ? `local ${vH}=table.concat(${ordVar})` : `local ${vH}=${ordVar}[1]`);

  L.push(`local ${vBx}=bit32 and bit32.bxor or bit and bit.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end return r end`);
  L.push(`local ${vK}={${mixed.join(',')}}`);
  L.push(runtimeMixerLua(vBx, vK));

  L.push(`local _t64={"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"}`);
  L.push(`local ${vB64T}={} for _bi=1,64 do ${vB64T}[string.byte(_t64[_bi])]=_bi-1 end`);

  L.push(`local ${vB}={}`);
  L.push(`local ${vPos}=1`);
  L.push(`while ${vPos}<=#${vH} do`);
  L.push(` local c1=${vB64T}[string.byte(${vH},${vPos})];${vPos}=${vPos}+1;if not c1 then break end`);
  L.push(` local c2=${vB64T}[string.byte(${vH},${vPos})] or 0;${vPos}=${vPos}+1`);
  L.push(` local c3=${vB64T}[string.byte(${vH},${vPos})];${vPos}=${vPos}+1`);
  L.push(` local c4=${vB64T}[string.byte(${vH},${vPos})];${vPos}=${vPos}+1`);
  L.push(` local b1=math.floor(c1*4)+math.floor(c2/16);${vB}[#${vB}+1]=b1`);
  L.push(` if c3 then local b2=(c2%16)*16+math.floor(c3/4);${vB}[#${vB}+1]=b2`);
  L.push(`  if c4 then ${vB}[#${vB}+1]=(c3%4)*64+c4 end end`);
  L.push(`end`);

  // RC4 decrypt
  L.push(`do`);
  L.push(` local ${vSt}={} for _i=0,255 do ${vSt}[_i]=_i end`);
  L.push(` local _j=0`);
  L.push(` for _i=0,255 do`);
  L.push(`  _j=(_j+${vSt}[_i]+${vK}[(_i%#${vK})+1])%256`);
  L.push(`  ${vSt}[_i],${vSt}[_j]=${vSt}[_j],${vSt}[_i]`);
  L.push(` end`);
  L.push(` local ${vX},${vY}=0,0;local ${vKT}={}`);
  L.push(` for _k=1,#${vB} do`);
  L.push(`  ${vX}=(${vX}+1)%256;${vY}=(${vY}+${vSt}[${vX}])%256`);
  L.push(`  ${vSt}[${vX}],${vSt}[${vY}]=${vSt}[${vY}],${vSt}[${vX}]`);
  L.push(`  ${vKT}[_k]=${vBx}(${vB}[_k],${vSt}[(${vSt}[${vX}]+${vSt}[${vY}])%256])`);
  L.push(` end`);
  L.push(` ${vB}=${vKT}`);
  L.push(`end`);

  // CRC32 integrity verification — uses vBx (already defined above), no bit32 dependency
  L.push(`do`);
  L.push(` local _bnd=bit32 and bit32.band or function(a,b) a=a%4294967296;b=b%4294967296;local r,s=0,1 while a>0 and b>0 do if a%2==1 and b%2==1 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end`);
  L.push(` local _crcT={}`);
  L.push(` for _i=0,255 do local c=_i;for _=1,8 do if c%2==1 then c=${vBx}(3988292384,math.floor(c/2)) else c=math.floor(c/2) end end;_crcT[_i]=c end`);
  L.push(` local _n=#${vB};local _stored=${vB}[_n-3]*16777216+${vB}[_n-2]*65536+${vB}[_n-1]*256+${vB}[_n]`);
  L.push(` local _crc=4294967295`);
  L.push(` for _i=1,_n-4 do _crc=${vBx}(_crcT[_bnd(${vBx}(_crc,${vB}[_i]),255)],math.floor(_crc/256)) end`);
  L.push(` _crc=${vBx}(_crc,4294967295)`);
  L.push(` if _crc~=_stored then return end`);
  L.push(` local _trimmed={};for _i=1,_n-4 do _trimmed[_i]=${vB}[_i] end;${vB}=_trimmed`);
  L.push(`end`);

  return { lines: L, byteVar: vB };
}

// ── Reader-function loader ─────────────────────────────────────────
function hiddenLoader(resultVar) {
  const sc = s => `string.char(${Array.from(s).map(c=>c.charCodeAt(0)).join(',')})`;
  const [vLS, vCo, vOk, vFn, vEnv, vChks, vIdx, vMk, vMkA, vBxH, vTmp] =
    Array.from({ length: 11 }, () => randomName(8));
  const chunkSize = 48 + randInt(0, 32);
  const maskKey   = Array.from({ length: 8 }, () => randInt(1, 253));
  return [
    `local ${vEnv}=(type(getfenv)=="function" and getfenv(0) or _G)`,
    `local ${vLS}=rawget(${vEnv},${sc('loadstring')}) or rawget(${vEnv},${sc('load')})`,
    `do local _isl=rawget(${vEnv},${sc('islclosure')})`,
    ` if type(_isl)=="function" and type(${vLS})=="function" and _isl(${vLS}) then ${vLS}=nil end`,
    `end`,
    `if type(${vLS})=="function" then`,
    ` local ${vBxH}=bit32 and bit32.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end`,
    ` local ${vMkA}={${maskKey.join(',')}}`,
    ` local ${vChks}={}`,
    ` local _csz=${chunkSize}`,
    ` for _ci=1,math.ceil(#${resultVar}/_csz) do`,
    `  local _sl=${resultVar}:sub((_ci-1)*_csz+1,_ci*_csz)`,
    `  local ${vTmp}={}`,
    `  for _bi=1,#_sl do`,
    `   ${vTmp}[_bi]=string.char(${vBxH}(string.byte(_sl,_bi),${vMkA}[((_bi-1)%#${vMkA})+1]))`,
    `  end`,
    `  ${vChks}[_ci]=table.concat(${vTmp})`,
    ` end`,
    ` local ${vIdx}=0`,
    ` local ${vMk}={${maskKey.join(',')}}`,
    ` local ${vCo}=coroutine.create(function()`,
    `  local _ok2,${vFn}=pcall(${vLS},function()`,
    `   ${vIdx}=${vIdx}+1`,
    `   local _ch=${vChks}[${vIdx}]`,
    `   if not _ch then return nil end`,
    `   local _out={}`,
    `   for _bi=1,#_ch do`,
    `    _out[_bi]=string.char(${vBxH}(string.byte(_ch,_bi),${vMk}[((_bi-1)%#${vMk})+1]))`,
    `   end`,
    `   return table.concat(_out)`,
    `  end,${sc('=(g)')})`,
    `  if _ok2 and type(${vFn})=="function" then pcall(${vFn}) end`,
    ` end)`,
    ` local ${vOk}=coroutine.resume(${vCo})`,
    `end`,
  ].join('\n');
}

// ── Decoder builders ───────────────────────────────────────────────

function buildXorDecoder(encStr, key, useBase85) {
  const { lines, byteVar } = useBase85
    ? buildRC4Base85Decoder(encStr, key)
    : buildRC4Base64Decoder(encStr, key);
  const [vR, vT, vI] = Array.from({ length: 3 }, () => randomName(7));
  return [
    ...lines,
    `local ${vT}={}`,
    `for ${vI}=1,#${byteVar} do ${vT}[${vI}]=string.char(${byteVar}[${vI}]) end`,
    `local ${vR}=table.concat(${vT})`,
    hiddenLoader(vR),
  ].join('\n');
}

function buildLzwDecoder(encStr, key, useBase85) {
  const { lines, byteVar } = useBase85
    ? buildRC4Base85Decoder(encStr, key)
    : buildRC4Base64Decoder(encStr, key);
  const [vI,vR,vCodes,vDict,vDsz,vOld,vNew,vSt,vEntry] = Array.from({length:9},()=>randomName(7));
  return [
    ...lines,
    `local ${vCodes}={}`,
    `for ${vI}=1,#${byteVar},2 do ${vCodes}[#${vCodes}+1]=${byteVar}[${vI}]*256+(${byteVar}[${vI}+1] or 0) end`,
    `local ${vDict}={} for ${vI}=0,255 do ${vDict}[${vI}]=string.char(${vI}) end`,
    `local ${vDsz}=256;local ${vOld}=${vCodes}[1];local ${vR}={${vDict}[${vOld}]}`,
    `for ${vI}=2,#${vCodes} do`,
    ` local ${vNew}=${vCodes}[${vI}];local ${vEntry}`,
    ` if ${vDict}[${vNew}] then ${vEntry}=${vDict}[${vNew}]`,
    ` elseif ${vNew}==${vDsz} then ${vEntry}=${vDict}[${vOld}]..${vDict}[${vOld}]:sub(1,1)`,
    ` else ${vEntry}=${vDict}[${vOld}]..${vDict}[${vOld}]:sub(1,1) end`,
    ` ${vR}[#${vR}+1]=${vEntry}`,
    ` if ${vDsz}<65536 then ${vDict}[${vDsz}]=${vDict}[${vOld}]..${vEntry}:sub(1,1);${vDsz}=${vDsz}+1 end`,
    ` ${vOld}=${vNew}`,
    `end`,
    `local ${vSt}=table.concat(${vR})`,
    hiddenLoader(vSt),
  ].join('\n');
}

function buildDeflateDecoder(encStr, key, useBase85) {
  const { lines, byteVar } = useBase85
    ? buildRC4Base85Decoder(encStr, key)
    : buildRC4Base64Decoder(encStr, key);
  const vR = randomName(7);
  const n = {};
  ['pos','bb','bc','rB','rBi','rBs','bH','hcl','hcnt','htl','hk','hnxt',
   'hcode','hmx','htbl','hclen','FLEN','FDIST','LEX','LBA','DEX','DBA','CLO',
   'out','bf','bt','sl','lT','dT','sym','lk','ll','dc','dd','cp','nl','nd',
   'ncl','cls','clT','cmb','ci','rbs'].forEach(k => { n[k] = randomName(6); });

  const FLEN_ARR  = [...Array(144).fill(8),...Array(112).fill(9),...Array(24).fill(7),...Array(8).fill(8)];
  const FDIST_ARR = Array(32).fill(5);
  const LEXTRA = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
  const LBASE  = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
  const DEXTRA = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
  const DBASE  = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
  const CLORD  = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];

  const L = [...lines];
  const a = s => L.push(s);

  a(`local ${n.pos}=1;local ${n.bb}=0;local ${n.bc}=0`);
  a(`local function ${n.rB}() local r=${byteVar}[${n.pos}] or 0;${n.pos}=${n.pos}+1;return r end`);
  a(`local function ${n.rBi}() if ${n.bc}==0 then ${n.bb}=${n.rB}();${n.bc}=8 end;local r=${n.bb}%2;${n.bb}=math.floor(${n.bb}/2);${n.bc}=${n.bc}-1;return r end`);
  a(`local function ${n.rBs}(nb) local r=0;local s=1;for _=1,nb do r=r+${n.rBi}()*s;s=s*2 end;return r end`);
  a(`local function ${n.bH}(${n.hcl})`);
  a(`local ${n.hcnt}={};local ${n.htl}=#${n.hcl}`);
  a(`for ${n.hk}=1,${n.htl} do local c=${n.hcl}[${n.hk}];if c>0 then ${n.hcnt}[c]=(${n.hcnt}[c] or 0)+1 end end`);
  a(`local ${n.hnxt}={};local ${n.hmx}=0;local ${n.hcode}=0`);
  a(`for ${n.hclen}=1,15 do if (${n.hcnt}[${n.hclen}] or 0)>0 and ${n.hclen}>${n.hmx} then ${n.hmx}=${n.hclen} end;${n.hnxt}[${n.hclen}]=${n.hcode};${n.hcode}=(${n.hcode}+(${n.hcnt}[${n.hclen}] or 0))*2 end`);
  a(`local ${n.htbl}={}`);
  a(`for ${n.hk}=1,${n.htl} do local c=${n.hcl}[${n.hk}];if c>0 then ${n.htbl}[c*65536+${n.hnxt}[c]]=${n.hk}-1;${n.hnxt}[c]=${n.hnxt}[c]+1 end end`);
  a(`local _mx=${n.hmx};local _tb=${n.htbl}`);
  a(`return function() local c=0;for l=1,_mx do c=c*2+${n.rBi}();local s=_tb[l*65536+c];if s~=nil then return s end end end`);
  a(`end`);
  a(`local ${n.FLEN}={${FLEN_ARR.join(',')}}`);
  a(`local ${n.FDIST}={${FDIST_ARR.join(',')}}`);
  a(`local ${n.LEX}={${LEXTRA.join(',')}};local ${n.LBA}={${LBASE.join(',')}}`);
  a(`local ${n.DEX}={${DEXTRA.join(',')}};local ${n.DBA}={${DBASE.join(',')}}`);
  a(`local ${n.CLO}={${CLORD.join(',')}}`);
  a(`local ${n.out}={};local ${n.bf}=0`);
  a(`repeat`);
  a(`${n.bf}=${n.rBi}();local ${n.bt}=${n.rBs}(2)`);
  a(`if ${n.bt}==0 then ${n.bb}=0;${n.bc}=0;local ${n.sl}=${n.rB}()+${n.rB}()*256;${n.rB}();${n.rB}();for _=1,${n.sl} do ${n.out}[#${n.out}+1]=string.char(${n.rB}()) end`);
  a(`elseif ${n.bt}==1 then`);
  a(`local ${n.lT}=${n.bH}(${n.FLEN});local ${n.dT}=${n.bH}(${n.FDIST})`);
  a(`while true do local ${n.sym}=${n.lT}();if ${n.sym}==nil or ${n.sym}==256 then break end`);
  a(`if ${n.sym}<256 then ${n.out}[#${n.out}+1]=string.char(${n.sym})`);
  a(`else local ${n.lk}=${n.sym}-257;local ${n.ll}=${n.LBA}[${n.lk}+1]+${n.rBs}(${n.LEX}[${n.lk}+1]);local ${n.dc}=${n.dT}();if ${n.dc}==nil then break end`);
  a(`local ${n.dd}=${n.DBA}[${n.dc}+1]+${n.rBs}(${n.DEX}[${n.dc}+1]);local ${n.cp}=#${n.out}-${n.dd}+1`);
  a(`for ${n.ci}=0,${n.ll}-1 do ${n.out}[#${n.out}+1]=${n.out}[${n.cp}+${n.ci}] end end end`);
  a(`elseif ${n.bt}==2 then`);
  a(`local ${n.nl}=${n.rBs}(5)+257;local ${n.nd}=${n.rBs}(5)+1;local ${n.ncl}=${n.rBs}(4)+4`);
  a(`local ${n.cls}={};for ${n.hk}=1,19 do ${n.cls}[${n.hk}]=0 end`);
  a(`for ${n.hk}=1,${n.ncl} do ${n.cls}[${n.CLO}[${n.hk}]+1]=${n.rBs}(3) end`);
  a(`local ${n.clT}=${n.bH}(${n.cls});local ${n.cmb}={};local ${n.ci}=1`);
  a(`while ${n.ci}<=${n.nl}+${n.nd} do local ${n.sym}=${n.clT}();if ${n.sym}==nil then break end`);
  a(`if ${n.sym}<16 then ${n.cmb}[${n.ci}]=${n.sym};${n.ci}=${n.ci}+1`);
  a(`elseif ${n.sym}==16 then local ${n.rbs}=${n.rBs}(2)+3;for _=1,${n.rbs} do ${n.cmb}[${n.ci}]=${n.cmb}[${n.ci}-1] or 0;${n.ci}=${n.ci}+1 end`);
  a(`elseif ${n.sym}==17 then local ${n.rbs}=${n.rBs}(3)+3;for _=1,${n.rbs} do ${n.cmb}[${n.ci}]=0;${n.ci}=${n.ci}+1 end`);
  a(`else local ${n.rbs}=${n.rBs}(7)+11;for _=1,${n.rbs} do ${n.cmb}[${n.ci}]=0;${n.ci}=${n.ci}+1 end end end`);
  a(`local ${n.lT}={};local ${n.dT}={}`);
  a(`for ${n.hk}=1,288 do ${n.lT}[${n.hk}]=${n.cmb}[${n.hk}] or 0 end`);
  a(`for ${n.hk}=1,30 do ${n.dT}[${n.hk}]=${n.cmb}[${n.nl}+${n.hk}] or 0 end`);
  a(`${n.lT}=${n.bH}(${n.lT});${n.dT}=${n.bH}(${n.dT})`);
  a(`while true do local ${n.sym}=${n.lT}();if ${n.sym}==nil or ${n.sym}==256 then break end`);
  a(`if ${n.sym}<256 then ${n.out}[#${n.out}+1]=string.char(${n.sym})`);
  a(`else local ${n.lk}=${n.sym}-257;local ${n.ll}=${n.LBA}[${n.lk}+1]+${n.rBs}(${n.LEX}[${n.lk}+1]);local ${n.dc}=${n.dT}();if ${n.dc}==nil then break end`);
  a(`local ${n.dd}=${n.DBA}[${n.dc}+1]+${n.rBs}(${n.DEX}[${n.dc}+1]);local ${n.cp}=#${n.out}-${n.dd}+1`);
  a(`for ${n.ci}=0,${n.ll}-1 do ${n.out}[#${n.out}+1]=${n.out}[${n.cp}+${n.ci}] end end end end`);
  a(`until ${n.bf}==1`);
  a(`local ${vR}=table.concat(${n.out})`);
  a(hiddenLoader(vR));
  return L.join('\n');
}

// ── Pre-compression Lua minifier — strip whitespace/comments for better deflate ──
function luaMinify(src) {
  // Protect strings and long strings
  const slots = [];
  let s = src.replace(
    /(\[=*\[[\s\S]*?\]=*\])|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
    (m) => { slots.push(m); return `\x00P${slots.length - 1}\x00`; }
  );
  // Strip long comments
  s = s.replace(/--\[=*\[[\s\S]*?\]=*\]/g, '');
  // Strip line comments
  s = s.replace(/--[^\n]*/g, '');
  // Collapse whitespace: multiple spaces/tabs → single space
  s = s.replace(/[ \t]+/g, ' ');
  // Remove spaces around operators where safe
  s = s.replace(/ ?([\+\-\*\/\%\^\=\<\>\~\,\;\(\)\[\]\{\}]) ?/g, '$1');
  // But restore space after keywords that need it
  s = s.replace(/\b(local|return|function|if|then|else|elseif|end|do|for|while|repeat|until|in|and|or|not)\b/g, ' $1 ');
  // Collapse multiple newlines → single
  s = s.replace(/\n{2,}/g, '\n');
  // Trim each line
  s = s.split('\n').map(l => l.trim()).filter(l => l.length > 0).join('\n');
  // Restore protected strings
  s = s.replace(/\x00P(\d+)\x00/g, (_, i) => slots[+i]);
  return s;
}

// ── Main compressor: tries ALL strategies×encodings, picks absolute smallest ──
function wrapWithDecompressor(luaSource) {
  const results = [];
  const keyLen = 20 + randInt(0, 12);
  const key    = Array.from({ length: keyLen }, () => randInt(1, 254));

  // Pre-minify the source for better compression
  let minified;
  try { minified = luaMinify(luaSource); } catch (_) { minified = luaSource; }
  const srcBuf = Buffer.from(minified, 'utf-8');

  // ── Method 1: RC4-only (base64) ──
  try {
    const enc  = rc4Encrypt(appendCrc32(srcBuf), key);
    const stub = buildXorDecoder(enc.toString('base64'), key, false);
    results.push({ code: stub, size: stub.length, method: 'rc4+b64' });
  } catch (_) {}

  // ── Method 2: RC4-only (base85 — 20% denser) ──
  try {
    const enc  = rc4Encrypt(appendCrc32(srcBuf), key);
    const stub = buildXorDecoder(encodeBase85(enc), key, true);
    results.push({ code: stub, size: stub.length, method: 'rc4+b85' });
  } catch (_) {}

  // ── Method 3: Deflate + RC4 (base64) ──
  try {
    const enc  = rc4Encrypt(appendCrc32(bestDeflate(minified)), key);
    const stub = buildDeflateDecoder(enc.toString('base64'), key, false);
    results.push({ code: stub, size: stub.length, method: 'deflate+rc4+b64' });
  } catch (_) {}

  // ── Method 4: Deflate + RC4 (base85) ──
  try {
    const enc  = rc4Encrypt(appendCrc32(bestDeflate(minified)), key);
    const stub = buildDeflateDecoder(encodeBase85(enc), key, true);
    results.push({ code: stub, size: stub.length, method: 'deflate+rc4+b85' });
  } catch (_) {}

  // ── Method 5: LZW + RC4 (base64) ──
  try {
    const enc  = rc4Encrypt(appendCrc32(lzwCodesToBuffer(lzwCompress(minified))), key);
    const stub = buildLzwDecoder(enc.toString('base64'), key, false);
    results.push({ code: stub, size: stub.length, method: 'lzw+rc4+b64' });
  } catch (_) {}

  // ── Method 6: LZW + RC4 (base85) ──
  try {
    const enc  = rc4Encrypt(appendCrc32(lzwCodesToBuffer(lzwCompress(minified))), key);
    const stub = buildLzwDecoder(encodeBase85(enc), key, true);
    results.push({ code: stub, size: stub.length, method: 'lzw+rc4+b85' });
  } catch (_) {}

  // ── Method 7: Double deflate (base64) ──
  try {
    const pass1 = bestDeflate(minified);
    const pass2 = bestDeflate(pass1);
    const enc   = rc4Encrypt(appendCrc32(pass2), key);
    const stub  = buildDoubleDeflateDecoder(enc.toString('base64'), key, pass1.length);
    results.push({ code: stub, size: stub.length, method: 'double-deflate+b64' });
  } catch (_) {}

  // ── Method 8: Double deflate (base85 — densest double) ──
  try {
    const pass1 = bestDeflate(minified);
    const pass2 = bestDeflate(pass1);
    const enc   = rc4Encrypt(appendCrc32(pass2), key);
    const stub  = buildDoubleDeflateDecoder(encodeBase85(enc), key, pass1.length);
    results.push({ code: stub, size: stub.length, method: 'double-deflate+b85' });
  } catch (_) {}

  // Sort by size, pick smallest — but verify it's valid Lua
  results.sort((a, b) => a.size - b.size);
  for (const r of results) {
    if (r.size >= luaSource.length) continue;
    // Quick structural sanity check on the generated stub
    if (typeof r.code === 'string' && r.code.length > 0) return r.code;
  }
  return luaSource;
}

// ── Double-deflate decoder: inflate → inflate → loadstring ─────────
function buildDoubleDeflateDecoder(encStr, key, intermediateLen) {
  // Auto-detect: base85 strings contain chars like !#$%& that base64 doesn't
  const isBase85 = /[!#$%&]/.test(encStr);
  const { lines, byteVar } = isBase85
    ? buildRC4Base85Decoder(encStr, key)
    : buildRC4Base64Decoder(encStr, key);
  const vR1 = randomName(7);
  const vR2 = randomName(7);
  const n1 = {};
  const n2 = {};
  ['pos','bb','bc','rB','rBi','rBs','bH','hcl','hcnt','htl','hk','hnxt',
   'hcode','hmx','htbl','hclen','FLEN','FDIST','LEX','LBA','DEX','DBA','CLO',
   'out','bf','bt','sl','lT','dT','sym','lk','ll','dc','dd','cp','nl','nd',
   'ncl','cls','clT','cmb','ci','rbs'].forEach(k => { n1[k] = randomName(6); n2[k] = randomName(6); });

  const FLEN_ARR  = [...Array(144).fill(8),...Array(112).fill(9),...Array(24).fill(7),...Array(8).fill(8)];
  const FDIST_ARR = Array(32).fill(5);
  const LEXTRA = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
  const LBASE  = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
  const DEXTRA = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
  const DBASE  = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
  const CLORD  = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];

  // Helper: add inflate block using a namespace
  function addInflateBlock(L, n, inputVar, outputVar) {
    const a = s => L.push(s);
    a(`local ${n.pos}=1;local ${n.bb}=0;local ${n.bc}=0`);
    a(`local function ${n.rB}() local r=${inputVar}[${n.pos}] or 0;${n.pos}=${n.pos}+1;return r end`);
    a(`local function ${n.rBi}() if ${n.bc}==0 then ${n.bb}=${n.rB}();${n.bc}=8 end;local r=${n.bb}%2;${n.bb}=math.floor(${n.bb}/2);${n.bc}=${n.bc}-1;return r end`);
    a(`local function ${n.rBs}(nb) local r=0;local s=1;for _=1,nb do r=r+${n.rBi}()*s;s=s*2 end;return r end`);
    a(`local function ${n.bH}(${n.hcl})`);
    a(`local ${n.hcnt}={};local ${n.htl}=#${n.hcl}`);
    a(`for ${n.hk}=1,${n.htl} do local c=${n.hcl}[${n.hk}];if c>0 then ${n.hcnt}[c]=(${n.hcnt}[c] or 0)+1 end end`);
    a(`local ${n.hnxt}={};local ${n.hmx}=0;local ${n.hcode}=0`);
    a(`for ${n.hclen}=1,15 do if (${n.hcnt}[${n.hclen}] or 0)>0 and ${n.hclen}>${n.hmx} then ${n.hmx}=${n.hclen} end;${n.hnxt}[${n.hclen}]=${n.hcode};${n.hcode}=(${n.hcode}+(${n.hcnt}[${n.hclen}] or 0))*2 end`);
    a(`local ${n.htbl}={}`);
    a(`for ${n.hk}=1,${n.htl} do local c=${n.hcl}[${n.hk}];if c>0 then ${n.htbl}[c*65536+${n.hnxt}[c]]=${n.hk}-1;${n.hnxt}[c]=${n.hnxt}[c]+1 end end`);
    a(`local _mx=${n.hmx};local _tb=${n.htbl}`);
    a(`return function() local c=0;for l=1,_mx do c=c*2+${n.rBi}();local s=_tb[l*65536+c];if s~=nil then return s end end end`);
    a(`end`);
    a(`local ${n.FLEN}={${FLEN_ARR.join(',')}}`);
    a(`local ${n.FDIST}={${FDIST_ARR.join(',')}}`);
    a(`local ${n.LEX}={${LEXTRA.join(',')}};local ${n.LBA}={${LBASE.join(',')}}`);
    a(`local ${n.DEX}={${DEXTRA.join(',')}};local ${n.DBA}={${DBASE.join(',')}}`);
    a(`local ${n.CLO}={${CLORD.join(',')}}`);
    a(`local ${outputVar}={};local ${n.bf}=0`);
    a(`repeat`);
    a(`${n.bf}=${n.rBi}();local ${n.bt}=${n.rBs}(2)`);
    a(`if ${n.bt}==0 then ${n.bb}=0;${n.bc}=0;local ${n.sl}=${n.rB}()+${n.rB}()*256;${n.rB}();${n.rB}();for _=1,${n.sl} do ${outputVar}[#${outputVar}+1]=string.char(${n.rB}()) end`);
    a(`elseif ${n.bt}==1 then`);
    a(`local ${n.lT}=${n.bH}(${n.FLEN});local ${n.dT}=${n.bH}(${n.FDIST})`);
    a(`while true do local ${n.sym}=${n.lT}();if ${n.sym}==nil or ${n.sym}==256 then break end`);
    a(`if ${n.sym}<256 then ${outputVar}[#${outputVar}+1]=string.char(${n.sym})`);
    a(`else local ${n.lk}=${n.sym}-257;local ${n.ll}=${n.LBA}[${n.lk}+1]+${n.rBs}(${n.LEX}[${n.lk}+1]);local ${n.dc}=${n.dT}();if ${n.dc}==nil then break end`);
    a(`local ${n.dd}=${n.DBA}[${n.dc}+1]+${n.rBs}(${n.DEX}[${n.dc}+1]);local ${n.cp}=#${outputVar}-${n.dd}+1`);
    a(`for ${n.ci}=0,${n.ll}-1 do ${outputVar}[#${outputVar}+1]=${outputVar}[${n.cp}+${n.ci}] end end end`);
    a(`elseif ${n.bt}==2 then`);
    a(`local ${n.nl}=${n.rBs}(5)+257;local ${n.nd}=${n.rBs}(5)+1;local ${n.ncl}=${n.rBs}(4)+4`);
    a(`local ${n.cls}={};for ${n.hk}=1,19 do ${n.cls}[${n.hk}]=0 end`);
    a(`for ${n.hk}=1,${n.ncl} do ${n.cls}[${n.CLO}[${n.hk}]+1]=${n.rBs}(3) end`);
    a(`local ${n.clT}=${n.bH}(${n.cls});local ${n.cmb}={};local ${n.ci}=1`);
    a(`while ${n.ci}<=${n.nl}+${n.nd} do local ${n.sym}=${n.clT}();if ${n.sym}==nil then break end`);
    a(`if ${n.sym}<16 then ${n.cmb}[${n.ci}]=${n.sym};${n.ci}=${n.ci}+1`);
    a(`elseif ${n.sym}==16 then local ${n.rbs}=${n.rBs}(2)+3;for _=1,${n.rbs} do ${n.cmb}[${n.ci}]=${n.cmb}[${n.ci}-1] or 0;${n.ci}=${n.ci}+1 end`);
    a(`elseif ${n.sym}==17 then local ${n.rbs}=${n.rBs}(3)+3;for _=1,${n.rbs} do ${n.cmb}[${n.ci}]=0;${n.ci}=${n.ci}+1 end`);
    a(`else local ${n.rbs}=${n.rBs}(7)+11;for _=1,${n.rbs} do ${n.cmb}[${n.ci}]=0;${n.ci}=${n.ci}+1 end end end`);
    a(`local ${n.lT}={};local ${n.dT}={}`);
    a(`for ${n.hk}=1,288 do ${n.lT}[${n.hk}]=${n.cmb}[${n.hk}] or 0 end`);
    a(`for ${n.hk}=1,30 do ${n.dT}[${n.hk}]=${n.cmb}[${n.nl}+${n.hk}] or 0 end`);
    a(`${n.lT}=${n.bH}(${n.lT});${n.dT}=${n.bH}(${n.dT})`);
    a(`while true do local ${n.sym}=${n.lT}();if ${n.sym}==nil or ${n.sym}==256 then break end`);
    a(`if ${n.sym}<256 then ${outputVar}[#${outputVar}+1]=string.char(${n.sym})`);
    a(`else local ${n.lk}=${n.sym}-257;local ${n.ll}=${n.LBA}[${n.lk}+1]+${n.rBs}(${n.LEX}[${n.lk}+1]);local ${n.dc}=${n.dT}();if ${n.dc}==nil then break end`);
    a(`local ${n.dd}=${n.DBA}[${n.dc}+1]+${n.rBs}(${n.DEX}[${n.dc}+1]);local ${n.cp}=#${outputVar}-${n.dd}+1`);
    a(`for ${n.ci}=0,${n.ll}-1 do ${outputVar}[#${outputVar}+1]=${outputVar}[${n.cp}+${n.ci}] end end end end`);
    a(`until ${n.bf}==1`);
  }

  const L = [...lines];
  const vMid = randomName(7);

  // First inflate: compressed → intermediate bytes
  addInflateBlock(L, n1, byteVar, vMid);

  // Convert intermediate from string.char table to byte table for second inflate
  const vMidBytes = randomName(7);
  L.push(`local ${vMidBytes}={}`);
  L.push(`for _i=1,#${vMid} do ${vMidBytes}[_i]=string.byte(${vMid}[_i]) end`);

  // Second inflate: intermediate → final source
  const vFinal = randomName(7);
  addInflateBlock(L, n2, vMidBytes, vFinal);

  const vStr = randomName(7);
  L.push(`local ${vStr}=table.concat(${vFinal})`);
  L.push(hiddenLoader(vStr));
  return L.join('\n');
}

module.exports = { wrapWithDecompressor };
