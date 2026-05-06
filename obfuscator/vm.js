'use strict';

const { randomName, randomKey, randInt } = require('./utils');

function rollingEnc(inner, key) {
  const src = Buffer.from(inner, 'utf-8');
  const rk  = [...key];
  return Array.from(src, (b, i) => {
    const ki = i % rk.length;
    const e  = (b ^ rk[ki]) & 0xFF;
    rk[ki]   = (rk[ki] ^ b ^ (i & 0xFF)) & 0xFF;
    if (rk[ki] === 0) rk[ki] = 0x5A;
    return e;
  });
}

function N(n) { return randomName(n || 9); }

function b64DecoderSnippet(b64Var, bytesVar) {
  const [aV,dtV,iV,c1,c2,c3,c4,bnV] = Array.from({length:8},()=>N(6));
  return [
    `local ${aV}="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"`,
    `local ${dtV}={}`,
    `for ${iV}=1,64 do ${dtV}[${aV}:sub(${iV},${iV})]=${iV}-1 end`,
    `local ${bytesVar}={};local _bi=0`,
    `for ${iV}=1,#${b64Var},4 do`,
    ` local ${c1}=${dtV}[${b64Var}:sub(${iV},${iV})] or 0`,
    ` local ${c2}=${dtV}[${b64Var}:sub(${iV}+1,${iV}+1)] or 0`,
    ` local ${c3}=${dtV}[${b64Var}:sub(${iV}+2,${iV}+2)]`,
    ` local ${c4}=${dtV}[${b64Var}:sub(${iV}+3,${iV}+3)]`,
    ` local ${bnV}=${c1}*262144+${c2}*4096`,
    ` _bi=_bi+1;${bytesVar}[_bi]=math.floor(${bnV}/65536)%256`,
    ` if ${c3} then ${bnV}=${bnV}+${c3}*64;_bi=_bi+1;${bytesVar}[_bi]=math.floor(${bnV}/256)%256 end`,
    ` if ${c4} then ${bnV}=${bnV}+${c4};_bi=_bi+1;${bytesVar}[_bi]=${bnV}%256 end`,
    `end`,
  ].join('\n');
}

function rollingDecSnippet(bytesVar, keyVar, srcVar) {
  const [rkV,tV,iV,kiV,pV,bxV,upkV] = Array.from({length:7},()=>N(6));
  // Use (table.unpack or unpack) for Lua 5.1 / Luau / LuaJIT compatibility
  return [
    `local ${bxV}=(function()`,
    ` if bit32 then return bit32.bxor end`,
    ` if bit and bit.bxor then return bit.bxor end`,
    ` return function(a,b) local r,s=0,1`,
    ` while a>0 or b>0 do if a%2~=b%2 then r=r+s end`,
    ` a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end`,
    `end)()`,
    `local ${upkV}=table.unpack or unpack`,
    `local ${rkV}={}`,
    `-- guard: only unpack if keyVar is a non-empty table`,
    `if type(${keyVar})=="table" and #${keyVar}>0 then`,
    ` local _t={${upkV}(${keyVar})}`,
    ` for _i=1,#_t do ${rkV}[_i]=_t[_i] end`,
    `end`,
    `if #${rkV}==0 then ${rkV}={90} end`,
    `local ${tV}={}`,
    `for ${iV}=1,#${bytesVar} do`,
    ` local ${kiV}=(( ${iV}-1)%#${rkV})+1`,
    ` local ${pV}=${bxV}(${bytesVar}[${iV}],${rkV}[${kiV}])`,
    ` ${tV}[${iV}]=string.char(${pV})`,
    ` ${rkV}[${kiV}]=${bxV}(${bxV}(${rkV}[${kiV}],${pV}),(${iV}-1)%256)`,
    ` if ${rkV}[${kiV}]==0 then ${rkV}[${kiV}]=90 end`,
    `end`,
    `local ${srcVar}=table.concat(${tV})`,
  ].join('\n');
}

// ── Reader-function based loader ────────────────────────────────────
// Instead of load(string), we use load(reader_function).
// The Lua runtime calls the reader repeatedly for chunks — the complete
// source is never passed as a single string argument, so executor hooks
// on loadstring/load that capture the first argument cannot reconstruct
// the full payload. Each chunk is also XOR-masked with a per-session key
// so even hooking the reader function yields garbled individual pieces.
function sandboxedLoad(srcVar) {
  const [ldN,fnN,envN,cszN,chkN,idxN,keyN,coN,okN,maskN] = Array.from({length:10},()=>N(6));
  const chunkSize = 32 + randInt(0, 32);  // randomise chunk size per layer
  const maskKey   = Array.from({length: 8}, () => randInt(1, 254));
  // char-code strings for API names — never bare literals
  const ls2 = `string.char(${[108,111,97,100,115,116,114,105,110,103].join(',')})`;
  const ls1 = `string.char(${[108,111,97,100].join(',')})`;
  const isl = `string.char(${[105,115,108,99,108,111,115,117,114,101].join(',')})`;
  const bxV = N(5);
  return [
    // Resolve load/loadstring; reject if islclosure says it's an L-closure (hooked)
    `local ${envN}=(type(getfenv)=="function" and getfenv(0) or _G)`,
    `local ${ldN}=rawget(${envN},${ls2}) or rawget(${envN},${ls1})`,
    `do local _isl=rawget(${envN},${isl})`,
    ` if type(_isl)=="function" and type(${ldN})=="function" and _isl(${ldN}) then ${ldN}=nil end`,
    `end`,
    `if type(${ldN})=="function" then`,
    // bxor helper for chunk masking
    ` local ${bxV}=bit32 and bit32.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end`,
    // per-session chunk mask key
    ` local ${maskN}={${maskKey.join(',')}}`,
    // Split src into fixed-size chunks, XOR-masking each byte
    ` local ${cszN}=${chunkSize}`,
    ` local ${chkN}={}`,
    ` for _ci=1,math.ceil(#${srcVar}/${cszN}) do`,
    `  local _sl=${srcVar}:sub((_ci-1)*${cszN}+1,_ci*${cszN})`,
    `  local _mt={}`,
    `  for _bi=1,#_sl do`,
    `   local _mk=${maskN}[((_bi-1)%#${maskN})+1]`,
    `   _mt[_bi]=string.char(${bxV}(string.byte(_sl,_bi),_mk))`,
    `  end`,
    `  ${chkN}[_ci]=table.concat(_mt)`,
    ` end`,
    // Reader function — called by Lua runtime for each chunk; demasks on the fly
    ` local ${idxN}=0`,
    ` local ${keyN}={${maskKey.join(',')}}`,  // same mask, unmask on read
    ` local ${coN}=coroutine.create(function()`,
    `  local _ok2,${fnN}=pcall(${ldN},function()`,
    `   ${idxN}=${idxN}+1`,
    `   local _ch=${chkN}[${idxN}]`,
    `   if not _ch then return nil end`,
    `   local _out={}`,
    `   for _bi=1,#_ch do`,
    `    local _mk=${keyN}[((_bi-1)%#${keyN})+1]`,
    `    _out[_bi]=string.char(${bxV}(string.byte(_ch,_bi),_mk))`,
    `   end`,
    `   return table.concat(_out)`,
    `  end,${sc('=(g)')})`,
    `  if _ok2 and type(${fnN})=="function" then`,
    `   local _ok3=pcall(${fnN})`,
    `  end`,
    ` end)`,
    ` coroutine.resume(${coN})`,
    `end`,
  ].join('\n');
}

// Helper: string → char codes literal (never bare string in generated code)
function sc(s) {
  return `string.char(${Array.from(s).map(c=>c.charCodeAt(0)).join(',')})`;
}

function makeOpcodes(n) {
  const used=new Set(),ops=[];
  while(ops.length<n){const v=randInt(2,250);if(!used.has(v)){used.add(v);ops.push(v);}}
  return ops;
}

function bdt(opcodeVar, handlers) {
  const ops = [...handlers].sort((a,b)=>a.op-b.op);
  function tree(arr) {
    if(!arr.length) return '';
    if(arr.length===1) return `if ${opcodeVar}==${arr[0].op} then\n${arr[0].code}\nend`;
    const mid=Math.floor(arr.length/2);
    return `if not(${opcodeVar}<${arr[mid].op}) then\n${tree(arr.slice(mid))}\nelse\n${tree(arr.slice(0,mid))}\nend`;
  }
  return tree(ops);
}

function fakeMoonsec() {
  const id=randInt(111111111,999999999),wm=N(6);
  return [`if false then`,` local _MS_ID=${id}`,` local function MOONSEC_EXIT() end`,
    ` local function MS_WATERMARK(${wm}) end`,` MS_WATERMARK("${id}")`,
    ` local _MOONSEC_VERSION="3.0.${randInt(1,9)}"`,` MOONSEC_EXIT()`,`end`].join('\n');
}
function fakeIronBrew() {
  const [v1,v2,v3]=[N(5),N(5),N(5)],vals=Array.from({length:4},()=>randInt(10,250));
  return [`if false then`,
    ` local ${v1}={VIndex=${randInt(0,38)},GetObfuscated=function()return""end}`,
    ` local _IB_Enum=${randInt(0,38)}`,
    ` if _IB_Enum>${vals[0]} then ${v2}=true else ${v3}=false end`,
    ` local _IRONBREW_VERSION="2.${randInt(0,9)}.${randInt(0,9)}"`,`end`].join('\n');
}
function fakeWRD() {
  const [v1,v2]=[N(5),N(5)];
  return [`if false then`,
    ` local ${v1}=rawget((type(getfenv)=="function" and getfenv(0) or _G),"WRD_INTERNAL") or rawget((type(getfenv)=="function" and getfenv(0) or _G),"_WRD")`,
    ` local _WRD_BUILD="${randInt(1000,9999)}"`,
    ` local ${v2}={version=_WRD_BUILD,id=${randInt(10000,99999)}}`,`end`].join('\n');
}

function fakeLuraph() {
  const id=randInt(1000,9999);
  return [`if false then`,
    ` local _LPH_CHUNK_KEY="${N(12)}"`,
    ` local _LPH_VERSION="${id}.${randInt(0,9)}"`,
    ` local _LPH_WATERMARK=string.char(${[76,117,114,97,112,104].join(',')})`,
    `end`].join('\n');
}

function vmLayer1(inner) {
  const key=randomKey(48),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  const [NOP,LOAD,DEC,TOSTR,CAT,EXEC,HALT]=makeOpcodes(7);
  const prog=[NOP,NOP,LOAD,DEC,NOP,TOSTR,CAT,NOP,EXEC,HALT];
  const [Q,Z,eA,uA,kV,dV,bsV,srcV]=Array.from({length:8},()=>N(2));
  const bytesV=N(7);
  return [fakeMoonsec(),
    `local ${kV}={${key.join(',')}}`,`local ${dV}="${b64}"`,
    b64DecoderSnippet(dV,bytesV),
    `local ${eA}={${prog.join(',')}}`,`local ${uA}={${prog.map((_,i)=>i).join(',')}}`,
    `local ${Z}={};local ${srcV}=nil`,`local ${Q}=1`,`repeat`,`  local _d=${eA}[${Q}]`,
    `  ${bdt('_d',[
      {op:NOP,code:`-- nop`},
      {op:LOAD,code:`${Z}[0]=${bytesV};${Z}[1]=${kV}`},
      {op:DEC,code:rollingDecSnippet(`${Z}[0]`,`${Z}[1]`,srcV).replace(`local ${srcV}=`,`${srcV}=`)},
      {op:TOSTR,code:`-- chars done`},{op:CAT,code:`-- concat done`},
      {op:EXEC,code:sandboxedLoad(srcV)},{op:HALT,code:`break`},
    ])}`,
    `  ${Q}=${Q}+1`,`until ${Q}>#${eA}`,
  ].join('\n');
}

function vmLayer2(inner) {
  const key=randomKey(52),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  const [NOP,INIT,DECODE,CHR,EXEC,D1,D2]=makeOpcodes(7);
  const prog=[NOP,D1,INIT,NOP,DECODE,NOP,EXEC];
  const [kV,dV,RV,srcV,tblV,bytesV]=Array.from({length:6},()=>N(6));
  return [fakeIronBrew(),
    `local ${kV}={${key.join(',')}}`,`local ${dV}="${b64}"`,
    b64DecoderSnippet(dV,bytesV),
    `local ${RV}={};local ${srcV}=nil`,`local _VIB_Enum`,`local ${tblV}={}`,
    `${tblV}[${NOP}]=function() end`,
    `${tblV}[${D1}]=function() local _x=type(nil) end`,
    `${tblV}[${D2}]=function() local _t={} end`,
    `${tblV}[${INIT}]=function() ${RV}[1]=${bytesV};${RV}[2]=${kV} end`,
    `${tblV}[${DECODE}]=function()`,
    `  ${rollingDecSnippet(`${RV}[1]`,`${RV}[2]`,srcV)}`,`end`,
    `${tblV}[${EXEC}]=function()`,`  ${sandboxedLoad(srcV)}`,`end`,
    `for _,_op in ipairs({${prog.join(',')}}) do`,
    `  _VIB_Enum=_op;local _h=${tblV}[_op];if _h then _h() end`,`end`,
  ].join('\n');
}

function vmLayer3(inner) {
  const key=randomKey(44),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  const hexKey=key.map(b=>'0x'+b.toString(16).padStart(2,'0')).join(',');
  const [PUSH_D,PUSH_K,XOR_B,EXEC]=makeOpcodes(4).map(v=>'0x'+v.toString(16));
  const [kV,dV,stkV,srcV,bytesV]=Array.from({length:5},()=>N(6));
  return [fakeWRD(),
    `local ${kV}={${hexKey}}`,`local ${dV}="${b64}"`,
    b64DecoderSnippet(dV,bytesV),
    `local ${stkV}={};local ${srcV}=nil`,
    `for _,_op in ipairs({${PUSH_D},${PUSH_K},${XOR_B},${EXEC}}) do`,
    ` if _op==${PUSH_D} then ${stkV}[#${stkV}+1]=${bytesV}`,
    ` elseif _op==${PUSH_K} then ${stkV}[#${stkV}+1]=${kV}`,
    ` elseif _op==${XOR_B} then`,
    `  local _kb=${stkV}[#${stkV}];${stkV}[#${stkV}]=nil`,
    `  local _da=${stkV}[#${stkV}];${stkV}[#${stkV}]=nil`,
    `  ${rollingDecSnippet('_da','_kb',srcV)}`,
    ` elseif _op==${EXEC} then`,
    `  ${sandboxedLoad(srcV)};break`,` end`,`end`,
  ].join('\n');
}

function vmLayer4(inner) {
  const k1=randomKey(32),k2=randomKey(32);
  const enc1=rollingEnc(inner,k1);
  const enc2=rollingEnc(Buffer.from(enc1).toString('latin1'),k2);
  const b64=Buffer.from(enc2.map(b=>b&0xFF)).toString('base64');
  const [k1V,k2V,dV,p1V,srcV,bytesV]=Array.from({length:6},()=>N(6));
  return [
    `local ${k1V}={${k1.join(',')}}`,`local ${k2V}={${k2.join(',')}}`,
    `local ${dV}="${b64}"`,
    b64DecoderSnippet(dV,bytesV),
    `local ${p1V}={};local ${srcV}=nil`,
    `local _bxL4=bit32 and bit32.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end`,
    `local _upkL4=table.unpack or unpack`,
    `local _co=coroutine.wrap(function()`,
    ` local _rk2={_upkL4(${k2V})};local _t={}`,
    ` if #_rk2==0 then _rk2={90} end`,
    ` for _i=1,#${bytesV} do`,
    `  local _ki=((_i-1)%#_rk2)+1`,
    `  local _p=_bxL4(${bytesV}[_i],_rk2[_ki])`,
    `  ${p1V}[_i]=_p`,
    `  _rk2[_ki]=_bxL4(_bxL4(_rk2[_ki],_p),(_i-1)%256)`,
    `  if _rk2[_ki]==0 then _rk2[_ki]=0x5A end`,
    ` end`,
    `end);_co()`,
    rollingDecSnippet(p1V,k1V,srcV),
    sandboxedLoad(srcV),
  ].join('\n');
}

function vmLayer5(inner) {
  const key=randomKey(48),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  const [kV,dV,mtV,objV,bytesV]=Array.from({length:5},()=>N(6));
  const checksum=key.reduce((s,b)=>(s+b)%251,0);
  return [fakeMoonsec(),fakeIronBrew(),
    `local ${kV}={${key.join(',')}}`,`local ${dV}="${b64}"`,
    `do local _cs=0;for _,_b in ipairs(${kV}) do _cs=(_cs+_b)%251 end`,
    ` if _cs~=${checksum} then return end`,`end`,
    b64DecoderSnippet(dV,bytesV),
    `local ${mtV}={__index={`,
    ` buildKey=function(self)`,
    `  local _k={}`,
    `  for _i=1,#self.k do`,
    `   local _vb=string.byte(_VERSION,((_i-1)%#_VERSION)+1)`,
    `   _k[_i]=(bit32 and bit32.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end)(self.k[_i],_vb)`,
    `   if _k[_i]==0 then _k[_i]=0x3C end`,
    `  end;return _k`,
    ` end,`,
    ` run=function(self)`,
    `  local _src`,
    `  ${rollingDecSnippet("self.bytes","self:buildKey()",'_src')}`,
    `  ${sandboxedLoad('_src')}`,
    ` end`,`}}`,
    `local ${objV}=setmetatable({k=${kV},bytes=${bytesV}},${mtV})`,
    `${objV}:run()`,
  ].join('\n');
}

function vmLayer6(inner) {
  const key=randomKey(56),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  const Q='Q'+randInt(1,9),Z='Z'+randInt(1,9),eA='e'+randInt(1,9),uA='u'+randInt(1,9);
  const YA='Y'+randInt(1,9),LA='L'+randInt(1,9),HA='H'+randInt(1,9);
  const kA='k'+randInt(1,9),dA='d'+randInt(1,9),bytesV=N(7);
  const [NOP,LDATA,LKEY,XROP,CHRP,CATP,EXOP,HLT,D1,D2]=
    (()=>{const s=new Set(),r=[];while(r.length<10){const v=randInt(0,250);if(!s.has(v)){s.add(v);r.push(v);}}return r;})();
  const ops=[NOP,NOP,LDATA,LKEY,NOP,XROP,NOP,CHRP,CATP,EXOP,HLT];
  const aOps=[0,0,0,1,0,2,0,3,4,4,0],bOps=[0,0,0,1,0,0,0,2,3,0,0];
  const decCode=rollingDecSnippet(`${Z}[0]`,`${Z}[1]`,'_src2').replace('local _src2=','')+`\n${Z}[2]=_src2`;
  return [
    fakeMoonsec(),fakeIronBrew(),fakeWRD(),fakeLuraph(),
    `local ${kA}={${key.join(',')}}`,`local ${dA}="${b64}"`,
    b64DecoderSnippet(dA,bytesV),
    `local ${HA}={[0]=${bytesV},[1]=${kA}}`,`local ${Z}={}`,
    `local ${eA}={${ops.join(',')}}`,`local ${uA}={${aOps.join(',')}}`,
    `local ${YA}={${bOps.join(',')}}`,`local ${Q}=1`,`repeat`,
    `  local _d=${eA}[${Q}]`,
    `  ${bdt('_d',[
      {op:NOP,code:`-- nop`},{op:D1,code:`local _=type(nil)`},{op:D2,code:`local _={}`},
      {op:HLT,code:`break`},
      {op:LDATA,code:`${Z}[${aOps[2]}]=${HA}[0]`},
      {op:LKEY,code:`${Z}[${aOps[3]}]=${HA}[1]`},
      {op:XROP,code:decCode},
      {op:CHRP,code:`-- chars embedded`},
      {op:CATP,code:`${Z}[${aOps[8]}]=table.concat(${Z}[${bOps[8]}] or {})`},
      {op:EXOP,code:sandboxedLoad(`${Z}[${aOps[9]}]`)},
    ])}`,
    `  ${Q}=${Q}+1`,`until ${Q}>#${eA} or _d==${HLT}`,
  ].join('\n');
}

function vmLayer7(inner) {
  const key=randomKey(48),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  const [kV,dV,bytesV,srcV]=Array.from({length:4},()=>N(5));
  const [MERGE,DEC,EXEC]=makeOpcodes(3).map(v=>'0x'+v.toString(16));
  return [fakeMoonsec(),
    `local ${kV}={${key.join(',')}}`,`local ${dV}="${b64}"`,
    b64DecoderSnippet(dV,bytesV),`local ${srcV}=nil`,
    `local _prog={${MERGE},${DEC},${EXEC}}`,`local _Q=1`,`repeat`,
    ` local _d=_prog[_Q]`,
    ` if _d==${DEC} then`,
    `  ${rollingDecSnippet(bytesV,kV,srcV)}`,
    ` elseif _d==${EXEC} then`,
    `  ${sandboxedLoad(srcV)};break`,` end`,` _Q=_Q+1`,`until _Q>#_prog`,
  ].join('\n');
}

function vmLayer8(inner) {
  const key=randomKey(32),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  const [kV,dV,mtV,objV,bytesV]=Array.from({length:5},()=>N(5));
  return [fakeMoonsec(),fakeIronBrew(),fakeWRD(),
    `local ${kV}={${key.join(',')}}`,`local ${dV}="${b64}"`,
    b64DecoderSnippet(dV,bytesV),
    `local ${mtV}={__index={`,
    ` run=function(self)`,
    `  local _src`,
    `  ${rollingDecSnippet("self.bytes","self.k",'_src')}`,
    `  ${sandboxedLoad('_src')}`,
    ` end`,`}}`,
    `local ${objV}=setmetatable({k=${kV},bytes=${bytesV}},${mtV})`,
    `${objV}:run()`,
  ].join('\n');
}

function vmLayer9(inner) {
  const seedVal=randInt(0x1000,0xFFFE),poly=0xB400;
  const src=Buffer.from(inner,'utf-8');
  let st=seedVal;
  const enc=Array.from(src,(b)=>{
    const lsb=st&1;st=(st>>>1)^(lsb?poly:0);return(b^(st&0xFF))&0xFF;
  });
  const b64=Buffer.from(enc).toString('base64');
  const [stV,dV,bV,tV,srcV,iV,lV,xV]=Array.from({length:8},()=>N(6));
  const polyExpr=`${Math.floor(poly/2)}*2`;
  return [fakeMoonsec(),fakeWRD(),
    `local ${stV}=${seedVal}`,`local _pl=${polyExpr}`,
    `local ${dV}="${b64}"`,
    b64DecoderSnippet(dV,bV),`local ${tV}={}`,
    `for ${iV}=1,#${bV} do`,
    ` local ${lV}=${stV}%2`,` ${stV}=math.floor(${stV}/2)`,
    `local _bx9=bit32 and bit32.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end`,
    ` if ${lV}==1 then ${stV}=_bx9(${stV},_pl) end`,
    ` local _kb=${stV}%256`,
    ` ${tV}[${iV}]=string.char(_bx9(${bV}[${iV}],_kb))`,
    `end`,`local ${srcV}=table.concat(${tV})`,
    sandboxedLoad(srcV),
  ].join('\n');
}

function vmLayer10(inner) {
  const key=randomKey(44),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  const numChunks=4+randInt(0,2),chunkSize=Math.ceil(b64.length/numChunks);
  const chunks=Array.from({length:numChunks},(_,i)=>b64.slice(i*chunkSize,(i+1)*chunkSize));
  const cnames=chunks.map(()=>N(8));
  const [kV,bytesV,srcV,accV]=Array.from({length:4},()=>N(6));
  return [fakeIronBrew(),
    `local ${kV}={${key.join(',')}}`,
    ...chunks.map((c,i)=>`local function ${cnames[i]}() return "${c}" end`),
    `local ${accV}=${cnames.map(n=>`${n}()`).join('..')}`,
    b64DecoderSnippet(accV,bytesV),`local ${srcV}=nil`,
    rollingDecSnippet(bytesV,kV,srcV),sandboxedLoad(srcV),
  ].join('\n');
}

function vmLayer11(inner) {
  const key=randomKey(48),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  const NUM_OPS=8+randInt(0,4),opcodes=makeOpcodes(NUM_OPS);
  const [OP_INIT,OP_DEC,OP_EXEC,OP_HALT]=opcodes.slice(0,4),junk=opcodes.slice(4);
  const prog=[];
  junk.forEach(op=>prog.push(op));prog.push(OP_INIT);
  junk.slice(0,2).forEach(op=>prog.push(op));prog.push(OP_DEC);
  junk.slice(0,2).forEach(op=>prog.push(op));prog.push(OP_EXEC);prog.push(OP_HALT);
  const [kV,dV,bytesV,srcV,pcV,dispV,stateV]=Array.from({length:7},()=>N(6));
  return [fakeMoonsec(),fakeWRD(),fakeIronBrew(),fakeLuraph(),
    `local ${kV}={${key.join(',')}}`,`local ${dV}="${b64}"`,
    b64DecoderSnippet(dV,bytesV),
    `local ${srcV}=nil`,`local ${stateV}=0`,`local ${dispV}={}`,
    ...junk.map(op=>`${dispV}[${op}]=function() ${stateV}=${stateV} end`),
    `${dispV}[${OP_INIT}]=function() ${stateV}=1 end`,
    `${dispV}[${OP_DEC}]=function()`,
    ` if ${stateV}~=1 then return end`,
    ` ${rollingDecSnippet(bytesV,kV,srcV).replace(`local ${srcV}=`,`${srcV}=`)}`,
    ` ${stateV}=2`,`end`,
    `${dispV}[${OP_EXEC}]=function()`,
    ` if ${stateV}~=2 then return end`,` ${sandboxedLoad(srcV)}`,`end`,
    `${dispV}[${OP_HALT}]=function() ${stateV}=-1 end`,
    `local ${pcV}=1;local _prog={${prog.join(',')}}`,
    `repeat`,` local _op=_prog[${pcV}]`,` local _h=${dispV}[_op]`,
    ` if _h then _h() end`,` ${pcV}=${pcV}+1`,
    `until ${stateV}==-1 or ${pcV}>#_prog`,
  ].join('\n');
}

function vmLayer12(inner) {
  const key=randomKey(48),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  const csz=Math.ceil(b64.length/8);
  const chunks=Array.from({length:8},(_,i)=>b64.slice(i*csz,(i+1)*csz));
  const cVars=chunks.map(()=>N(7));
  const mask=Array.from({length:key.length},()=>randInt(1,254));
  const masked=key.map((b,i)=>(b^mask[i])&0xFF);
  const [mV,kV,bytesV,srcV,catV]=Array.from({length:5},()=>N(6));
  return [fakeIronBrew(),fakeMoonsec(),fakeLuraph(),
    ...chunks.map((c,i)=>`local ${cVars[i]}="${c}"`),
    `local ${mV}={${mask.join(',')}}`,`local ${kV}={${masked.join(',')}}`,
    `local _bx12=bit32 and bit32.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end`,
    `do for _i=1,#${kV} do ${kV}[_i]=_bx12(${kV}[_i],${mV}[_i]) end end`,
    `local ${catV}`,`do`,` local _p={${cVars.join(',')}}`,` ${catV}=table.concat(_p)`,`end`,
    b64DecoderSnippet(catV,bytesV),`local ${srcV}=nil`,
    rollingDecSnippet(bytesV,kV,srcV),sandboxedLoad(srcV),
  ].join('\n');
}

function vmLayer13(inner) {
  const key=randomKey(32),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  const [kV,dV,bV,stV,tV,srcV,iV]=Array.from({length:7},()=>N(6));
  const seed=randInt(0x1000,0xFFF0);
  
  const src2=Buffer.from(enc);
  let state=seed;
  const enc2=Array.from(src2,b=>{
    state=((state*1664525+1013904223)>>>0)&0xFFFFFFFF;
    return(b^(state&0xFF))&0xFF;
  });
  const b642=Buffer.from(enc2).toString('base64');
  return [fakeLuraph(),fakeWRD(),
    `local ${kV}={${key.join(',')}}`,
    `local ${dV}="${b642}"`,
    b64DecoderSnippet(dV,bV),
    `local ${stV}=${seed}`,
    `local ${tV}={}`,
    `for ${iV}=1,#${bV} do`,
    `local _bx13=bit32 and bit32.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end`,
    `local _bn13=bit32 and bit32.band or function(a,b) local r,s=0,1 while a>0 and b>0 do if a%2==1 and b%2==1 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end`,
    ` ${stV}=_bn13(${stV}*1664525+1013904223,0xFFFFFFFF)`,
    ` ${tV}[${iV}]=_bx13(${bV}[${iV}],_bn13(${stV},0xFF))`,
    `end`,
    rollingDecSnippet(`${tV}`,kV,srcV),
    sandboxedLoad(srcV),
  ].join('\n');
}

function vmLayer14(inner) {
  const key=randomKey(40),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  const [kV,dV,bV,srcV,ldN,fnV]=Array.from({length:6},()=>N(6));
  const lsChars=[108,111,97,100,115,116,114,105,110,103];
  const ldChars=[108,111,97,100];
  return [fakeMoonsec(),fakeIronBrew(),
    `local ${kV}={${key.join(',')}}`,`local ${dV}="${b64}"`,
    b64DecoderSnippet(dV,bV),
    rollingDecSnippet(bV,kV,srcV),
    `local ${ldN}=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(${lsChars.join(',')})) or rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(${ldChars.join(',')}))`,
    `if ${ldN} then`,
    ` local ${fnV}=${ldN}(${srcV})`,
    ` if type(${fnV})=="function" then`,
    `  if task and task.defer then task.defer(${fnV})`,
    `  else coroutine.wrap(${fnV})() end`,
    ` end`,
    `end`,
  ].join('\n');
}

function vmLayer15(inner) {
  const key=randomKey(36),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  const NUM_SLOTS=6+randInt(0,2);
  const slotSize=Math.ceil(b64.length/NUM_SLOTS);
  const slots=Array.from({length:NUM_SLOTS},(_,i)=>b64.slice(i*slotSize,(i+1)*slotSize));
  const [kV,bytesV,srcV,storeV,accV]=Array.from({length:5},()=>N(6));
  const slotVars=slots.map(()=>N(7));
  return [fakeLuraph(),fakeWRD(),
    `local ${kV}={${key.join(',')}}`,
    `local ${storeV}={}`,
    
    ...slots.map((s,i)=>`${storeV}[${i+1}]="${s}"`),
    `local ${accV}=table.concat(${storeV})`,
    b64DecoderSnippet(accV,bytesV),
    `local ${srcV}=nil`,
    rollingDecSnippet(bytesV,kV,srcV),
    sandboxedLoad(srcV),
  ].join('\n');
}

// ── TEA (Tiny Encryption Algorithm) cipher VM layer ────────────────
function vmLayer16(inner) {
  const key=randomKey(48),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  const [kV,dV,bytesV,srcV,deltaV]=Array.from({length:5},()=>N(6));
  // TEA constants
  const teaDelta=randInt(0x9000,0xFFFF);
  const teaRounds=randInt(4,8);
  const teaKey=Array.from({length:4},()=>randInt(1,0xFFFF));
  return [fakeMoonsec(),fakeIronBrew(),
    `local ${kV}={${key.join(',')}}`,`local ${dV}="${b64}"`,
    b64DecoderSnippet(dV,bytesV),
    // TEA-like transform applied to byte pairs before rolling dec
    // bit32 is required for shift ops; pure-Lua fallbacks provided for lshift/rshift/band/bxor
    `do`,
    `local _bx16=bit32 and bit32.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end`,
    `local _bn16=bit32 and bit32.band or function(a,b) a=a%4294967296;b=b%4294967296;local r,s=0,1 while a>0 and b>0 do if a%2==1 and b%2==1 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end`,
    `local _ls16=bit32 and bit32.lshift or function(a,n) return math.floor(a*(2^n))%4294967296 end`,
    `local _rs16=bit32 and bit32.rshift or function(a,n) return math.floor(a/2^n)%4294967296 end`,
    ` local _tk={${teaKey.join(',')}}`,
    ` local _delta=${teaDelta}`,
    ` for _i=1,#${bytesV}-1,2 do`,
    `  local _v0=${bytesV}[_i];local _v1=${bytesV}[_i+1]`,
    `  local _sum=0`,
    `  for _r=1,${teaRounds} do`,
    `   _sum=_bn16(_sum+_delta,0xFFFF)`,
    `   _v0=_bn16(_v0+_bx16(_ls16(_v1,4)+_tk[1],_v1+_sum,_rs16(_v1,5)+_tk[2]),0xFF)`,
    `   _v1=_bn16(_v1+_bx16(_ls16(_v0,4)+_tk[3],_v0+_sum,_rs16(_v0,5)+_tk[4]),0xFF)`,
    `  end`,
    `  ${bytesV}[_i]=_bx16(_v0,_v1)`,
    `  ${bytesV}[_i+1]=_bx16(_v1,_v0)`,
    ` end`,
    `end`,
    `local ${srcV}=nil`,
    rollingDecSnippet(bytesV,kV,srcV),
    sandboxedLoad(srcV),
  ].join('\n');
}

// ── RC4-style stream cipher VM layer ───────────────────────────────
function vmLayer17(inner) {
  const key=randomKey(44),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  const rc4Key=Array.from({length:randInt(8,16)},()=>randInt(0,255));
  const [kV,dV,bytesV,srcV,sV,tV]=Array.from({length:6},()=>N(6));
  return [fakeWRD(),fakeLuraph(),
    `local ${kV}={${key.join(',')}}`,`local ${dV}="${b64}"`,
    b64DecoderSnippet(dV,bytesV),
    // RC4 key scheduling
    `local ${sV}={}`,
    `local _rc4k={${rc4Key.join(',')}}`,
    `for _i=0,255 do ${sV}[_i]=_i end`,
    `local _j=0`,
    `for _i=0,255 do`,
    ` _j=(_j+${sV}[_i]+_rc4k[(_i%#_rc4k)+1])%256`,
    ` ${sV}[_i],${sV}[_j]=${sV}[_j],${sV}[_i]`,
    `end`,
    // RC4 PRGA XOR
    `local _ri,_rj=0,0`,
    `local ${tV}={}`,
    `for _idx=1,#${bytesV} do`,
    ` _ri=(_ri+1)%256`,
    ` _rj=(_rj+${sV}[_ri])%256`,
    ` ${sV}[_ri],${sV}[_rj]=${sV}[_rj],${sV}[_ri]`,
    ` local _k=${sV}[(${sV}[_ri]+${sV}[_rj])%256]`,
    `local _bx17=bit32 and bit32.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end`,
    ` ${tV}[_idx]=_bx17(${bytesV}[_idx],_k)`,
    `end`,
    `local ${srcV}=nil`,
    rollingDecSnippet(tV,kV,srcV),
    sandboxedLoad(srcV),
  ].join('\n');
}

// ── Multi-S-box substitution VM layer ──────────────────────────────
function vmLayer18(inner) {
  const key=randomKey(40),enc=rollingEnc(inner,key),b64=Buffer.from(enc).toString('base64');
  // Generate 2 random S-boxes (256-entry permutation tables)
  function makeSbox() {
    const s=Array.from({length:256},(_,i)=>i);
    for(let i=255;i>0;i--){const j=randInt(0,i);[s[i],s[j]]=[s[j],s[i]];}
    return s;
  }
  const sbox1=makeSbox(),sbox2=makeSbox();
  // Apply S-boxes to encrypted data
  const sboxed=enc.map(b=>sbox2[sbox1[b]]);
  const b64s=Buffer.from(sboxed).toString('base64');
  // Generate inverse S-boxes for runtime
  const inv1=new Array(256),inv2=new Array(256);
  for(let i=0;i<256;i++){inv1[sbox1[i]]=i;inv2[sbox2[i]]=i;}
  const [kV,dV,bytesV,srcV]=Array.from({length:4},()=>N(6));
  return [fakeMoonsec(),fakeWRD(),fakeLuraph(),
    `local ${kV}={${key.join(',')}}`,
    `local _inv2={${inv2.join(',')}}`,
    `local _inv1={${inv1.join(',')}}`,
    `local ${dV}="${b64s}"`,
    b64DecoderSnippet(dV,bytesV),
    // Reverse S-boxes
    `for _i=1,#${bytesV} do`,
    ` ${bytesV}[_i]=_inv1[_inv2[${bytesV}[_i]+1]+1]`,
    `end`,
    `local ${srcV}=nil`,
    rollingDecSnippet(bytesV,kV,srcV),
    sandboxedLoad(srcV),
  ].join('\n');
}

const LIGHT_GENERATORS=[vmLayer1,vmLayer2,vmLayer3,vmLayer9,vmLayer10,vmLayer13,vmLayer16,vmLayer17];
const HEAVY_GENERATORS=[vmLayer4,vmLayer5,vmLayer6,vmLayer7,vmLayer8,vmLayer11,vmLayer12,vmLayer14,vmLayer15,vmLayer16,vmLayer17,vmLayer18];

function applyVMLayers(code,count,srcBytes) {
  const sz=(typeof srcBytes==='number'&&srcBytes>0)?srcBytes:code.length;
  const pool=sz>=30*1024?HEAVY_GENERATORS:LIGHT_GENERATORS;
  let current=code;
  for(let i=0;i<count;i++){
    // Pick a random layer from the pool instead of sequential
    const idx=randInt(0,pool.length-1);
    current=pool[idx](current);
  }
  return current;
}

module.exports={applyVMLayers};
