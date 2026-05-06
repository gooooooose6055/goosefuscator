'use strict';

const { randomName, randInt } = require('./utils');
const crypto = require('crypto');

function makeEntropyBlock(sourceBytes = Infinity) {
let tables, entries;
if (sourceBytes < 500) { tables = 2; entries = 10; }
else if (sourceBytes < 2048) { tables = 2; entries = 30; }
else if (sourceBytes < 10240) { tables = 3; entries = 50; }
else if (sourceBytes < 51200) { tables = 3; entries = 100; }
else { tables = 4; entries = 150; }

const lines = ['if false then'];
for (let t = 0; t < tables; t++) {
const tname = '_0ET' + t + '_' + crypto.randomBytes(4).toString('hex');
const rows = Array.from({ length: entries }, () => {
const k = '_0' + crypto.randomBytes(32).toString('base64').replace(/[^a-zA-Z0-9]/g,'').slice(0,40);
const v = randInt(1, 65535);
return k + '=' + v;
});
lines.push(' local ' + tname + '={' + rows.join(',') + '}');
lines.push(' _ = ' + tname);
}
lines.push('end');
return lines.join('\n');
}

function generateSecurityHeader(sourceBytes = Infinity) {
const N = () => randomName(10);

const n = {};
const ns = [
'pcall_','bxor','killed','reason',

'genv','renv','hookFn','newCC','isCC','decomp','dumpStr',
'getBC','getClos','getCons','getUpv','getProto',
'readF','writeF','checkCl','ficlone',
'synNS','krnl','sent','flux',

'celery','oxygen','delta','electron','wave','trigon',
'coregui','eclipseE','carbon','linoria','simple',
'scriptware','xeno','studio','exploit',
'getAttr','setAttr','getConns','fireClnt','fireSvr',
'mouseLck','setClip','getClip','inputBlk','getObj',
'reqAsset','reqEnv','getIdent','getThread','getScr',
'setIdent','protScr','cacheRep','cloneRef','isExec',
'getModS','setModS','getStack','readVmem','writeVmem',

'getraw','gmt','ni_','idx_','callH','tsH','lenH',
'sharedT','smt',
'fakeT','canary1','fakeT2','canary2','fakeT3','canary3',
'rawEqOk','rawEqMT',
'envKey','envVal','envChk',

'getFenv','setFenv','fenvT','fenvMT',

'strC','strB','strD','strFmt',
'ld_',

'dbgInfo',

'dbg','hookR','hmodeR','hcntR','frInfo',

'dumpRes','scrRef',

'tickF','t0','loopV','dt',

'depth','depthR',

'coWrap','coRes',

'selfChk','selfSrc','selfRes',

'sfRes',

'tPack','tUnpack',

'killFn','trapCo','warnSil','prnSil',
];
ns.forEach(k => { n[k] = N(); });

const L = [];
const add = s => L.push(s);

add(`local ${n.pcall_}=pcall`);
add(`local ${n.killed}=false`);
add(`local ${n.reason}=""`);
add(`local ${n.bxor}`);
add(`do`);
add(` if bit32 and bit32.bxor then ${n.bxor}=bit32.bxor`);
add(` elseif bit and bit.bxor then ${n.bxor}=bit.bxor`);
add(` else ${n.bxor}=function(a,b)`);
add(` local r,s=0,1`);
add(` while a>0 or b>0 do`);
add(` if a%2~=b%2 then r=r+s end`);
add(` a=math.floor(a/2);b=math.floor(b/2);s=s*2`);
add(` end;return r`);
add(` end`);
add(` end`);
add(`end`);

function sc(str) {

const bytes = Array.from(str).map(c => c.charCodeAt(0));
return `string.char(${bytes.join(',')})`;
}

add(`do`);
add(` ${n.pcall_}(function()`);

const execApis = [
['genv', 'getgenv'],
['renv', 'getrenv'],
['hookFn', 'hookfunction'],
['newCC', 'newcclosure'],
['isCC', 'iscclosure'],
['decomp', 'decompile'],
['dumpStr', 'dumpstring'],
['getBC', 'getscriptbytecode'],
['getClos', 'getscriptclosure'],
['getCons', 'getconstants'],
['getUpv', 'getupvalues'],
['getProto', 'getprotos'],
['readF', 'readfile'],
['writeF', 'writefile'],
['checkCl', 'checkcaller'],
['ficlone', 'ficlone'],
['getAttr', 'getattribute'],
['setAttr', 'setattribute'],
['getConns', 'getconnections'],
['fireClnt', 'fireclient'],
['fireSvr', 'fireserver'],
['mouseLck', 'mouselockscrolldelta'],
['setClip', 'setclipboard'],
['getClip', 'getclipboard'],
['inputBlk', 'blockinput'],
['getObj', 'getobjects'],
['getIdent', 'getidentity'],
['setIdent', 'setidentity'],
['getThread', 'getthreadidentity'],
['protScr', 'protectscript'],
['cloneRef', 'cloneref'],
['isExec', 'isexecutorclosure'],
['getModS', 'getmodulestate'],
['setModS', 'setmodulestate'],
['getStack', 'getstack'],
['readVmem', 'readprocessmemory'],
['writeVmem', 'writeprocessmemory'],
['getScr', 'getscripts'],

['hookMM', 'hookmetamethod'],
['getHidP', 'gethiddenproperty'],
['setHidP', 'sethiddenproperty'],
['getRegex', 'getregistry'],
['getGC', 'getgc'],
['filterGC', 'filtergc'],
['getCalB', 'getcallbackvalue'],
['setCalB', 'setcallbackvalue'],
['getRunning', 'getrunningscripts'],
['getCoreS', 'getcorescript'],
['setFClos', 'setfunctionclosure'],
['replClos', 'replaceclosure'],
['synXHR', 'syn.request'],
['synProt', 'syn.protect'],
['httpGet', 'httpget'],
['httpPost', 'httppost'],
['isLClos', 'islclosure'],
['getInfo2', 'getscriptinfo'],
['getSenv', 'getsenv'], 
['getMenv', 'getmenv'], 
['getInst', 'getinstances'], 
['setNCI', 'setnoclipboard'],
['request2', 'request'], 
['getNameCall','getnamecallmethod'],
['setNameCall','setnamecallmethod'],
['isSysClos', 'issystemclosure'],
['cloneFunc', 'clonefunction'],
];

execApis.forEach(([vname, api]) => {
add(` local ${n[vname]}=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc(api)})`);
add(` if type(${n[vname]})=="function" then ${n.killed}=true;${n.reason}=${sc(api)} end`);
});

const execNS = [
['synNS', 'syn'],
['krnl', 'KRNL_LOADED'],
['sent', 'SENTINEL_V2'],
['flux', 'fluxus'],
['celery', 'celery'],
['oxygen', 'Oxygen'],
['delta', 'Delta'],
['electron', 'Electron'],
['wave', 'Wave'],
['trigon', 'trigon'],
['scriptware', 'scriptware'],
['xeno', 'Xeno'],
['exploit', 'exploit'],
['carbon', 'carbon'],
['simple', 'SimpleGui'],
['coregui', 'CoreGui'],

['solara', 'SOLARA_LOADED'],
['codex', 'CODEX_LOADED'],
['awp', 'AWP_LOADED'],
['elysian', 'ELYSIAN_LOADED'],
['vega', 'VEGA_LOADED'],
['hydroxide', 'Hydroxide'],
['sevault', 'SEVAULT'],
['ninjaV3', 'NinjaV3'],
['uncEnv', 'UNC_ENV'],
['senv', 'SENV'],
['evon', 'EVON_LOADED'],
['cName', 'cachedName'],
['dark', 'DARK_LOADED'],
];

execNS.forEach(([vname, api]) => {
add(` if rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc(api)})~=nil then ${n.killed}=true;${n.reason}=${sc('ns_'+api.toLowerCase())} end`);
});

add(` if rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('replaceclosure')})~=nil then ${n.killed}=true;${n.reason}=${sc('replaceclosure')} end`);

add(` local _genvF=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getgenv')})`);
add(` if type(_genvF)=="function" then`);
add(` local _ok,_ge=${n.pcall_}(_genvF)`);
add(` if _ok and type(_ge)=="table" and _ge~=_G then ${n.killed}=true;${n.reason}=${sc('genv_env')} end`);
add(` end`);

add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local ${n.getraw}=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getrawmetatable')})`);
add(` if type(${n.getraw})=="function" then`);
add(` local ${n.gmt}=${n.getraw}(_G)`);
add(` if ${n.gmt} then`);
add(` local ${n.ni_}=rawget(${n.gmt},${sc('__newindex')})`);
add(` local ${n.idx_}=rawget(${n.gmt},${sc('__index')})`);
add(` local ${n.callH}=rawget(${n.gmt},${sc('__call')})`);
add(` local ${n.tsH}=rawget(${n.gmt},${sc('__tostring')})`);
add(` local ${n.lenH}=rawget(${n.gmt},${sc('__len')})`);
add(` if ${n.ni_}~=nil or ${n.idx_}~=nil or ${n.callH}~=nil or ${n.lenH}~=nil then`);
add(` ${n.killed}=true;${n.reason}=${sc('gmt_hook')}`);
add(` end`);
add(` end`);
add(` local ${n.sharedT}=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('shared')})`);
add(` if type(${n.sharedT})=="table" then`);
add(` local ${n.smt}=${n.getraw}(${n.sharedT})`);
add(` if ${n.smt} and (rawget(${n.smt},${sc('__newindex')})~=nil or rawget(${n.smt},${sc('__index')})~=nil) then`);
add(` ${n.killed}=true;${n.reason}=${sc('shared_hook')}`);
add(` end`);
add(` end`);
add(` end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local ${n.envKey}=tostring(math.random(100000000,999999999))`);
add(` local ${n.envVal}=math.random(1000000,9999999)`);
add(` rawset(_G,${n.envKey},${n.envVal})`);
add(` local ${n.envChk}=rawget((type(getfenv)=="function" and getfenv(0) or _G),${n.envKey})`);
add(` if ${n.envChk}~=${n.envVal} then ${n.killed}=true;${n.reason}=${sc('env_intercept')} end`);
add(` rawset(_G,${n.envKey},nil)`);
add(` local _grm2=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getrawmetatable')})`);
add(` if type(_grm2)=="function" then`);
add(` local _gmt2=_grm2(_G)`);
add(` if _gmt2 and rawget(_gmt2,${sc('__newindex')})~=nil then`);
add(` ${n.killed}=true;${n.reason}=${sc('dynamic_ni')}`);
add(` end`);
add(` end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` if rawequal(${sc('x')},${sc('x')})~=true then ${n.killed}=true;${n.reason}=${sc('rawequal_tamper')} end`);
add(` if rawequal(1,2)~=false then ${n.killed}=true;${n.reason}=${sc('rawequal_false')} end`);
add(` local _grm3=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getrawmetatable')})`);
add(` if type(_grm3)=="function" then`);
add(` local _rmt3=_grm3(rawequal)`);
add(` if type(_rmt3)=="table" then ${n.killed}=true;${n.reason}=${sc('rawequal_mt')} end`);
add(` end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local ${n.fakeT}={}`);
add(` local ${n.canary1}=tostring(math.random(1e7,9e7))`);
add(` rawset(${n.fakeT},${n.canary1},${n.canary1})`);
add(` if rawget(${n.fakeT},${n.canary1})~=${n.canary1} then ${n.killed}=true;${n.reason}=${sc('canary1')} end`);
add(` local ${n.fakeT2}=setmetatable({},{})`);
add(` local ${n.canary2}=tostring(math.random(1e8,9e8))`);
add(` rawset(${n.fakeT2},${n.canary2},${n.canary2})`);
add(` if rawget(${n.fakeT2},${n.canary2})~=${n.canary2} then ${n.killed}=true;${n.reason}=${sc('canary2')} end`);
add(` local ${n.fakeT3}=setmetatable({},{__newindex=function(t,k,v) rawset(t,k,v) end})`);
add(` local ${n.canary3}=tostring(math.random(1e9,9e9))`);
add(` rawset(${n.fakeT3},${n.canary3},${n.canary3})`);
add(` if rawget(${n.fakeT3},${n.canary3})~=${n.canary3} then ${n.killed}=true;${n.reason}=${sc('canary3')} end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local ${n.getFenv}=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getfenv')})`);
add(` local ${n.setFenv}=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('setfenv')})`);
add(` if type(${n.getFenv})=="function" then`);
add(` local _ok,${n.fenvT}=${n.pcall_}(${n.getFenv},0)`);
add(` if _ok and type(${n.fenvT})=="table" then`);
add(` local ${n.fenvMT}=getmetatable(${n.fenvT})`);
add(` if type(${n.fenvMT})=="table" then`);
add(` if rawget(${n.fenvMT},${sc('__newindex')})~=nil or rawget(${n.fenvMT},${sc('__index')})~=nil then`);
add(` ${n.killed}=true;${n.reason}=${sc('fenv_hook')}`);
add(` end`);
add(` end`);
add(` end`);
add(` end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local ${n.strC}=rawget(string,${sc('char')})`);
add(` local ${n.strB}=rawget(string,${sc('byte')})`);
add(` local ${n.strFmt}=rawget(string,${sc('format')})`);
add(` if type(${n.strC})~=${sc('function')} or type(${n.strB})~=${sc('function')} or type(${n.strFmt})~=${sc('function')} then`);
add(` ${n.killed}=true;${n.reason}=${sc('str_tamper')}`);
add(` end`);
add(` local ${n.ld_}=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('load')}) or rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('loadstring')})`);
add(` if ${n.ld_}==nil then ${n.killed}=true;${n.reason}=${sc('load_nil')} end`);
add(` if debug and rawget(debug,${sc('getinfo')}) then`);
add(` ${n.pcall_}(function()`);
add(` local ${n.dbgInfo}=debug.getinfo(pcall,${sc('S')})`);
add(` if ${n.dbgInfo} and ${n.dbgInfo}.what~=${sc('C')} then ${n.killed}=true;${n.reason}=${sc('pcall_proxy')} end`);
add(` end)`);
add(` end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local ${n.dbg}=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('debug')}) or debug`);
add(` if ${n.dbg} then`);
add(` ${n.pcall_}(function()`);
add(` if type(rawget(${n.dbg},${sc('sethook')}))=="function" then ${n.dbg}.sethook() end`);
add(` end)`);
add(` if type(rawget(${n.dbg},${sc('gethook')}))=="function" then`);
add(` local ${n.hookR},${n.hmodeR},${n.hcntR}=${n.dbg}.gethook()`);
add(` if type(${n.hookR})=="function" then ${n.killed}=true;${n.reason}=${sc('hook_active')} end`);
add(` end`);
add(` if type(rawget(${n.dbg},${sc('getinfo')}))=="function" then`);
add(` local ${n.frInfo}=${n.dbg}.getinfo(1,${sc('S')})`);
add(` if ${n.frInfo} and ${n.frInfo}.what==${sc('C')} then ${n.killed}=true;${n.reason}=${sc('c_frame')} end`);
add(` end`);
add(` end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` if string and rawget(string,${sc('dump')}) then`);
add(` ${n.pcall_}(function() rawset(string,${sc('dump')},function()error("")end) end)`);
add(` end`);
add(` local ${n.scrRef}=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getscriptbytecode')})`);
add(` if type(${n.scrRef})=="function" then`);
add(` rawset(_G,${sc('getscriptbytecode')},function()error("")end)`);
add(` ${n.killed}=true;${n.reason}=${sc('bc_dump')}`);
add(` end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local ${n.tickF}=(rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('tick')}) and tick) or (os and os.clock and os.clock) or nil`);
add(` if ${n.tickF} then`);
add(` local ${n.t0}=${n.tickF}()`);
add(` local ${n.loopV}=0`);
add(` for _k=1,300 do ${n.loopV}=${n.loopV}+_k end`);
add(` local ${n.dt}=${n.tickF}()-${n.t0}`);
add(` if ${n.dt}~=nil and ${n.dt}>0.9 then ${n.killed}=true;${n.reason}=${sc('step_dbg')} end`);
add(` end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local ${n.depth}=0`);
add(` local function _depthProbe() ${n.depth}=${n.depth}+1; if ${n.depth}<4 then _depthProbe() end end`);
add(` ${n.pcall_}(_depthProbe)`);
add(` if ${n.depth}~=4 then ${n.killed}=true;${n.reason}=${sc('depth_tamper')} end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` if debug and rawget(debug,${sc('getinfo')}) then`);
add(` local ${n.coWrap}=debug.getinfo(coroutine.wrap,${sc('S')})`);
add(` if ${n.coWrap} and ${n.coWrap}.what~=${sc('C')} then`);
add(` ${n.killed}=true;${n.reason}=${sc('cowrap_proxy')}`);
add(` end`);
add(` end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _ld2=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('loadstring')}) or rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('load')})`);
add(` if type(_ld2)=="function" then`);
add(` local _ok2,_fn2=_ld2(${sc('return 1+1')})`);
add(` if not _ok2 or (type(_fn2)=="function" and _fn2()~=2) then`);
add(` ${n.killed}=true;${n.reason}=${sc('load_tamper')}`);
add(` end`);
add(` end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _sf=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('setfenv')})`);
add(` local _gf=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getfenv')})`);
add(` if type(_sf)=="function" and type(_gf)=="function" then`);
add(` local _dummy=function() end`);
add(` local _fakeEnv={_testKey=12345}`);
add(` ${n.pcall_}(_sf,_dummy,_fakeEnv)`);
add(` local _ok3,_got3=${n.pcall_}(_gf,_dummy)`);
add(` if _ok3 and type(_got3)=="table" and (_got3._testKey~=12345) then`);
add(` ${n.killed}=true;${n.reason}=${sc('setfenv_hook')}`);
add(` end`);
add(` end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local ${n.tPack}=rawget(table,${sc('pack')}) or rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('pack')})`);
add(` local ${n.tUnpack}=rawget(table,${sc('unpack')}) or rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('unpack')})`);
add(` if type(${n.tUnpack})=="function" then`);
add(` local _r1,_r2,_r3=${n.tUnpack}({10,20,30})`);
add(` if _r1~=10 or _r2~=20 or _r3~=30 then ${n.killed}=true;${n.reason}=${sc('unpack_tamper')} end`);
add(` end`);
add(` if type(${n.tPack})=="function" then`);
add(` local _pk=${n.tPack}(1,2,3)`);
add(` if type(_pk)~="table" or _pk[1]~=1 then ${n.killed}=true;${n.reason}=${sc('pack_tamper')} end`);
add(` end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _hop=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('hookop')})`);
add(` if type(_hop)=="function" then ${n.killed}=true;${n.reason}=${sc('hookop')} end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _isl=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('islclosure')})`);
add(` local _ld3=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('loadstring')}) or rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('load')})`);
add(` if type(_isl)=="function" and type(_ld3)=="function" then`);
add(` if _isl(_ld3) then ${n.killed}=true;${n.reason}=${sc('load_hooked')} end`);
add(` end`);
add(` local _tc=rawget(table,${sc('concat')})`);
add(` if type(_isl)=="function" and type(_tc)=="function" then`);
add(` if _isl(_tc) then ${n.killed}=true;${n.reason}=${sc('tconcat_hooked')} end`);
add(` end`);
add(` if type(_isl)=="function" and _isl(rawget) then ${n.killed}=true;${n.reason}=${sc('rawget_hooked')} end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _isl2=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('islclosure')})`);
add(` if type(_isl2)~="function" then return end`);
add(` if type(rawget(string,${sc('char')}))=="function" and _isl2(rawget(string,${sc('char')})) then ${n.killed}=true;${n.reason}=${sc('strchar_hooked')} end`);
add(` if type(rawget(string,${sc('byte')}))=="function" and _isl2(rawget(string,${sc('byte')})) then ${n.killed}=true;${n.reason}=${sc('strbyte_hooked')} end`);
add(` if type(rawget(table,${sc('concat')}))=="function" and _isl2(rawget(table,${sc('concat')})) then ${n.killed}=true;${n.reason}=${sc('tconcat_hooked2')} end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _grm2=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getrawmetatable')})`);
add(` if type(_grm2)=="function" then`);
add(` local _gmt2=_grm2(_G)`);
add(` if type(_gmt2)=="table" then`);
add(` if rawget(_gmt2,${sc('__index')})~=nil then ${n.killed}=true;${n.reason}=${sc('g_idx_hook')} end`);
add(` if rawget(_gmt2,${sc('__newindex')})~=nil then ${n.killed}=true;${n.reason}=${sc('g_ni_hook')} end`);
add(` if rawget(_gmt2,${sc('__namecall')})~=nil then ${n.killed}=true;${n.reason}=${sc('g_nc_hook')} end`);
add(` end`);
add(` end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _ncc=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('newcclosure')})`);
add(` local _hkf=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('hookfunction')})`);
add(` if type(_ncc)=="function" and type(_hkf)=="function" then`);
add(` ${n.killed}=true;${n.reason}=${sc('hook_env')}`);
add(` end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _chk=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('checkcaller')})`);
add(` if type(_chk)=="function" then`);
add(` local _ok,_r=${n.pcall_}(_chk)`);
add(` if _ok and _r==true then ${n.killed}=true;${n.reason}=${sc('checkcaller_mock')} end`);
add(` end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0Ft4BWKkFdj9,_0wkrYt5hDC8W,_0He25oOvaAGy=49722,58906,9248`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0wkrYt5hDC8W,_0He25oOvaAGy) elseif bit then _r=bit.bxor(_0wkrYt5hDC8W,_0He25oOvaAGy) else local a,b,r,s=_0wkrYt5hDC8W,_0He25oOvaAGy,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0Ft4BWKkFdj9 then ${n.killed}=true;${n.reason}=string.char(99,120,48) end end`);
add(` local _0s0GUyHHDapa,_0UVFVetK0MVL,_0gsDTOYW4j3e=4212,48093,43945`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0UVFVetK0MVL,_0gsDTOYW4j3e) elseif bit then _r=bit.bxor(_0UVFVetK0MVL,_0gsDTOYW4j3e) else local a,b,r,s=_0UVFVetK0MVL,_0gsDTOYW4j3e,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0s0GUyHHDapa then ${n.killed}=true;${n.reason}=string.char(99,120,49) end end`);
add(` local _0EKi1feoLP52,_0wLpFmfcsxzv,_0PNIZElupwsy=891,55751,55996`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0wLpFmfcsxzv,_0PNIZElupwsy) elseif bit then _r=bit.bxor(_0wLpFmfcsxzv,_0PNIZElupwsy) else local a,b,r,s=_0wLpFmfcsxzv,_0PNIZElupwsy,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0EKi1feoLP52 then ${n.killed}=true;${n.reason}=string.char(99,120,50) end end`);
add(` local _0vtPRDaCzFO6,_0pYyQ2iBlQDz,_0aGmZ5IDvraj=36615,51493,17954`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0pYyQ2iBlQDz,_0aGmZ5IDvraj) elseif bit then _r=bit.bxor(_0pYyQ2iBlQDz,_0aGmZ5IDvraj) else local a,b,r,s=_0pYyQ2iBlQDz,_0aGmZ5IDvraj,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0vtPRDaCzFO6 then ${n.killed}=true;${n.reason}=string.char(99,120,51) end end`);
add(` local _0E1cywzCLPFW,_0mqn6bVubkzB,_0IiVfkuyc3a6=12008,8701,3861`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0mqn6bVubkzB,_0IiVfkuyc3a6) elseif bit then _r=bit.bxor(_0mqn6bVubkzB,_0IiVfkuyc3a6) else local a,b,r,s=_0mqn6bVubkzB,_0IiVfkuyc3a6,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0E1cywzCLPFW then ${n.killed}=true;${n.reason}=string.char(99,120,52) end end`);
add(` local _0lgf5ey3tvIL,_0PnCNEQ4PuV_,_0PrhCHpTbNVX=43219,51296,24755`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0PnCNEQ4PuV_,_0PrhCHpTbNVX) elseif bit then _r=bit.bxor(_0PnCNEQ4PuV_,_0PrhCHpTbNVX) else local a,b,r,s=_0PnCNEQ4PuV_,_0PrhCHpTbNVX,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0lgf5ey3tvIL then ${n.killed}=true;${n.reason}=string.char(99,120,53) end end`);
add(` local _0wNqIo6_XTSx,_0OQI5gYCwjYL,_0aOpFZNSXvkH=48167,45165,3146`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0OQI5gYCwjYL,_0aOpFZNSXvkH) elseif bit then _r=bit.bxor(_0OQI5gYCwjYL,_0aOpFZNSXvkH) else local a,b,r,s=_0OQI5gYCwjYL,_0aOpFZNSXvkH,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0wNqIo6_XTSx then ${n.killed}=true;${n.reason}=string.char(99,120,54) end end`);
add(` local _0KcjkVoDJ6mr,_0JncnPYjZn3X,_0n0PoOBYpr2F=4924,14200,9284`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0JncnPYjZn3X,_0n0PoOBYpr2F) elseif bit then _r=bit.bxor(_0JncnPYjZn3X,_0n0PoOBYpr2F) else local a,b,r,s=_0JncnPYjZn3X,_0n0PoOBYpr2F,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0KcjkVoDJ6mr then ${n.killed}=true;${n.reason}=string.char(99,120,55) end end`);
add(` local _0To7yTWl2VJf,_0tzkVrYNDcG1,_0Fd8wNCzfyVM=37139,5496,33899`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0tzkVrYNDcG1,_0Fd8wNCzfyVM) elseif bit then _r=bit.bxor(_0tzkVrYNDcG1,_0Fd8wNCzfyVM) else local a,b,r,s=_0tzkVrYNDcG1,_0Fd8wNCzfyVM,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0To7yTWl2VJf then ${n.killed}=true;${n.reason}=string.char(99,120,56) end end`);
add(` local _0GjjJDFMXnfI,_0JDffEYABokJ,_0VyHWsUDhhVm=53078,51748,1394`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0JDffEYABokJ,_0VyHWsUDhhVm) elseif bit then _r=bit.bxor(_0JDffEYABokJ,_0VyHWsUDhhVm) else local a,b,r,s=_0JDffEYABokJ,_0VyHWsUDhhVm,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0GjjJDFMXnfI then ${n.killed}=true;${n.reason}=string.char(99,120,57) end end`);
add(` local _0TRMpnLl4He9,_0UdjvZozio0C,_0uZJmjfDhVTE=42306,17287,59077`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0UdjvZozio0C,_0uZJmjfDhVTE) elseif bit then _r=bit.bxor(_0UdjvZozio0C,_0uZJmjfDhVTE) else local a,b,r,s=_0UdjvZozio0C,_0uZJmjfDhVTE,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0TRMpnLl4He9 then ${n.killed}=true;${n.reason}=string.char(99,120,49,48) end end`);
add(` local _0Zoh_yMRIh9H,_0UiDHdK7mZ1L,_0sbnQ9nmKmU4=35702,57124,21586`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0UiDHdK7mZ1L,_0sbnQ9nmKmU4) elseif bit then _r=bit.bxor(_0UiDHdK7mZ1L,_0sbnQ9nmKmU4) else local a,b,r,s=_0UiDHdK7mZ1L,_0sbnQ9nmKmU4,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0Zoh_yMRIh9H then ${n.killed}=true;${n.reason}=string.char(99,120,49,49) end end`);
add(` local _0swueCXvc7Iz,_0D2RUShadMNZ,_0svk0khBpVU3=27542,19928,9806`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0D2RUShadMNZ,_0svk0khBpVU3) elseif bit then _r=bit.bxor(_0D2RUShadMNZ,_0svk0khBpVU3) else local a,b,r,s=_0D2RUShadMNZ,_0svk0khBpVU3,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0swueCXvc7Iz then ${n.killed}=true;${n.reason}=string.char(99,120,49,50) end end`);
add(` local _0PeySwyE8u0f,_0cMC18qdv0Gx,_0taArOKTLmV4=25147,32736,7643`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0cMC18qdv0Gx,_0taArOKTLmV4) elseif bit then _r=bit.bxor(_0cMC18qdv0Gx,_0taArOKTLmV4) else local a,b,r,s=_0cMC18qdv0Gx,_0taArOKTLmV4,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0PeySwyE8u0f then ${n.killed}=true;${n.reason}=string.char(99,120,49,51) end end`);
add(` local _0cW4sHeWcSVT,_0tGv4mozvZNk,_0hJSBUCBfoOt=24873,22777,14800`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0tGv4mozvZNk,_0hJSBUCBfoOt) elseif bit then _r=bit.bxor(_0tGv4mozvZNk,_0hJSBUCBfoOt) else local a,b,r,s=_0tGv4mozvZNk,_0hJSBUCBfoOt,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0cW4sHeWcSVT then ${n.killed}=true;${n.reason}=string.char(99,120,49,52) end end`);
add(` local _0XNPU4PwVl99,_0hzFkepjjiOD,_0fp4NpFsYA7u=15275,16466,31737`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0hzFkepjjiOD,_0fp4NpFsYA7u) elseif bit then _r=bit.bxor(_0hzFkepjjiOD,_0fp4NpFsYA7u) else local a,b,r,s=_0hzFkepjjiOD,_0fp4NpFsYA7u,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0XNPU4PwVl99 then ${n.killed}=true;${n.reason}=string.char(99,120,49,53) end end`);
add(` local _0PxVWOZLXNqe,_0smBW1r_WUi0,_0wBvBDfZiXky=22394,27042,16088`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0smBW1r_WUi0,_0wBvBDfZiXky) elseif bit then _r=bit.bxor(_0smBW1r_WUi0,_0wBvBDfZiXky) else local a,b,r,s=_0smBW1r_WUi0,_0wBvBDfZiXky,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0PxVWOZLXNqe then ${n.killed}=true;${n.reason}=string.char(99,120,49,54) end end`);
add(` local _0aE7oj5Ytw2d,_0JUxmRq_cGG7,_0ZqR1NJFYQp3=4857,24900,29629`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0JUxmRq_cGG7,_0ZqR1NJFYQp3) elseif bit then _r=bit.bxor(_0JUxmRq_cGG7,_0ZqR1NJFYQp3) else local a,b,r,s=_0JUxmRq_cGG7,_0ZqR1NJFYQp3,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0aE7oj5Ytw2d then ${n.killed}=true;${n.reason}=string.char(99,120,49,55) end end`);
add(` local _0Tvqh9QHu62o,_0nb_3HeapBSI,_0JPtnYVKqaiZ=31055,53986,43949`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0nb_3HeapBSI,_0JPtnYVKqaiZ) elseif bit then _r=bit.bxor(_0nb_3HeapBSI,_0JPtnYVKqaiZ) else local a,b,r,s=_0nb_3HeapBSI,_0JPtnYVKqaiZ,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0Tvqh9QHu62o then ${n.killed}=true;${n.reason}=string.char(99,120,49,56) end end`);
add(` local _0tFHQVwpABhL,_0z4Tq0HxnLWK,_0zJF4bpL_vaO=10863,23575,30328`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0z4Tq0HxnLWK,_0zJF4bpL_vaO) elseif bit then _r=bit.bxor(_0z4Tq0HxnLWK,_0zJF4bpL_vaO) else local a,b,r,s=_0z4Tq0HxnLWK,_0zJF4bpL_vaO,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0tFHQVwpABhL then ${n.killed}=true;${n.reason}=string.char(99,120,49,57) end end`);
add(` local _0TsVLD5SCYP1,_0gjl5HxNeJ2T,_0XexFlUm_Vet=18410,51957,36127`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0gjl5HxNeJ2T,_0XexFlUm_Vet) elseif bit then _r=bit.bxor(_0gjl5HxNeJ2T,_0XexFlUm_Vet) else local a,b,r,s=_0gjl5HxNeJ2T,_0XexFlUm_Vet,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0TsVLD5SCYP1 then ${n.killed}=true;${n.reason}=string.char(99,120,50,48) end end`);
add(` local _0DrkxNXGAbHl,_0eyJp0lZkuXF,_0x_ejxrExPqi=39653,3310,38411`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0eyJp0lZkuXF,_0x_ejxrExPqi) elseif bit then _r=bit.bxor(_0eyJp0lZkuXF,_0x_ejxrExPqi) else local a,b,r,s=_0eyJp0lZkuXF,_0x_ejxrExPqi,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0DrkxNXGAbHl then ${n.killed}=true;${n.reason}=string.char(99,120,50,49) end end`);
add(` local _0vmGB3Nboqz3,_0hK8XZzhG9yc,_0iPEOIiyIZJd=14956,27811,22223`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0hK8XZzhG9yc,_0iPEOIiyIZJd) elseif bit then _r=bit.bxor(_0hK8XZzhG9yc,_0iPEOIiyIZJd) else local a,b,r,s=_0hK8XZzhG9yc,_0iPEOIiyIZJd,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0vmGB3Nboqz3 then ${n.killed}=true;${n.reason}=string.char(99,120,50,50) end end`);
add(` local _0lofEX_ECAbI,_0CHJcJ5iJV1o,_0cI6Q1HTTAgz=9867,21388,29959`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0CHJcJ5iJV1o,_0cI6Q1HTTAgz) elseif bit then _r=bit.bxor(_0CHJcJ5iJV1o,_0cI6Q1HTTAgz) else local a,b,r,s=_0CHJcJ5iJV1o,_0cI6Q1HTTAgz,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0lofEX_ECAbI then ${n.killed}=true;${n.reason}=string.char(99,120,50,51) end end`);
add(` local _0zc2q6gAGiDN,_0lFO7mkY7ZYi,_0OPX97vj6Xob=881,11776,11633`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0lFO7mkY7ZYi,_0OPX97vj6Xob) elseif bit then _r=bit.bxor(_0lFO7mkY7ZYi,_0OPX97vj6Xob) else local a,b,r,s=_0lFO7mkY7ZYi,_0OPX97vj6Xob,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0zc2q6gAGiDN then ${n.killed}=true;${n.reason}=string.char(99,120,50,52) end end`);
add(` local _0gMS7mQCPjp0,_0XXsMG7sZ_Vd,_0kdmcFS0GLHD=14596,41192,39404`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0XXsMG7sZ_Vd,_0kdmcFS0GLHD) elseif bit then _r=bit.bxor(_0XXsMG7sZ_Vd,_0kdmcFS0GLHD) else local a,b,r,s=_0XXsMG7sZ_Vd,_0kdmcFS0GLHD,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0gMS7mQCPjp0 then ${n.killed}=true;${n.reason}=string.char(99,120,50,53) end end`);
add(` local _0CZHiJiRq9vm,_0WXIw40awV_F,_0j0bsIhZblWN=29704,26768,7320`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0WXIw40awV_F,_0j0bsIhZblWN) elseif bit then _r=bit.bxor(_0WXIw40awV_F,_0j0bsIhZblWN) else local a,b,r,s=_0WXIw40awV_F,_0j0bsIhZblWN,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0CZHiJiRq9vm then ${n.killed}=true;${n.reason}=string.char(99,120,50,54) end end`);
add(` local _0WNzt0KLkbN6,_0rnRggjNjuA4,_0nDMnWxGU3uM=22372,5512,17132`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0rnRggjNjuA4,_0nDMnWxGU3uM) elseif bit then _r=bit.bxor(_0rnRggjNjuA4,_0nDMnWxGU3uM) else local a,b,r,s=_0rnRggjNjuA4,_0nDMnWxGU3uM,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0WNzt0KLkbN6 then ${n.killed}=true;${n.reason}=string.char(99,120,50,55) end end`);
add(` local _0AzWC5QSO2bv,_0pFOBzpxgWSr,_0PcTs9h8AVyk=13280,10818,6562`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0pFOBzpxgWSr,_0PcTs9h8AVyk) elseif bit then _r=bit.bxor(_0pFOBzpxgWSr,_0PcTs9h8AVyk) else local a,b,r,s=_0pFOBzpxgWSr,_0PcTs9h8AVyk,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0AzWC5QSO2bv then ${n.killed}=true;${n.reason}=string.char(99,120,50,56) end end`);
add(` local _0yzNNnLD2yW4,_0OYOvHW6jZz9,_0E6XXPT1H3mi=22306,19648,7138`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0OYOvHW6jZz9,_0E6XXPT1H3mi) elseif bit then _r=bit.bxor(_0OYOvHW6jZz9,_0E6XXPT1H3mi) else local a,b,r,s=_0OYOvHW6jZz9,_0E6XXPT1H3mi,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0yzNNnLD2yW4 then ${n.killed}=true;${n.reason}=string.char(99,120,50,57) end end`);
add(` local _0j1UKftAPCin,_0zcTofvpdyBE,_0vuugzw1HUiI=5261,30901,27704`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0zcTofvpdyBE,_0vuugzw1HUiI) elseif bit then _r=bit.bxor(_0zcTofvpdyBE,_0vuugzw1HUiI) else local a,b,r,s=_0zcTofvpdyBE,_0vuugzw1HUiI,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0j1UKftAPCin then ${n.killed}=true;${n.reason}=string.char(99,120,51,48) end end`);
add(` local _0B8JK9vFxneL,_0DMZlbHeiJr2,_0ruplP1cRgW9=7215,36374,37433`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0DMZlbHeiJr2,_0ruplP1cRgW9) elseif bit then _r=bit.bxor(_0DMZlbHeiJr2,_0ruplP1cRgW9) else local a,b,r,s=_0DMZlbHeiJr2,_0ruplP1cRgW9,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0B8JK9vFxneL then ${n.killed}=true;${n.reason}=string.char(99,120,51,49) end end`);
add(` local _0uw4gpTVxvA_,_0bq0pjDgL6xo,_0eaxvGJH8tKW=21085,29959,10074`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0bq0pjDgL6xo,_0eaxvGJH8tKW) elseif bit then _r=bit.bxor(_0bq0pjDgL6xo,_0eaxvGJH8tKW) else local a,b,r,s=_0bq0pjDgL6xo,_0eaxvGJH8tKW,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0uw4gpTVxvA_ then ${n.killed}=true;${n.reason}=string.char(99,120,51,50) end end`);
add(` local _0SIcGlG52pO4,_0BJjChvC0dvR,_0ZPpxLFlKQTN=46631,37927,8704`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0BJjChvC0dvR,_0ZPpxLFlKQTN) elseif bit then _r=bit.bxor(_0BJjChvC0dvR,_0ZPpxLFlKQTN) else local a,b,r,s=_0BJjChvC0dvR,_0ZPpxLFlKQTN,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0SIcGlG52pO4 then ${n.killed}=true;${n.reason}=string.char(99,120,51,51) end end`);
add(` local _0GN0dGI7LCIx,_0P_XdsCEQzgu,_0p9HGspXABLD=31797,13220,20369`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0P_XdsCEQzgu,_0p9HGspXABLD) elseif bit then _r=bit.bxor(_0P_XdsCEQzgu,_0p9HGspXABLD) else local a,b,r,s=_0P_XdsCEQzgu,_0p9HGspXABLD,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0GN0dGI7LCIx then ${n.killed}=true;${n.reason}=string.char(99,120,51,52) end end`);
add(` local _0jkGMmZlYcs2,_0MyF8BeAZc20,_0JvABvfxVmoO=30125,56630,43163`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0MyF8BeAZc20,_0JvABvfxVmoO) elseif bit then _r=bit.bxor(_0MyF8BeAZc20,_0JvABvfxVmoO) else local a,b,r,s=_0MyF8BeAZc20,_0JvABvfxVmoO,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0jkGMmZlYcs2 then ${n.killed}=true;${n.reason}=string.char(99,120,51,53) end end`);
add(` local _0e34JhZG8TJU,_0rvOlvrWRL_h,_0j50nKDYLn3B=30355,58492,37615`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0rvOlvrWRL_h,_0j50nKDYLn3B) elseif bit then _r=bit.bxor(_0rvOlvrWRL_h,_0j50nKDYLn3B) else local a,b,r,s=_0rvOlvrWRL_h,_0j50nKDYLn3B,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0e34JhZG8TJU then ${n.killed}=true;${n.reason}=string.char(99,120,51,54) end end`);
add(` local _0hDwcMYNn01j,_0qhZKBMT5_Zd,_0NcwLv8AZPIf=42967,9655,33376`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0qhZKBMT5_Zd,_0NcwLv8AZPIf) elseif bit then _r=bit.bxor(_0qhZKBMT5_Zd,_0NcwLv8AZPIf) else local a,b,r,s=_0qhZKBMT5_Zd,_0NcwLv8AZPIf,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0hDwcMYNn01j then ${n.killed}=true;${n.reason}=string.char(99,120,51,55) end end`);
add(` local _0QW0pIJcRDn5,_0u0DUPUFrL6G,_0Ly6qmpDSsT_=60959,10502,50969`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0u0DUPUFrL6G,_0Ly6qmpDSsT_) elseif bit then _r=bit.bxor(_0u0DUPUFrL6G,_0Ly6qmpDSsT_) else local a,b,r,s=_0u0DUPUFrL6G,_0Ly6qmpDSsT_,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0QW0pIJcRDn5 then ${n.killed}=true;${n.reason}=string.char(99,120,51,56) end end`);
add(` local _0SsdOcggpK5O,_0GcQEgDNefX9,_0QbjnBkM8xGQ=29550,24116,11610`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0GcQEgDNefX9,_0QbjnBkM8xGQ) elseif bit then _r=bit.bxor(_0GcQEgDNefX9,_0QbjnBkM8xGQ) else local a,b,r,s=_0GcQEgDNefX9,_0QbjnBkM8xGQ,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0SsdOcggpK5O then ${n.killed}=true;${n.reason}=string.char(99,120,51,57) end end`);
add(` local _0sHSemSft5_l,_0sjyARXfO920,_0Wn_t_oquFsO=49231,5313,54414`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0sjyARXfO920,_0Wn_t_oquFsO) elseif bit then _r=bit.bxor(_0sjyARXfO920,_0Wn_t_oquFsO) else local a,b,r,s=_0sjyARXfO920,_0Wn_t_oquFsO,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0sHSemSft5_l then ${n.killed}=true;${n.reason}=string.char(99,120,52,48) end end`);
add(` local _0Og6UYpKcyJb,_0w5regzfcwD9,_0mByMR_XXKKY=38089,34635,4994`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0w5regzfcwD9,_0mByMR_XXKKY) elseif bit then _r=bit.bxor(_0w5regzfcwD9,_0mByMR_XXKKY) else local a,b,r,s=_0w5regzfcwD9,_0mByMR_XXKKY,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0Og6UYpKcyJb then ${n.killed}=true;${n.reason}=string.char(99,120,52,49) end end`);
add(` local _0Ko3NgyyWgAy,_0A5uDQyOtCVk,_0nTOoGEQMBYk=10308,3403,9487`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0A5uDQyOtCVk,_0nTOoGEQMBYk) elseif bit then _r=bit.bxor(_0A5uDQyOtCVk,_0nTOoGEQMBYk) else local a,b,r,s=_0A5uDQyOtCVk,_0nTOoGEQMBYk,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0Ko3NgyyWgAy then ${n.killed}=true;${n.reason}=string.char(99,120,52,50) end end`);
add(` local _0Qm4PGM4_clk,_0Hz2qkHPpNQE,_0muJsioDIxiS=1545,48293,47788`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0Hz2qkHPpNQE,_0muJsioDIxiS) elseif bit then _r=bit.bxor(_0Hz2qkHPpNQE,_0muJsioDIxiS) else local a,b,r,s=_0Hz2qkHPpNQE,_0muJsioDIxiS,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0Qm4PGM4_clk then ${n.killed}=true;${n.reason}=string.char(99,120,52,51) end end`);
add(` local _0ns43LvKbA1v,_0Q2dSpxycPjA,_0tfU2Bz9Pwv7=42804,25593,50381`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0Q2dSpxycPjA,_0tfU2Bz9Pwv7) elseif bit then _r=bit.bxor(_0Q2dSpxycPjA,_0tfU2Bz9Pwv7) else local a,b,r,s=_0Q2dSpxycPjA,_0tfU2Bz9Pwv7,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0ns43LvKbA1v then ${n.killed}=true;${n.reason}=string.char(99,120,52,52) end end`);
add(` local _0bGo789kkfyX,_0pbEHIJWyN7J,_0lcnG0X_H7Bc=31905,30500,2949`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0pbEHIJWyN7J,_0lcnG0X_H7Bc) elseif bit then _r=bit.bxor(_0pbEHIJWyN7J,_0lcnG0X_H7Bc) else local a,b,r,s=_0pbEHIJWyN7J,_0lcnG0X_H7Bc,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0bGo789kkfyX then ${n.killed}=true;${n.reason}=string.char(99,120,52,53) end end`);
add(` local _0uP7Jg5rganM,_0gaCE6MRJ1qc,_0PjZGRuFQMqF=22765,59767,45466`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0gaCE6MRJ1qc,_0PjZGRuFQMqF) elseif bit then _r=bit.bxor(_0gaCE6MRJ1qc,_0PjZGRuFQMqF) else local a,b,r,s=_0gaCE6MRJ1qc,_0PjZGRuFQMqF,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0uP7Jg5rganM then ${n.killed}=true;${n.reason}=string.char(99,120,52,54) end end`);
add(` local _0f0dguTA7E1o,_0Gq0eJHQQQcm,_0J8oOXSFYVoM=54167,40706,19605`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0Gq0eJHQQQcm,_0J8oOXSFYVoM) elseif bit then _r=bit.bxor(_0Gq0eJHQQQcm,_0J8oOXSFYVoM) else local a,b,r,s=_0Gq0eJHQQQcm,_0J8oOXSFYVoM,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0f0dguTA7E1o then ${n.killed}=true;${n.reason}=string.char(99,120,52,55) end end`);
add(` local _0LFS482vZ3b7,_0QgreJJrJBMz,_0IIjSbWaNUQb=64925,46621,19328`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0QgreJJrJBMz,_0IIjSbWaNUQb) elseif bit then _r=bit.bxor(_0QgreJJrJBMz,_0IIjSbWaNUQb) else local a,b,r,s=_0QgreJJrJBMz,_0IIjSbWaNUQb,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0LFS482vZ3b7 then ${n.killed}=true;${n.reason}=string.char(99,120,52,56) end end`);
add(` local _0yd9hcELHNHd,_0jMoOp8gu4LW,_0WcPmPWonw8Z=18380,50964,32984`);
add(` do local _r;if bit32 then _r=bit32.bxor(_0jMoOp8gu4LW,_0WcPmPWonw8Z) elseif bit then _r=bit.bxor(_0jMoOp8gu4LW,_0WcPmPWonw8Z) else local a,b,r,s=_0jMoOp8gu4LW,_0WcPmPWonw8Z,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0yd9hcELHNHd then ${n.killed}=true;${n.reason}=string.char(99,120,52,57) end end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _isl4=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(105,115,108,99,108,111,115,117,114,101))`);
add(` if type(_isl4)~="function" then return end`);
add(` local _0abz4ShS603I=rawget(math or {},string.char(97,98,115))`);
add(` if type(_0abz4ShS603I)=="function" and _isl4(_0abz4ShS603I) then ${n.killed}=true;${n.reason}=string.char(109,97,116,104,95,97,98,115,95,104) end`);
add(` local _0HJ9k_Ik1KuL=rawget(math or {},string.char(102,108,111,111,114))`);
add(` if type(_0HJ9k_Ik1KuL)=="function" and _isl4(_0HJ9k_Ik1KuL) then ${n.killed}=true;${n.reason}=string.char(109,97,116,104,95,102,108,111,111,114,95,104) end`);
add(` local _0EYufdtFaW_C=rawget(math or {},string.char(99,101,105,108))`);
add(` if type(_0EYufdtFaW_C)=="function" and _isl4(_0EYufdtFaW_C) then ${n.killed}=true;${n.reason}=string.char(109,97,116,104,95,99,101,105,108,95,104) end`);
add(` local _0cihuntWUmsf=rawget(math or {},string.char(115,113,114,116))`);
add(` if type(_0cihuntWUmsf)=="function" and _isl4(_0cihuntWUmsf) then ${n.killed}=true;${n.reason}=string.char(109,97,116,104,95,115,113,114,116,95,104) end`);
add(` local _0tPbDQTmjksi=rawget(math or {},string.char(115,105,110))`);
add(` if type(_0tPbDQTmjksi)=="function" and _isl4(_0tPbDQTmjksi) then ${n.killed}=true;${n.reason}=string.char(109,97,116,104,95,115,105,110,95,104) end`);
add(` local _0s_x9mhd06_q=rawget(math or {},string.char(99,111,115))`);
add(` if type(_0s_x9mhd06_q)=="function" and _isl4(_0s_x9mhd06_q) then ${n.killed}=true;${n.reason}=string.char(109,97,116,104,95,99,111,115,95,104) end`);
add(` local _0UOM0Qjnmnvl=rawget(math or {},string.char(114,97,110,100,111,109))`);
add(` if type(_0UOM0Qjnmnvl)=="function" and _isl4(_0UOM0Qjnmnvl) then ${n.killed}=true;${n.reason}=string.char(109,97,116,104,95,114,97,110,100,111,109,95,104) end`);
add(` local _0SzFRlgsyVIX=rawget(math or {},string.char(109,97,120))`);
add(` if type(_0SzFRlgsyVIX)=="function" and _isl4(_0SzFRlgsyVIX) then ${n.killed}=true;${n.reason}=string.char(109,97,116,104,95,109,97,120,95,104) end`);
add(` local _0VgP31sxXPwR=rawget(math or {},string.char(109,105,110))`);
add(` if type(_0VgP31sxXPwR)=="function" and _isl4(_0VgP31sxXPwR) then ${n.killed}=true;${n.reason}=string.char(109,97,116,104,95,109,105,110,95,104) end`);
add(` local _0VIfd8K7v0Jm=rawget(string or {},string.char(108,101,110))`);
add(` if type(_0VIfd8K7v0Jm)=="function" and _isl4(_0VIfd8K7v0Jm) then ${n.killed}=true;${n.reason}=string.char(115,116,114,105,110,103,95,108,101,110,95,104) end`);
add(` local _0CqsrWwI22xI=rawget(string or {},string.char(115,117,98))`);
add(` if type(_0CqsrWwI22xI)=="function" and _isl4(_0CqsrWwI22xI) then ${n.killed}=true;${n.reason}=string.char(115,116,114,105,110,103,95,115,117,98,95,104) end`);
add(` local _0pDZCJ3o2Gf1=rawget(string or {},string.char(114,101,112))`);
add(` if type(_0pDZCJ3o2Gf1)=="function" and _isl4(_0pDZCJ3o2Gf1) then ${n.killed}=true;${n.reason}=string.char(115,116,114,105,110,103,95,114,101,112,95,104) end`);
add(` local _0co1JK5jJo_I=rawget(string or {},string.char(114,101,118,101,114,115,101))`);
add(` if type(_0co1JK5jJo_I)=="function" and _isl4(_0co1JK5jJo_I) then ${n.killed}=true;${n.reason}=string.char(115,116,114,105,110,103,95,114,101,118,101,114,115,101,95,104) end`);
add(` local _0cV1cjVTyMOT=rawget(string or {},string.char(117,112,112,101,114))`);
add(` if type(_0cV1cjVTyMOT)=="function" and _isl4(_0cV1cjVTyMOT) then ${n.killed}=true;${n.reason}=string.char(115,116,114,105,110,103,95,117,112,112,101,114,95,104) end`);
add(` local _0GNCl7UYFEnb=rawget(string or {},string.char(108,111,119,101,114))`);
add(` if type(_0GNCl7UYFEnb)=="function" and _isl4(_0GNCl7UYFEnb) then ${n.killed}=true;${n.reason}=string.char(115,116,114,105,110,103,95,108,111,119,101,114,95,104) end`);
add(` local _0gGvnqRpd2ym=rawget(string or {},string.char(102,105,110,100))`);
add(` if type(_0gGvnqRpd2ym)=="function" and _isl4(_0gGvnqRpd2ym) then ${n.killed}=true;${n.reason}=string.char(115,116,114,105,110,103,95,102,105,110,100,95,104) end`);
add(` local _0zxJbXTAoMLt=rawget(string or {},string.char(109,97,116,99,104))`);
add(` if type(_0zxJbXTAoMLt)=="function" and _isl4(_0zxJbXTAoMLt) then ${n.killed}=true;${n.reason}=string.char(115,116,114,105,110,103,95,109,97,116,99,104,95,104) end`);
add(` local _0CBFIX078ycy=rawget(string or {},string.char(103,115,117,98))`);
add(` if type(_0CBFIX078ycy)=="function" and _isl4(_0CBFIX078ycy) then ${n.killed}=true;${n.reason}=string.char(115,116,114,105,110,103,95,103,115,117,98,95,104) end`);
add(` local _0cmVMLYJ2Md4=rawget(string or {},string.char(103,109,97,116,99,104))`);
add(` if type(_0cmVMLYJ2Md4)=="function" and _isl4(_0cmVMLYJ2Md4) then ${n.killed}=true;${n.reason}=string.char(115,116,114,105,110,103,95,103,109,97,116,99,104,95,104) end`);
add(` local _0KWVoA1H1b62=rawget(string or {},string.char(102,111,114,109,97,116))`);
add(` if type(_0KWVoA1H1b62)=="function" and _isl4(_0KWVoA1H1b62) then ${n.killed}=true;${n.reason}=string.char(115,116,114,105,110,103,95,102,111,114,109,97,116,95,104) end`);
add(` local _0Aop4c1uuiB1=rawget(table or {},string.char(105,110,115,101,114,116))`);
add(` if type(_0Aop4c1uuiB1)=="function" and _isl4(_0Aop4c1uuiB1) then ${n.killed}=true;${n.reason}=string.char(116,97,98,108,101,95,105,110,115,101,114,116,95,104) end`);
add(` local _0ZAUxJa0twKD=rawget(table or {},string.char(114,101,109,111,118,101))`);
add(` if type(_0ZAUxJa0twKD)=="function" and _isl4(_0ZAUxJa0twKD) then ${n.killed}=true;${n.reason}=string.char(116,97,98,108,101,95,114,101,109,111,118,101,95,104) end`);
add(` local _0T7OP6hBYgbR=rawget(table or {},string.char(115,111,114,116))`);
add(` if type(_0T7OP6hBYgbR)=="function" and _isl4(_0T7OP6hBYgbR) then ${n.killed}=true;${n.reason}=string.char(116,97,98,108,101,95,115,111,114,116,95,104) end`);
add(` local _0QCtxxTRm84Z=rawget(os or {},string.char(99,108,111,99,107))`);
add(` if type(_0QCtxxTRm84Z)=="function" and _isl4(_0QCtxxTRm84Z) then ${n.killed}=true;${n.reason}=string.char(111,115,95,99,108,111,99,107,95,104) end`);
add(` local _0nYmRBphFCNY=rawget(os or {},string.char(116,105,109,101))`);
add(` if type(_0nYmRBphFCNY)=="function" and _isl4(_0nYmRBphFCNY) then ${n.killed}=true;${n.reason}=string.char(111,115,95,116,105,109,101,95,104) end`);
add(` local _0O1HwU9Urv8c=rawget(io or {},string.char(114,101,97,100))`);
add(` if type(_0O1HwU9Urv8c)=="function" and _isl4(_0O1HwU9Urv8c) then ${n.killed}=true;${n.reason}=string.char(105,111,95,114,101,97,100,95,104) end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0nco3Lptrt69={34,166,177,226,210,30,117,199,242,72,214,182,235,205,10,170,54,87,83,82,77,8,33,179,203,132,254,41,11,197,54,175,250,83,24,217,115,230,49,173,63,107,19,94,246,101,2,5,22,213,173,153,207,213,188,108,78,133,137,12,38,49,49,88,141,49,14,150,108,110,168,64,20,150,253,79,49,95,99,244,144,138,3,94,77,112,188,70,125,125,208,69,217,11,207,151,234,26,185,198,154,167,59,144,15,117,186,134,233,238,121,238,245,73,156,254,46,202,164,251,199,95,225,145,11,98,151,3,246,26,48,254,19,83,106,253,145,59,72,211,43,124,54,246,59,51,30,142,72,198,18,203,206,241,86,214,251,225,38,46,156,182,74,221,108,141,136,73,28,214,84,239,75,38,253,84,234,143,79,56,75,148,75,183,243,90,151,207,98,21,212,174,164,235,33,3,122,139,97,9}`);
add(` local _0LsgTvnObxTR=0`);
add(` for _i=1,#_0nco3Lptrt69 do _0LsgTvnObxTR=(_0LsgTvnObxTR+_0nco3Lptrt69[_i]*_i)%65521 end`);
add(` if _0LsgTvnObxTR~=25304 then ${n.killed}=true;${n.reason}=string.char(104,97,115,104,95,109,105,115,109,97,116,99,104) end`);
add(` end)`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0pWpIXDOLKdR=0`);
add(` local function _0zriBTn38BNk(n) _0pWpIXDOLKdR=_0pWpIXDOLKdR+1;if n>1 then _0zriBTn38BNk(n-1) end end`);
add(` ${n.pcall_}(_0zriBTn38BNk,7)`);
add(` if _0pWpIXDOLKdR~=7 then ${n.killed}=true;${n.reason}=string.char(100,48) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0owb1FrFTWhA=0`);
add(` local function _0AIq3YjdZope(n) _0owb1FrFTWhA=_0owb1FrFTWhA+1;if n>1 then _0AIq3YjdZope(n-1) end end`);
add(` ${n.pcall_}(_0AIq3YjdZope,5)`);
add(` if _0owb1FrFTWhA~=5 then ${n.killed}=true;${n.reason}=string.char(100,49) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0EaTusS_dv0K=0`);
add(` local function _0hYCivTrw3bM(n) _0EaTusS_dv0K=_0EaTusS_dv0K+1;if n>1 then _0hYCivTrw3bM(n-1) end end`);
add(` ${n.pcall_}(_0hYCivTrw3bM,5)`);
add(` if _0EaTusS_dv0K~=5 then ${n.killed}=true;${n.reason}=string.char(100,50) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0qiHrlpFjitC=0`);
add(` local function _0WBzyhdu4Nuy(n) _0qiHrlpFjitC=_0qiHrlpFjitC+1;if n>1 then _0WBzyhdu4Nuy(n-1) end end`);
add(` ${n.pcall_}(_0WBzyhdu4Nuy,6)`);
add(` if _0qiHrlpFjitC~=6 then ${n.killed}=true;${n.reason}=string.char(100,51) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0OF66N5dL0He=0`);
add(` local function _0wNefjMN5sgr(n) _0OF66N5dL0He=_0OF66N5dL0He+1;if n>1 then _0wNefjMN5sgr(n-1) end end`);
add(` ${n.pcall_}(_0wNefjMN5sgr,5)`);
add(` if _0OF66N5dL0He~=5 then ${n.killed}=true;${n.reason}=string.char(100,52) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0RGBeeEQaANz=0`);
add(` local function _0ck2XI3L5MJh(n) _0RGBeeEQaANz=_0RGBeeEQaANz+1;if n>1 then _0ck2XI3L5MJh(n-1) end end`);
add(` ${n.pcall_}(_0ck2XI3L5MJh,3)`);
add(` if _0RGBeeEQaANz~=3 then ${n.killed}=true;${n.reason}=string.char(100,53) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0hDZVlK4lRGE=0`);
add(` local function _0f44hN5ZiqvG(n) _0hDZVlK4lRGE=_0hDZVlK4lRGE+1;if n>1 then _0f44hN5ZiqvG(n-1) end end`);
add(` ${n.pcall_}(_0f44hN5ZiqvG,6)`);
add(` if _0hDZVlK4lRGE~=6 then ${n.killed}=true;${n.reason}=string.char(100,54) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0NKswY0BhOf6=0`);
add(` local function _0vUNlIgqkaC9(n) _0NKswY0BhOf6=_0NKswY0BhOf6+1;if n>1 then _0vUNlIgqkaC9(n-1) end end`);
add(` ${n.pcall_}(_0vUNlIgqkaC9,7)`);
add(` if _0NKswY0BhOf6~=7 then ${n.killed}=true;${n.reason}=string.char(100,55) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0ZcRuEVVXAiN=0`);
add(` local function _0TuzW9rwTy_b(n) _0ZcRuEVVXAiN=_0ZcRuEVVXAiN+1;if n>1 then _0TuzW9rwTy_b(n-1) end end`);
add(` ${n.pcall_}(_0TuzW9rwTy_b,5)`);
add(` if _0ZcRuEVVXAiN~=5 then ${n.killed}=true;${n.reason}=string.char(100,56) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0lseqQi3V3Bk=0`);
add(` local function _0PYeWhwnJiiB(n) _0lseqQi3V3Bk=_0lseqQi3V3Bk+1;if n>1 then _0PYeWhwnJiiB(n-1) end end`);
add(` ${n.pcall_}(_0PYeWhwnJiiB,6)`);
add(` if _0lseqQi3V3Bk~=6 then ${n.killed}=true;${n.reason}=string.char(100,57) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0WDKmLk0c_17=0`);
add(` local function _0qYaL34wpm1A(n) _0WDKmLk0c_17=_0WDKmLk0c_17+1;if n>1 then _0qYaL34wpm1A(n-1) end end`);
add(` ${n.pcall_}(_0qYaL34wpm1A,6)`);
add(` if _0WDKmLk0c_17~=6 then ${n.killed}=true;${n.reason}=string.char(100,49,48) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0H1CWrvOjss_=0`);
add(` local function _0YytbfVfihJE(n) _0H1CWrvOjss_=_0H1CWrvOjss_+1;if n>1 then _0YytbfVfihJE(n-1) end end`);
add(` ${n.pcall_}(_0YytbfVfihJE,3)`);
add(` if _0H1CWrvOjss_~=3 then ${n.killed}=true;${n.reason}=string.char(100,49,49) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0n9pZRNm5tBU=0`);
add(` local function _0dTgLCG9z9av(n) _0n9pZRNm5tBU=_0n9pZRNm5tBU+1;if n>1 then _0dTgLCG9z9av(n-1) end end`);
add(` ${n.pcall_}(_0dTgLCG9z9av,6)`);
add(` if _0n9pZRNm5tBU~=6 then ${n.killed}=true;${n.reason}=string.char(100,49,50) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0MEstROsN89m=0`);
add(` local function _0iVh_nft6Zs4(n) _0MEstROsN89m=_0MEstROsN89m+1;if n>1 then _0iVh_nft6Zs4(n-1) end end`);
add(` ${n.pcall_}(_0iVh_nft6Zs4,6)`);
add(` if _0MEstROsN89m~=6 then ${n.killed}=true;${n.reason}=string.char(100,49,51) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0w_nJ_XGMu5f=0`);
add(` local function _0rA4XYn1gvix(n) _0w_nJ_XGMu5f=_0w_nJ_XGMu5f+1;if n>1 then _0rA4XYn1gvix(n-1) end end`);
add(` ${n.pcall_}(_0rA4XYn1gvix,6)`);
add(` if _0w_nJ_XGMu5f~=6 then ${n.killed}=true;${n.reason}=string.char(100,49,52) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0eFX1VLStSau=0`);
add(` local function _0lTOOeaIt9ur(n) _0eFX1VLStSau=_0eFX1VLStSau+1;if n>1 then _0lTOOeaIt9ur(n-1) end end`);
add(` ${n.pcall_}(_0lTOOeaIt9ur,3)`);
add(` if _0eFX1VLStSau~=3 then ${n.killed}=true;${n.reason}=string.char(100,49,53) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0tlaxGXSitMu=0`);
add(` local function _0xmA5iFHKUCj(n) _0tlaxGXSitMu=_0tlaxGXSitMu+1;if n>1 then _0xmA5iFHKUCj(n-1) end end`);
add(` ${n.pcall_}(_0xmA5iFHKUCj,6)`);
add(` if _0tlaxGXSitMu~=6 then ${n.killed}=true;${n.reason}=string.char(100,49,54) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0zg0UQuKikv1=0`);
add(` local function _0XIMoC8mWJfM(n) _0zg0UQuKikv1=_0zg0UQuKikv1+1;if n>1 then _0XIMoC8mWJfM(n-1) end end`);
add(` ${n.pcall_}(_0XIMoC8mWJfM,6)`);
add(` if _0zg0UQuKikv1~=6 then ${n.killed}=true;${n.reason}=string.char(100,49,55) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0ToSNIk9ZhtQ=0`);
add(` local function _0Hjh2VbqsPIp(n) _0ToSNIk9ZhtQ=_0ToSNIk9ZhtQ+1;if n>1 then _0Hjh2VbqsPIp(n-1) end end`);
add(` ${n.pcall_}(_0Hjh2VbqsPIp,5)`);
add(` if _0ToSNIk9ZhtQ~=5 then ${n.killed}=true;${n.reason}=string.char(100,49,56) end`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0NthMWDIBFMa=0`);
add(` local function _0YMWoYm5HoEw(n) _0NthMWDIBFMa=_0NthMWDIBFMa+1;if n>1 then _0YMWoYm5HoEw(n-1) end end`);
add(` ${n.pcall_}(_0YMWoYm5HoEw,5)`);
add(` if _0NthMWDIBFMa~=5 then ${n.killed}=true;${n.reason}=string.char(100,49,57) end`);
add(` end)`);
add(`end`);

add(`if false then`);
add(` local _0EeRd_TFK4ow={(bit32 and bit32.bxor(34199,48485) or 14578),(bit32 and bit32.bxor(18608,34918) or 49366),(bit32 and bit32.bxor(7289,39185) or 34152),(bit32 and bit32.bxor(32753,60177) or 38112),(bit32 and bit32.bxor(44042,29618) or 57272),(bit32 and bit32.bxor(23039,5495) or 19592),(bit32 and bit32.bxor(17129,18225) or 1496),(bit32 and bit32.bxor(40413,19892) or 53353),(bit32 and bit32.bxor(4098,61203) or 65297),(bit32 and bit32.bxor(30772,4355) or 26935),(bit32 and bit32.bxor(31693,37878) or 59451),(bit32 and bit32.bxor(34901,6733) or 37400),(bit32 and bit32.bxor(30909,38421) or 61096),(bit32 and bit32.bxor(32581,57520) or 40949),(bit32 and bit32.bxor(53497,34357) or 22220),(bit32 and bit32.bxor(2036,31280) or 32196),(bit32 and bit32.bxor(48276,44911) or 5115),(bit32 and bit32.bxor(14114,25335) or 21973),(bit32 and bit32.bxor(3712,47867) or 46203),(bit32 and bit32.bxor(47121,6745) or 41544),(bit32 and bit32.bxor(46772,1794) or 45494),(bit32 and bit32.bxor(36836,52515) or 17095),(bit32 and bit32.bxor(2929,33042) or 35427),(bit32 and bit32.bxor(40557,5942) or 35163),(bit32 and bit32.bxor(32537,9591) or 23150),(bit32 and bit32.bxor(57964,1163) or 59111),(bit32 and bit32.bxor(47341,34887) or 12458),(bit32 and bit32.bxor(14380,17188) or 31496),(bit32 and bit32.bxor(51639,34002) or 19813),(bit32 and bit32.bxor(48688,18054) or 63670),(bit32 and bit32.bxor(51158,51153) or 7),(bit32 and bit32.bxor(28787,24274) or 11937),(bit32 and bit32.bxor(28226,44389) or 49959),(bit32 and bit32.bxor(53006,61421) or 8419),(bit32 and bit32.bxor(41268,14781) or 39049),(bit32 and bit32.bxor(19460,57461) or 44145),(bit32 and bit32.bxor(30102,35261) or 64555),(bit32 and bit32.bxor(15091,63662) or 49757),(bit32 and bit32.bxor(39024,22045) or 52845),(bit32 and bit32.bxor(21805,57428) or 46457),(bit32 and bit32.bxor(19642,52469) or 32847),(bit32 and bit32.bxor(57296,243) or 57123),(bit32 and bit32.bxor(4403,39347) or 34944),(bit32 and bit32.bxor(10158,12901) or 5579),(bit32 and bit32.bxor(32127,20949) or 11434),(bit32 and bit32.bxor(30479,47153) or 53054),(bit32 and bit32.bxor(58391,62704) or 4327),(bit32 and bit32.bxor(39534,2332) or 37746),(bit32 and bit32.bxor(25932,35010) or 60814),(bit32 and bit32.bxor(4187,4696) or 515),(bit32 and bit32.bxor(54781,2914) or 56991),(bit32 and bit32.bxor(17098,23982) or 8036),(bit32 and bit32.bxor(44095,31014) or 54553),(bit32 and bit32.bxor(13937,56690) or 60163),(bit32 and bit32.bxor(3114,2602) or 1536),(bit32 and bit32.bxor(33712,19043) or 51667),(bit32 and bit32.bxor(16761,13450) or 30195),(bit32 and bit32.bxor(28662,62308) or 40082),(bit32 and bit32.bxor(14814,41426) or 38924),(bit32 and bit32.bxor(9316,9973) or 657),(bit32 and bit32.bxor(28326,54834) or 47252),(bit32 and bit32.bxor(30304,46427) or 49979),(bit32 and bit32.bxor(56801,5359) or 51470),(bit32 and bit32.bxor(56033,13146) or 59835),(bit32 and bit32.bxor(35279,49764) or 19371),(bit32 and bit32.bxor(1140,8508) or 9544),(bit32 and bit32.bxor(29793,31742) or 3999),(bit32 and bit32.bxor(33529,61388) or 27957),(bit32 and bit32.bxor(27242,57617) or 35707),(bit32 and bit32.bxor(23697,25602) or 14483),(bit32 and bit32.bxor(18626,6930) or 21456),(bit32 and bit32.bxor(41017,5459) or 46442),(bit32 and bit32.bxor(37175,31992) or 60879),(bit32 and bit32.bxor(28417,34168) or 60025),(bit32 and bit32.bxor(43328,15003) or 37851),(bit32 and bit32.bxor(51724,50597) or 4009),(bit32 and bit32.bxor(35775,62450) or 30797),(bit32 and bit32.bxor(21348,17311) or 4347),(bit32 and bit32.bxor(25601,64805) or 39204),(bit32 and bit32.bxor(7087,22920) or 16935),(bit32 and bit32.bxor(34985,61086) or 26167),(bit32 and bit32.bxor(26221,22798) or 16227),(bit32 and bit32.bxor(1454,57682) or 58620),(bit32 and bit32.bxor(35533,23471) or 53602),(bit32 and bit32.bxor(10865,61528) or 55849),(bit32 and bit32.bxor(50318,62341) or 14091),(bit32 and bit32.bxor(37881,39061) or 2924),(bit32 and bit32.bxor(57905,9392) or 50817),(bit32 and bit32.bxor(19403,3876) or 17647),(bit32 and bit32.bxor(2723,25245) or 26686),(bit32 and bit32.bxor(34772,65360) or 30852),(bit32 and bit32.bxor(54487,48906) or 27613),(bit32 and bit32.bxor(13522,5256) or 8282),(bit32 and bit32.bxor(25529,50339) or 42778),(bit32 and bit32.bxor(41444,39157) or 14609),(bit32 and bit32.bxor(28802,3827) or 32369),(bit32 and bit32.bxor(20582,53062) or 40736),(bit32 and bit32.bxor(3727,27115) or 26468),(bit32 and bit32.bxor(31907,56749) or 41230),(bit32 and bit32.bxor(26391,44694) or 51585),(bit32 and bit32.bxor(43124,39157) or 12417),(bit32 and bit32.bxor(48145,5758) or 43631),(bit32 and bit32.bxor(12214,3348) or 8866),(bit32 and bit32.bxor(6753,53913) or 51448),(bit32 and bit32.bxor(34373,8939) or 42158),(bit32 and bit32.bxor(18110,32491) or 14421),(bit32 and bit32.bxor(51946,29521) or 47547),(bit32 and bit32.bxor(34504,22813) or 57301),(bit32 and bit32.bxor(52148,64179) or 12551),(bit32 and bit32.bxor(21159,61661) or 41594),(bit32 and bit32.bxor(13923,47145) or 36426),(bit32 and bit32.bxor(31503,21591) or 12120),(bit32 and bit32.bxor(5624,11915) or 15219),(bit32 and bit32.bxor(52635,31066) or 46273),(bit32 and bit32.bxor(39338,54382) or 19908),(bit32 and bit32.bxor(20757,32751) or 12026),(bit32 and bit32.bxor(57985,35819) or 26986),(bit32 and bit32.bxor(27640,37703) or 63679),(bit32 and bit32.bxor(13448,39144) or 44128),(bit32 and bit32.bxor(33221,1591) or 34802),(bit32 and bit32.bxor(15173,31362) or 16839),(bit32 and bit32.bxor(29882,2894) or 32756),(bit32 and bit32.bxor(42978,11229) or 35903),(bit32 and bit32.bxor(5856,45433) or 42905),(bit32 and bit32.bxor(26424,59788) or 36532),(bit32 and bit32.bxor(50658,25673) or 41387),(bit32 and bit32.bxor(33037,59725) or 26688),(bit32 and bit32.bxor(2419,42726) or 44949),(bit32 and bit32.bxor(2521,3208) or 1361),(bit32 and bit32.bxor(1479,51911) or 52992),(bit32 and bit32.bxor(23191,45926) or 59889),(bit32 and bit32.bxor(52826,38214) or 23324),(bit32 and bit32.bxor(40572,57817) or 32677),(bit32 and bit32.bxor(7096,49556) or 55852),(bit32 and bit32.bxor(26158,3057) or 28127),(bit32 and bit32.bxor(38489,22336) or 49433),(bit32 and bit32.bxor(32345,32328) or 17),(bit32 and bit32.bxor(40741,45814) or 11731),(bit32 and bit32.bxor(46086,55099) or 25405),(bit32 and bit32.bxor(40027,14048) or 43707),(bit32 and bit32.bxor(30622,44268) or 56178),(bit32 and bit32.bxor(18132,6718) or 23786),(bit32 and bit32.bxor(49489,39994) or 23915),(bit32 and bit32.bxor(16659,24171) or 8056),(bit32 and bit32.bxor(36383,34989) or 1714),(bit32 and bit32.bxor(55466,33608) or 23522),(bit32 and bit32.bxor(10480,5575) or 15671),(bit32 and bit32.bxor(41126,27975) or 52705),(bit32 and bit32.bxor(57963,5271) or 63228),(bit32 and bit32.bxor(28848,33020) or 61516),(bit32 and bit32.bxor(31441,21729) or 11824),(bit32 and bit32.bxor(37472,38088) or 1704),(bit32 and bit32.bxor(35643,32592) or 62571),(bit32 and bit32.bxor(40798,9290) or 47892),(bit32 and bit32.bxor(49063,44840) or 4239),(bit32 and bit32.bxor(35956,18334) or 52202),(bit32 and bit32.bxor(3105,61876) or 64917),(bit32 and bit32.bxor(11950,57344) or 52910),(bit32 and bit32.bxor(16760,42769) or 58985),(bit32 and bit32.bxor(1834,6339) or 8169),(bit32 and bit32.bxor(59479,21077) or 47618),(bit32 and bit32.bxor(49205,390) or 49587),(bit32 and bit32.bxor(2644,22244) or 23728),(bit32 and bit32.bxor(50361,23586) or 39067),(bit32 and bit32.bxor(27425,52489) or 42536),(bit32 and bit32.bxor(12377,18575) or 30934),(bit32 and bit32.bxor(9148,13040) or 4428),(bit32 and bit32.bxor(34420,59708) or 28488),(bit32 and bit32.bxor(32200,63963) or 33811),(bit32 and bit32.bxor(12051,55960) or 62859),(bit32 and bit32.bxor(36634,52738) or 16664),(bit32 and bit32.bxor(31875,34593) or 64418),(bit32 and bit32.bxor(56715,47227) or 26096),(bit32 and bit32.bxor(33665,36326) or 3687),(bit32 and bit32.bxor(20579,62395) or 41944),(bit32 and bit32.bxor(48716,61095) or 20715),(bit32 and bit32.bxor(16732,62611) or 46543),(bit32 and bit32.bxor(47837,47937) or 412),(bit32 and bit32.bxor(28282,988) or 28070),(bit32 and bit32.bxor(26066,24248) or 15210),(bit32 and bit32.bxor(59742,13029) or 56251),(bit32 and bit32.bxor(56290,61092) or 13638),(bit32 and bit32.bxor(31961,53559) or 44526),(bit32 and bit32.bxor(29122,20412) or 15998),(bit32 and bit32.bxor(40124,31403) or 58903),(bit32 and bit32.bxor(49302,60838) or 11568),(bit32 and bit32.bxor(31069,54360) or 44293),(bit32 and bit32.bxor(31466,48922) or 50672),(bit32 and bit32.bxor(8209,396) or 8605),(bit32 and bit32.bxor(9783,44082) or 35333),(bit32 and bit32.bxor(25856,15024) or 24496),(bit32 and bit32.bxor(27429,63449) or 40188),(bit32 and bit32.bxor(20525,26740) or 14425),(bit32 and bit32.bxor(6759,20270) or 21833),(bit32 and bit32.bxor(14859,23021) or 25574),(bit32 and bit32.bxor(35526,44212) or 9842),(bit32 and bit32.bxor(4964,22628) or 19200),(bit32 and bit32.bxor(28979,41654) or 54149),(bit32 and bit32.bxor(41839,55397) or 31498),(bit32 and bit32.bxor(41209,57621) or 16876),(bit32 and bit32.bxor(12561,52861) or 65388),(bit32 and bit32.bxor(16943,55166) or 38225),(bit32 and bit32.bxor(49260,30873) or 47349),(bit32 and bit32.bxor(30411,48423) or 52204),(bit32 and bit32.bxor(12528,22591) or 26831),(bit32 and bit32.bxor(7433,10044) or 14901),(bit32 and bit32.bxor(33126,742) or 33664),(bit32 and bit32.bxor(1543,41593) or 42110),(bit32 and bit32.bxor(6481,29878) or 28135),(bit32 and bit32.bxor(14366,35961) or 46183),(bit32 and bit32.bxor(31783,47115) or 50220),(bit32 and bit32.bxor(57168,62030) or 11550),(bit32 and bit32.bxor(55672,51472) or 4200),(bit32 and bit32.bxor(26082,40806) or 64132),(bit32 and bit32.bxor(57400,37674) or 29458),(bit32 and bit32.bxor(42235,19307) or 61328),(bit32 and bit32.bxor(10963,53208) or 58635),(bit32 and bit32.bxor(4746,28393) or 31843),(bit32 and bit32.bxor(36851,12749) or 48702),(bit32 and bit32.bxor(38981,51479) or 20818),(bit32 and bit32.bxor(30378,43899) or 56785),(bit32 and bit32.bxor(17635,32474) or 14905),(bit32 and bit32.bxor(27344,20271) or 9727),(bit32 and bit32.bxor(59110,45112) or 22238),(bit32 and bit32.bxor(4323,45755) or 41560),(bit32 and bit32.bxor(3460,57065) or 54125),(bit32 and bit32.bxor(27356,3668) or 25736),(bit32 and bit32.bxor(29137,7448) or 27849),(bit32 and bit32.bxor(11389,24326) or 29563),(bit32 and bit32.bxor(36653,34962) or 1983),(bit32 and bit32.bxor(36206,64249) or 30615),(bit32 and bit32.bxor(30414,758) or 29752),(bit32 and bit32.bxor(45702,21758) or 59000),(bit32 and bit32.bxor(44632,5273) or 47809),(bit32 and bit32.bxor(50745,40280) or 23393),(bit32 and bit32.bxor(30708,18526) or 16298),(bit32 and bit32.bxor(54293,64117) or 11872),(bit32 and bit32.bxor(1026,63996) or 65022),(bit32 and bit32.bxor(20167,23816) or 5071),(bit32 and bit32.bxor(59145,32083) or 39514),(bit32 and bit32.bxor(12928,46515) or 34611),(bit32 and bit32.bxor(48454,30443) or 52141),(bit32 and bit32.bxor(30074,10632) or 23794),(bit32 and bit32.bxor(29221,8151) or 28146),(bit32 and bit32.bxor(30904,23122) or 8938),(bit32 and bit32.bxor(49267,29214) or 45677),(bit32 and bit32.bxor(4698,26877) or 31399),(bit32 and bit32.bxor(37717,19525) or 57104),(bit32 and bit32.bxor(12727,50475) or 62620),(bit32 and bit32.bxor(52838,59730) or 10036),(bit32 and bit32.bxor(52687,47460) or 29867),(bit32 and bit32.bxor(15615,43006) or 39681),(bit32 and bit32.bxor(38144,47911) or 11815),(bit32 and bit32.bxor(6170,14235) or 12161),(bit32 and bit32.bxor(41449,37325) or 12324),(bit32 and bit32.bxor(21430,52642) or 40468),(bit32 and bit32.bxor(52040,57636) or 10860),(bit32 and bit32.bxor(4687,18) or 4701),(bit32 and bit32.bxor(37378,16128) or 44290),(bit32 and bit32.bxor(32886,16928) or 49750),(bit32 and bit32.bxor(39866,47771) or 8481),(bit32 and bit32.bxor(2717,27118) or 25459),(bit32 and bit32.bxor(17826,49710) or 34700),(bit32 and bit32.bxor(26026,13225) or 22019),(bit32 and bit32.bxor(44392,54060) or 32324),(bit32 and bit32.bxor(9048,13159) or 4159),(bit32 and bit32.bxor(57435,13254) or 54173),(bit32 and bit32.bxor(14037,49897) or 62524),(bit32 and bit32.bxor(45738,13291) or 33089),(bit32 and bit32.bxor(7207,5025) or 3974),(bit32 and bit32.bxor(31934,26128) or 6830),(bit32 and bit32.bxor(57522,11129) or 52171),(bit32 and bit32.bxor(37285,37550) or 779),(bit32 and bit32.bxor(49249,64287) or 15230),(bit32 and bit32.bxor(41182,46396) or 5602),(bit32 and bit32.bxor(47907,45594) or 2361),(bit32 and bit32.bxor(42633,15461) or 39660),(bit32 and bit32.bxor(3047,60528) or 59287),(bit32 and bit32.bxor(23065,34338) or 56379),(bit32 and bit32.bxor(34813,61196) or 26865),(bit32 and bit32.bxor(53870,17205) or 37211),(bit32 and bit32.bxor(45562,52012) or 31446),(bit32 and bit32.bxor(30311,62143) or 34008),(bit32 and bit32.bxor(25143,20233) or 11582),(bit32 and bit32.bxor(33142,41966) or 8856),(bit32 and bit32.bxor(40713,64983) or 25310),(bit32 and bit32.bxor(53324,36354) or 24142),(bit32 and bit32.bxor(25667,28897) or 5282),(bit32 and bit32.bxor(41038,37503) or 12849),(bit32 and bit32.bxor(40797,22967) or 50922),(bit32 and bit32.bxor(19451,65013) or 46606),(bit32 and bit32.bxor(6972,3148) or 6000),(bit32 and bit32.bxor(17281,56884) or 40373),(bit32 and bit32.bxor(13240,23078) or 27038),(bit32 and bit32.bxor(27473,1320) or 28281),(bit32 and bit32.bxor(23427,3886) or 21677),(bit32 and bit32.bxor(43164,8151) or 46923),(bit32 and bit32.bxor(27107,28181) or 2038),(bit32 and bit32.bxor(12444,15361) or 3229),(bit32 and bit32.bxor(27415,17052) or 10635)}`);
add(` local _0oECEg8PF257=1;local _0rpHikjcRZDX={};local _0h03RiefRxkT={}`);
add(` repeat`);
add(` local _d=_0h03RiefRxkT[_0oECEg8PF257]`);
add(` if not(_d<64) then if not(_d<128) then if not(_d<192) then _d=_d else _d=_d+1 end else _d=_d end else _d=_d end`);
add(` _0oECEg8PF257=_0oECEg8PF257+1`);
add(` until _0oECEg8PF257>#_0h03RiefRxkT`);
add(`end`);

add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0XapqzK73geI=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,99,111,109,112,105,108,101))`);
add(` if type(_0XapqzK73geI)=="function" then rawset(_G,string.char(100,101,99,111,109,112,105,108,101),function()error("")end) end`);
add(` local _0Me6iUhI2vZw=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,117,109,112,115,116,114,105,110,103))`);
add(` if type(_0Me6iUhI2vZw)=="function" then rawset(_G,string.char(100,117,109,112,115,116,114,105,110,103),function()error("")end) end`);
add(` local _0Bf1huACNoHt=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101))`);
add(` if type(_0Bf1huACNoHt)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101),function()error("")end) end`);
add(` local _0JmHPRW_E0aa=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101))`);
add(` if type(_0JmHPRW_E0aa)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101),function()error("")end) end`);
add(` local _0JaY4Sp3_20o=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,111,110,115,116,97,110,116,115))`);
add(` if type(_0JaY4Sp3_20o)=="function" then rawset(_G,string.char(103,101,116,99,111,110,115,116,97,110,116,115),function()error("")end) end`);
add(` local _0WyKN7BdnE3K=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,117,112,118,97,108,117,101,115))`);
add(` if type(_0WyKN7BdnE3K)=="function" then rawset(_G,string.char(103,101,116,117,112,118,97,108,117,101,115),function()error("")end) end`);
add(` local _0ZXaoDru8oEV=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,112,114,111,116,111,115))`);
add(` if type(_0ZXaoDru8oEV)=="function" then rawset(_G,string.char(103,101,116,112,114,111,116,111,115),function()error("")end) end`);
add(` ${n.pcall_}(function() rawset(string,string.char(100,117,109,112),function()error("")end) end)`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0b34ObMCy1Rn=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,99,111,109,112,105,108,101))`);
add(` if type(_0b34ObMCy1Rn)=="function" then rawset(_G,string.char(100,101,99,111,109,112,105,108,101),function()error("")end) end`);
add(` local _0LZJqK6LEIQx=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,117,109,112,115,116,114,105,110,103))`);
add(` if type(_0LZJqK6LEIQx)=="function" then rawset(_G,string.char(100,117,109,112,115,116,114,105,110,103),function()error("")end) end`);
add(` local _0j3phoCg_ptw=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101))`);
add(` if type(_0j3phoCg_ptw)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101),function()error("")end) end`);
add(` local _0EFeifooOtJc=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101))`);
add(` if type(_0EFeifooOtJc)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101),function()error("")end) end`);
add(` local _0e684xyR6phv=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,111,110,115,116,97,110,116,115))`);
add(` if type(_0e684xyR6phv)=="function" then rawset(_G,string.char(103,101,116,99,111,110,115,116,97,110,116,115),function()error("")end) end`);
add(` local _0ONtkEM5RrP8=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,117,112,118,97,108,117,101,115))`);
add(` if type(_0ONtkEM5RrP8)=="function" then rawset(_G,string.char(103,101,116,117,112,118,97,108,117,101,115),function()error("")end) end`);
add(` local _0QM1ZbJWeSV0=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,112,114,111,116,111,115))`);
add(` if type(_0QM1ZbJWeSV0)=="function" then rawset(_G,string.char(103,101,116,112,114,111,116,111,115),function()error("")end) end`);
add(` ${n.pcall_}(function() rawset(string,string.char(100,117,109,112),function()error("")end) end)`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0Gh5JTveeHPb=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,99,111,109,112,105,108,101))`);
add(` if type(_0Gh5JTveeHPb)=="function" then rawset(_G,string.char(100,101,99,111,109,112,105,108,101),function()error("")end) end`);
add(` local _0kvgbfj2813T=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,117,109,112,115,116,114,105,110,103))`);
add(` if type(_0kvgbfj2813T)=="function" then rawset(_G,string.char(100,117,109,112,115,116,114,105,110,103),function()error("")end) end`);
add(` local _0TuzifLA0xwj=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101))`);
add(` if type(_0TuzifLA0xwj)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101),function()error("")end) end`);
add(` local _0lAmT2tEfBFm=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101))`);
add(` if type(_0lAmT2tEfBFm)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101),function()error("")end) end`);
add(` local _0aXb8vK10k5q=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,111,110,115,116,97,110,116,115))`);
add(` if type(_0aXb8vK10k5q)=="function" then rawset(_G,string.char(103,101,116,99,111,110,115,116,97,110,116,115),function()error("")end) end`);
add(` local _0QCTYOSszHiF=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,117,112,118,97,108,117,101,115))`);
add(` if type(_0QCTYOSszHiF)=="function" then rawset(_G,string.char(103,101,116,117,112,118,97,108,117,101,115),function()error("")end) end`);
add(` local _0pSXOuKIccKA=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,112,114,111,116,111,115))`);
add(` if type(_0pSXOuKIccKA)=="function" then rawset(_G,string.char(103,101,116,112,114,111,116,111,115),function()error("")end) end`);
add(` ${n.pcall_}(function() rawset(string,string.char(100,117,109,112),function()error("")end) end)`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0UJKSgXWbZau=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,99,111,109,112,105,108,101))`);
add(` if type(_0UJKSgXWbZau)=="function" then rawset(_G,string.char(100,101,99,111,109,112,105,108,101),function()error("")end) end`);
add(` local _0shB3kGVUl1u=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,117,109,112,115,116,114,105,110,103))`);
add(` if type(_0shB3kGVUl1u)=="function" then rawset(_G,string.char(100,117,109,112,115,116,114,105,110,103),function()error("")end) end`);
add(` local _0vaTZmWHdnyF=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101))`);
add(` if type(_0vaTZmWHdnyF)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101),function()error("")end) end`);
add(` local _0B4oq0xhADp6=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101))`);
add(` if type(_0B4oq0xhADp6)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101),function()error("")end) end`);
add(` local _0m_jxI0nVFqx=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,111,110,115,116,97,110,116,115))`);
add(` if type(_0m_jxI0nVFqx)=="function" then rawset(_G,string.char(103,101,116,99,111,110,115,116,97,110,116,115),function()error("")end) end`);
add(` local _0a_AyXX3iU0F=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,117,112,118,97,108,117,101,115))`);
add(` if type(_0a_AyXX3iU0F)=="function" then rawset(_G,string.char(103,101,116,117,112,118,97,108,117,101,115),function()error("")end) end`);
add(` local _0Sie8kByM0b6=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,112,114,111,116,111,115))`);
add(` if type(_0Sie8kByM0b6)=="function" then rawset(_G,string.char(103,101,116,112,114,111,116,111,115),function()error("")end) end`);
add(` ${n.pcall_}(function() rawset(string,string.char(100,117,109,112),function()error("")end) end)`);
add(` end)`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` local _0fVHxdX70cdW=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,99,111,109,112,105,108,101))`);
add(` if type(_0fVHxdX70cdW)=="function" then rawset(_G,string.char(100,101,99,111,109,112,105,108,101),function()error("")end) end`);
add(` local _0hroQqDQzLdP=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,117,109,112,115,116,114,105,110,103))`);
add(` if type(_0hroQqDQzLdP)=="function" then rawset(_G,string.char(100,117,109,112,115,116,114,105,110,103),function()error("")end) end`);
add(` local _0bdnMa1QWHKY=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101))`);
add(` if type(_0bdnMa1QWHKY)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101),function()error("")end) end`);
add(` local _0pehAHcHxMJg=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101))`);
add(` if type(_0pehAHcHxMJg)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101),function()error("")end) end`);
add(` local _0EVpvJBQFCGf=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,111,110,115,116,97,110,116,115))`);
add(` if type(_0EVpvJBQFCGf)=="function" then rawset(_G,string.char(103,101,116,99,111,110,115,116,97,110,116,115),function()error("")end) end`);
add(` local _0It0cRrrTij8=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,117,112,118,97,108,117,101,115))`);
add(` if type(_0It0cRrrTij8)=="function" then rawset(_G,string.char(103,101,116,117,112,118,97,108,117,101,115),function()error("")end) end`);
add(` local _0H9TzC7r9683=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,112,114,111,116,111,115))`);
add(` if type(_0H9TzC7r9683)=="function" then rawset(_G,string.char(103,101,116,112,114,111,116,111,115),function()error("")end) end`);
add(` ${n.pcall_}(function() rawset(string,string.char(100,117,109,112),function()error("")end) end)`);
add(` end)`);
add(`end`);

add(`local ${n.killFn}=function()`);
add(` ${n.pcall_}(function()`);
add(` local _rs=game:GetService(${sc('RunService')})`);
add(` while true do _rs.Heartbeat:Wait() end`);
add(` end)`);
add(` local ${n.trapCo}=coroutine.wrap(function() while true do coroutine.yield() end end)`);
add(` while true do ${n.pcall_}(${n.trapCo}) end`);
add(`end`);
add(`if ${n.killed} then`);
add(` ${n.pcall_}(function() rawset(_G,${sc('warn')},function()end) end)`);
add(` ${n.pcall_}(function() rawset(_G,${sc('print')},function()end) end)`);
add(` ${n.pcall_}(function() rawset(_G,${sc('decompile')},function()error("")end) end)`);
add(` ${n.pcall_}(function() rawset(_G,${sc('dumpstring')},function()error("")end) end)`);
add(` ${n.killFn}()`);
add(` return`);
add(`end`);
add(`do`);
add(` ${n.pcall_}(function()`);
add(` if rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('warn')}) then rawset(_G,${sc('warn')},function()end) end`);
add(` local _dc=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('decompile')})`);
add(` if type(_dc)=="function" then rawset(_G,${sc('decompile')},function()error("")end) end`);
add(` local _ds=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('dumpstring')})`);
add(` if type(_ds)=="function" then rawset(_G,${sc('dumpstring')},function()error("")end) end`);
add(` end)`);
add(`end`);

const at = {};
[
'ok','err',

'refTostring','refPcall','refType','refRawget','refRawequal',
'refSelect','refIpairs','refUnpack',

'hookTest','origFn','hookedFn','tsResult',
'upvCount','refUpvCount',
'diInfo','diSource','diWhat',

'snapTable','snapKey','snapVal',

'RS','rsHB','Players','gameRef','wsRef',

'identOk',

'hbConn','hbTick','hbFn',

'atKill','atReason',

'checkFn','checkBound',

'typeof_','typeofGame','typeofWS',
].forEach(k => { at[k] = N(); });

add(`do`);
add(` local ${at.atKill}=false`);
add(` local ${at.atReason}=""`);

add(` local ${at.refTostring}=tostring`);
add(` local ${at.refPcall}=pcall`);
add(` local ${at.refType}=type`);
add(` local ${at.refRawget}=rawget`);
add(` local ${at.refRawequal}=rawequal`);
add(` local ${at.refSelect}=select`);

add(` ${at.refPcall}(function()`);
add(` local ${at.hookTest}=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('hookfunction')})`);
add(` if ${at.refType}(${at.hookTest})=="function" then`);
add(` ${at.atKill}=true;${at.atReason}=${sc('hf')}`);
add(` end`);
add(` end)`);

add(` ${at.refPcall}(function()`);
add(` if ${at.refRawget}(_G,${sc('newcclosure')})~=nil or`);
add(` ${at.refRawget}(_G,${sc('replaceclosure')})~=nil then`);
add(` ${at.atKill}=true;${at.atReason}=${sc('cc')}`);
add(` end`);
add(` end)`);

add(` ${at.refPcall}(function()`);
add(` local _probe=function() end`);
add(` local ${at.tsResult}=${at.refTostring}(_probe)`);
add(` if ${at.refType}(${at.tsResult})~="string" then`);
add(` ${at.atKill}=true;${at.atReason}=${sc('ts')}`);
add(` end`);
add(` -- check tostring itself wasn't swapped`);
add(` local _ts2=${at.refTostring}(${at.refTostring})`);
add(` if _ts2==nil then ${at.atKill}=true;${at.atReason}=${sc('tsf')} end`);
add(` end)`);

add(` ${at.refPcall}(function()`);
add(` local _dbg=${at.refRawget}(_G,${sc('debug')})`);
add(` if _dbg and _dbg.getinfo then`);
add(` local _probe=function() end`);
add(` local ${at.diInfo}=_dbg.getinfo(_probe)`);
add(` if ${at.diInfo} then`);
add(` local ${at.diWhat}=${at.diInfo}.what`);
add(` if ${at.diWhat}~=${sc('Lua')} and ${at.diWhat}~=${sc('main')} then`);
add(` ${at.atKill}=true;${at.atReason}=${sc('gi')}`);
add(` end`);
add(` end`);
add(` end`);
add(` end)`);

add(` ${at.refPcall}(function()`);
add(` local _dbg=${at.refRawget}(_G,${sc('debug')})`);
add(` if _dbg and _dbg.getupvalues then`);
add(` local _u1,_u2,_u3=1,2,3`);
add(` local _probe=function() return _u1+_u2+_u3 end`);
add(` local _uvt=_dbg.getupvalues(_probe)`);
add(` if _uvt and #_uvt~=3 then`);
add(` ${at.atKill}=true;${at.atReason}=${sc('uv')}`);
add(` end`);
add(` end`);
add(` end)`);

add(` ${at.refPcall}(function()`);
add(` local ${at.typeof_}=${at.refRawget}(_G,${sc('typeof')})`);
add(` if ${at.typeof_} then`);
add(` local ${at.gameRef}=${at.refRawget}(_G,${sc('game')})`);
add(` if ${at.gameRef} then`);
add(` local ${at.typeofGame}=${at.typeof_}(${at.gameRef})`);
add(` if ${at.typeofGame}~=${sc('Instance')} then`);
add(` ${at.atKill}=true;${at.atReason}=${sc('gv')}`);
add(` end`);
add(` -- ClassName must be DataModel`);
add(` local _ok2,_cn=${at.refPcall}(function() return ${at.gameRef}.ClassName end)`);
add(` if _ok2 and _cn~=${sc('DataModel')} then`);
add(` ${at.atKill}=true;${at.atReason}=${sc('dm')}`);
add(` end`);
add(` end`);
add(` end`);
add(` end)`);

add(` ${at.refPcall}(function()`);
add(` local ${at.typeof_}=${at.refRawget}(_G,${sc('typeof')})`);
add(` local ${at.wsRef}=${at.refRawget}(_G,${sc('workspace')})`);
add(` if ${at.typeof_} and ${at.wsRef} then`);
add(` if ${at.typeof_}(${at.wsRef})~=${sc('Instance')} then`);
add(` ${at.atKill}=true;${at.atReason}=${sc('ws')}`);
add(` end`);
add(` end`);
add(` end)`);

add(` ${at.refPcall}(function()`);
add(` local _gi=${at.refRawget}(_G,${sc('getidentity')})`);
add(` if _gi then`);
add(` local _id=${at.refPcall}(_gi)`);
add(` -- identity 6,7,8 = executor`);
add(` if _id and _id>=6 then`);
add(` ${at.atKill}=true;${at.atReason}=${sc('id')}`);
add(` end`);
add(` end`);
add(` end)`);

add(` ${at.refPcall}(function()`);
add(` local _cc=${at.refRawget}(_G,${sc('checkcaller')})`);
add(` if ${at.refType}(_cc)=="function" then`);
add(` local _isExec=${at.refPcall}(_cc)`);
add(` if _isExec then`);
add(` ${at.atKill}=true;${at.atReason}=${sc('exc')}`);
add(` end`);
add(` end`);
add(` end)`);

add(` ${at.refPcall}(function()`);
add(` local _rs=${at.refRawget}(_G,${sc('game')})`);
add(` if not _rs then return end`);
add(` local _ok,_rsvc=${at.refPcall}(function()`);
add(` return _rs:GetService(${sc('RunService')})`);
add(` end)`);
add(` if not _ok or not _rsvc then return end`);
add(` local ${at.hbTick}=0`);
add(` local ${at.hbFn}=function(dt)`);
add(` ${at.hbTick}=${at.hbTick}+dt`);
add(` -- re-run hook detection every 2 seconds`);
add(` if ${at.hbTick}<2 then return end`);
add(` ${at.hbTick}=0`);
add(` -- hookfunction still present?`);
add(` if ${at.refRawget}(_G,${sc('hookfunction')})~=nil then`);
add(` ${at.atKill}=true`);
add(` ${n.killFn}()`);
add(` end`);
add(` -- newcclosure still present?`);
add(` if ${at.refRawget}(_G,${sc('newcclosure')})~=nil then`);
add(` ${at.atKill}=true`);
add(` ${n.killFn}()`);
add(` end`);
add(` end`);
add(` -- Connect; store conn so it's not GC'd`);
add(` local _ok2,${at.hbConn}=${at.refPcall}(function()`);
add(` return _rsvc.Heartbeat:Connect(${at.hbFn})`);
add(` end)`);
add(` end)`);

const e1 = {};
['dbgRef','gpFn','gcFn','guFn','gsFn','poisonTbl','poisonK'].forEach(k => { e1[k] = N(); });

add(`do`);
add(` ${at.refPcall}(function()`);
add(` local ${e1.dbgRef}=${at.refRawget}(_G,${sc('debug')})`);
add(` if not ${e1.dbgRef} then return end`);

add(` local ${e1.gpFn}=${at.refRawget}(${e1.dbgRef},${sc('getproto')})`);
add(` if ${at.refType}(${e1.gpFn})=="function" then`);
add(` rawset(${e1.dbgRef},${sc('getproto')},function() return {} end)`);
add(` end`);

add(` local ${e1.gcFn}=${at.refRawget}(${e1.dbgRef},${sc('getconstants')})`);
add(` if ${at.refType}(${e1.gcFn})=="function" then`);
add(` rawset(${e1.dbgRef},${sc('getconstants')},function()`);

add(` local _t={}`);
add(` for _i=1,${randInt(8,20)} do`);
add(` _t[_i]=tostring(math.random(100000,999999))`);
add(` end`);
add(` return _t`);
add(` end)`);
add(` end`);

add(` local ${e1.guFn}=${at.refRawget}(${e1.dbgRef},${sc('getupvalues')})`);
add(` if ${at.refType}(${e1.guFn})=="function" then`);
add(` rawset(${e1.dbgRef},${sc('getupvalues')},function() return {} end)`);
add(` end`);

add(` local ${e1.gsFn}=${at.refRawget}(_G,${sc('getscriptbytecode')})`);
add(` if ${at.refType}(${e1.gsFn})=="function" then`);
add(` rawset(_G,${sc('getscriptbytecode')},function() return "" end)`);
add(` end`);

add(` for _,_n in ipairs({${sc('getscriptclosure')},${sc('getscriptfunction')}}) do`);
add(` if ${at.refType}(${at.refRawget}(_G,_n))=="function" then`);
add(` rawset(_G,_n,function() return function()end end)`);
add(` end`);
add(` end`);

add(` end)`);
add(`end`);

const e2 = {};
['snapTbl','snapAddr','checkSnap','snapKey','snapRef',
'hbConn2','hbTick2','rsvc2',
'uvRef1','uvRef2','uvRef3','uvCnt1','uvCnt2','uvCnt3'].forEach(k => { e2[k] = N(); });

const snappedFns = [

'tostring','tonumber','type','pairs','ipairs','next','select',
'rawget','rawset','rawequal','rawlen',
'pcall','xpcall','error','assert','load',
'setmetatable','getmetatable',

'string.char','string.byte','string.format','string.gsub',
'string.find','string.sub','string.len','string.rep',

'table.concat','table.insert','table.remove','table.pack','table.unpack',

'math.floor','math.ceil','math.random','math.abs',

'coroutine.create','coroutine.resume','coroutine.wrap',
];

add(`do`);
add(` ${at.refPcall}(function()`);
add(` local ${e2.snapTbl}={}`);
add(` local ${e2.snapAddr}={}`);

for (const fn of snappedFns) {
const parts = fn.split('.');
if (parts.length === 1) {
add(` do local _f=${at.refRawget}(_G,${sc(fn)})`);
add(` if _f then ${e2.snapTbl}[${sc(fn)}]=_f;${e2.snapAddr}[${sc(fn)}]=tostring(_f) end`);
add(` end`);
} else {
add(` do local _b=${at.refRawget}(_G,${sc(parts[0])})`);
add(` if _b then local _f=${at.refRawget}(_b,${sc(parts[1])})`);
add(` if _f then ${e2.snapTbl}[${sc(fn)}]=_f;${e2.snapAddr}[${sc(fn)}]=tostring(_f) end`);
add(` end`);
add(` end`);
}
}

add(` local _dbgU=${at.refRawget}(_G,${sc('debug')})`);
add(` local ${e2.uvCnt1},${e2.uvCnt2},${e2.uvCnt3}=-1,-1,-1`);
add(` if _dbgU and _dbgU.getupvalues then`);
add(` local _ok1,_u1=pcall(_dbgU.getupvalues,${at.refRawget}(_G,${sc('pcall')})) if _ok1 and _u1 then ${e2.uvCnt1}=#_u1 end`);
add(` local _ok2,_u2=pcall(_dbgU.getupvalues,${at.refRawget}(_G,${sc('tostring')})) if _ok2 and _u2 then ${e2.uvCnt2}=#_u2 end`);
add(` local _ok3,_u3=pcall(_dbgU.getupvalues,${at.refRawget}(_G,${sc('rawget')})) if _ok3 and _u3 then ${e2.uvCnt3}=#_u3 end`);
add(` end`);

add(` local ${e2.checkSnap}=function()`);
add(` for _k,_ref in pairs(${e2.snapTbl}) do`);
add(` local _cur`);
add(` local _kp=_k:find('.',1,true)`);
add(` if _kp then`);
add(` local _base=${at.refRawget}(_G,_k:sub(1,_kp-1))`);
add(` if _base then _cur=${at.refRawget}(_base,_k:sub(_kp+1)) end`);
add(` else _cur=${at.refRawget}(_G,_k) end`);

add(` if _cur~=nil and not ${at.refRawequal}(_cur,_ref) then ${n.killFn}();return end`);

add(` if _cur~=nil and tostring(_cur)~=${e2.snapAddr}[_k] then ${n.killFn}();return end`);
add(` end`);

add(` if _dbgU and _dbgU.getupvalues then`);
add(` local _ok,_u=pcall(_dbgU.getupvalues,${at.refRawget}(_G,${sc('pcall')})) if _ok and _u and #_u~=${e2.uvCnt1} and ${e2.uvCnt1}~=-1 then ${n.killFn}();return end`);
add(` end`);
add(` end`);

add(` local _rs=${at.refRawget}(_G,${sc('game')})`);
add(` if not _rs then return end`);
add(` local _ok,${e2.rsvc2}=${at.refPcall}(function() return _rs:GetService(${sc('RunService')}) end)`);
add(` if not _ok or not ${e2.rsvc2} then return end`);
add(` local ${e2.hbTick2}=0`);
add(` ${at.refPcall}(function()`);
add(` ${e2.hbConn2}=${e2.rsvc2}.Heartbeat:Connect(function(dt)`);
add(` ${e2.hbTick2}=${e2.hbTick2}+dt`);
add(` if ${e2.hbTick2}<1 then return end`);
add(` ${e2.hbTick2}=0`);
add(` ${at.refPcall}(${e2.checkSnap})`);
add(` end)`);
add(` end)`);

add(` end)`);
add(`end`);

const e3 = {};
['instMT','gMT','origMetas','curMeta',
'ncConn','ncTick','rsvc3','gmtFn','grmFn2',
'checkMeta'].forEach(k => { e3[k] = N(); });

const instanceMetas = [
'__namecall','__index','__newindex',
'__tostring','__len','__call','__concat',
];

add(`do`);
add(` ${at.refPcall}(function()`);
add(` local ${e3.gmtFn}=${at.refRawget}(_G,${sc('getmetatable')})`);
add(` local ${e3.grmFn2}=${at.refRawget}(_G,${sc('getrawmetatable')})`);
add(` if type(${e3.gmtFn})~="function" then return end`);
add(` local _ws=${at.refRawget}(_G,${sc('workspace')})`);
add(` if not _ws then return end`);

add(` local ${e3.instMT}=${e3.gmtFn}(_ws)`);
add(` if not ${e3.instMT} then return end`);
add(` local ${e3.origMetas}={}`);
for (const mm of instanceMetas) {
add(` ${e3.origMetas}[${sc(mm)}]=${at.refRawget}(${e3.instMT},${sc(mm)})`);
}

add(` local _gMT=${e3.gmtFn}(_G)`);
add(` local _gMTsnap={}`);
add(` if _gMT then`);
add(` _gMTsnap[${sc('__index')}]=${at.refRawget}(_gMT,${sc('__index')})`);
add(` _gMTsnap[${sc('__newindex')}]=${at.refRawget}(_gMT,${sc('__newindex')})`);
add(` end`);

add(` local ${e3.checkMeta}=function()`);

for (const mm of instanceMetas) {
add(` do`);
add(` local _cur=${at.refRawget}(${e3.instMT},${sc(mm)})`);
add(` local _orig=${e3.origMetas}[${sc(mm)}]`);

add(` if not ${at.refRawequal}(_cur,_orig) then ${n.killFn}();return end`);

add(` if _cur~=nil and tostring(_cur)~=tostring(_orig) then ${n.killFn}();return end`);
add(` end`);
}

add(` if _gMT then`);
add(` local _ci=${at.refRawget}(_gMT,${sc('__index')})`);
add(` local _cn=${at.refRawget}(_gMT,${sc('__newindex')})`);
add(` if not ${at.refRawequal}(_ci,_gMTsnap[${sc('__index')}]) then ${n.killFn}();return end`);
add(` if not ${at.refRawequal}(_cn,_gMTsnap[${sc('__newindex')}]) then ${n.killFn}();return end`);
add(` end`);

add(` if ${e3.grmFn2} then`);
add(` local _raw=${at.refPcall}(function()`);
add(` local _a=${e3.gmtFn}(_ws);local _b=${e3.grmFn2}(_ws)`);
add(` if _a~=_b then ${n.killFn}() end`);
add(` end)`);
add(` end`);
add(` end`);

add(` ${at.refPcall}(${e3.checkMeta})`);

add(` local _rs=${at.refRawget}(_G,${sc('game')})`);
add(` if not _rs then return end`);
add(` local _ok,${e3.rsvc3}=${at.refPcall}(function() return _rs:GetService(${sc('RunService')}) end)`);
add(` if not _ok or not ${e3.rsvc3} then return end`);
add(` local ${e3.ncTick}=0`);
add(` ${at.refPcall}(function()`);
add(` ${e3.ncConn}=${e3.rsvc3}.Heartbeat:Connect(function(dt)`);
add(` ${e3.ncTick}=${e3.ncTick}+dt`);
add(` if ${e3.ncTick}<0.75 then return end`);
add(` ${e3.ncTick}=0`);
add(` ${at.refPcall}(${e3.checkMeta})`);
add(` end)`);
add(` end)`);

add(` end)`);
add(`end`);

add(` if ${at.atKill} then`);
add(` ${n.killFn}()`);
add(` return`);
add(` end`);
add(`end`);

const el = {};
[
'ranTimes','hbConn2','success','result','msg',
'gKey','gVal','fenvVal',
'rawIdx','normIdx',
'gsRef','gsResult','gsExpect',
'grmFn','gmtFn2','rmtResult','gmtResult',
'jsonSvc','jsonStr','jsonRes',
'childCount','serviceCount',
'invalidInst','invalidOk',
'explorerOk',
'taskRef','spawnRef',
].forEach(k => { el[k] = N(); });

const gKeyStr = '_gg' + crypto.randomBytes(4).toString('hex');
const gValStr = crypto.randomBytes(6).toString('hex');

const jsonNums = Array.from({length:4}, () => randInt(10, 999));
const jsonStr = `[${jsonNums[0]}, "${crypto.randomBytes(4).toString('hex')}", true, ${jsonNums[1]}, false, [${jsonNums[2]}, null, "${crypto.randomBytes(4).toString('hex')}"], null]`;
const jsonIdx6 = 2; 

add(`do`);
add(` local ${n.pcall_}=pcall`);

add(` local ${el.ranTimes}=0`);
add(` local ${el.hbConn2}`);
add(` ${n.pcall_}(function()`);
add(` local _rs=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _rs then return end`);
add(` local _ok,_rssvc=${n.pcall_}(function() return _rs:GetService(${sc('RunService')}) end)`);
add(` if not _ok then return end`);
add(` ${el.hbConn2}=_rssvc.Heartbeat:Connect(function()`);
add(` ${el.ranTimes}=${el.ranTimes}+1`);
add(` end)`);
add(` local _t=0`);
add(` repeat _t=_t+task.wait() until ${el.ranTimes}>=2`);
add(` ${el.hbConn2}:Disconnect()`);

add(` if ${el.ranTimes}>8 then ${n.killFn}() end`);
add(` end)`);

add(` local ${el.invalidOk}=${n.pcall_}(function()`);
add(` Instance.new(${sc('Part')}):${crypto.randomBytes(4).toString('hex').toUpperCase()}(${sc('a')})`);
add(` end)`);

add(` while ${el.invalidOk} do ${n.killFn}() end`);

add(` local ${el.explorerOk}=true`);
add(` ${n.pcall_}(function()`);
add(` local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _g then return end`);
add(` _g:GetChildren(function()`);
add(` ${el.explorerOk}=false`);
add(` while true do ;({})[nil]=true end`);
add(` end)`);
add(` end)`);
add(` if not ${el.explorerOk} then ${n.killFn}() end`);

add(` ${n.pcall_}(function()`);
add(` local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _g then return end`);
add(` local ${el.childCount}=#_g:GetChildren()`);
add(` if ${el.childCount}>50 then ${n.killFn}() end`);
add(` end)`);

add(` ${n.pcall_}(function()`);
add(` local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _g then return end`);
add(` local _ok,${el.jsonSvc}=${n.pcall_}(function()`);
add(` return _g:GetService(${sc('HttpService')})`);
add(` end)`);
add(` if not _ok or not ${el.jsonSvc} then return end`);
add(` local ${el.success},${el.jsonRes}=${n.pcall_}(function()`);
add(` return ${el.jsonSvc}:JSONDecode(${sc(jsonStr)})`);
add(` end)`);

add(` if not ${el.success} then ${n.killFn}();return end`);

add(` if ${el.jsonRes} and ${el.jsonRes}[6] and ${el.jsonRes}[6][2]~=nil then ${n.killFn}() end`);
add(` end)`);

add(` local ${el.success}=${n.pcall_}(function()`);
add(` local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _g then error("") end`);
add(` local _=_g.HttpService`);
add(` end)`);
add(` if ${el.success} then ${n.killFn}() end`);

add(` ${n.pcall_}(function()`);
add(` local _gf=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getfenv')})`);
add(` if type(_gf)~="function" then return end`);
add(` rawset(_G,${sc(gKeyStr)},${sc(gValStr)})`);
add(` local ${el.fenvVal}=_gf()[${sc(gKeyStr)}]`);
add(` rawset(_G,${sc(gKeyStr)},nil)`);
add(` if ${el.fenvVal}~=${sc(gValStr)} then ${n.killFn}() end`);
add(` end)`);

add(` ${n.pcall_}(function()`);
add(` local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _g then return end`);
add(` local _ok,${el.msg}=${n.pcall_}(function() _g() end)`);
add(` if _ok then ${n.killFn}();return end`);
add(` if not ${el.msg}:find(${sc('attempt to call')}) then ${n.killFn}() end`);
add(` end)`);

add(` ${n.pcall_}(function()`);
add(` local _sentinel=${sc(crypto.randomBytes(8).toString('hex'))}`);
add(` rawset(_G,${sc(gKeyStr.slice(0,8))},_sentinel)`);
add(` local ${el.rawIdx}=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc(gKeyStr.slice(0,8))})`);
add(` local ${el.normIdx}=_G[${sc(gKeyStr.slice(0,8))}]`);
add(` rawset(_G,${sc(gKeyStr.slice(0,8))},nil)`);
add(` if ${el.rawIdx}~=${el.normIdx} then ${n.killFn}() end`);
add(` end)`);

add(` ${n.pcall_}(function()`);
add(` local ${el.gsRef}=rawget(string,${sc('gsub')})`);
add(` if type(${el.gsRef})~="function" then ${n.killFn}();return end`);
add(` local ${el.gsResult}=${el.gsRef}(${sc('aXbXc')},${sc('X')},${sc('_')})`);
add(` if ${el.gsResult}~=${sc('a_b_c')} then ${n.killFn}() end`);
add(` end)`);

add(` ${n.pcall_}(function()`);
add(` local ${el.grmFn}=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getrawmetatable')})`);
add(` local ${el.gmtFn2}=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getmetatable')})`);
add(` if type(${el.grmFn})~="function" or type(${el.gmtFn2})~="function" then return end`);
add(` local _ws=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('workspace')})`);
add(` if not _ws then return end`);
add(` local ${el.rmtResult}=${el.grmFn}(_ws)`);
add(` local ${el.gmtResult}=${el.gmtFn2}(_ws)`);

add(` if ${el.rmtResult}~=${el.gmtResult} then ${n.killFn}() end`);
add(` end)`);

add(`end`);

const hp = {};
[
'co','coStatus','tp','mr','tbl','sv','rv',
'sl1','sl2','pr','addr1','addr2',
].forEach(k => { hp[k] = N(); });

add(`do`);

add(` pcall(function()`);
add(` local _cr=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('coroutine')})`);
add(` if not _cr then return end`);
add(` local ${hp.co}=_cr.running()`);

add(` if ${hp.co}~=nil then`);
add(` local ${hp.coStatus}=_cr.status(${hp.co})`);

add(` if ${hp.coStatus}~=${sc('running')} then ${n.killFn}() end`);
add(` end`);
add(` end)`);

add(` pcall(function()`);
add(` local _dbg=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('debug')})`);
add(` if not _dbg or not _dbg.getinfo then return end`);

add(` local _info=_dbg.getinfo(rawget)`);
add(` if _info and _info.what~=${sc('C')} then ${n.killFn}() end`);

add(` local _info2=_dbg.getinfo(pcall)`);
add(` if _info2 and _info2.what~=${sc('C')} then ${n.killFn}() end`);

add(` local _info3=_dbg.getinfo(tostring)`);
add(` if _info3 and _info3.what~=${sc('C')} then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local ${hp.addr1}=tostring(rawget)`);
add(` local ${hp.addr2}=tostring(rawget)`);

add(` if ${hp.addr1}~=${hp.addr2} then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local _tp=rawget(table,${sc('pack')})`);
add(` if type(_tp)~="function" then return end`);
add(` local ${hp.tp}=_tp(1,2,3)`);
add(` if not ${hp.tp} or ${hp.tp}.n~=3 then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local _mr=rawget(math,${sc('random')})`);
add(` if type(_mr)~="function" then return end`);
add(` local ${hp.mr}=_mr(1,1)`);
add(` if ${hp.mr}~=1 then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local ${hp.tbl}={}`);

const rtKey = sc(crypto.randomBytes(6).toString('hex'));
const rtVal = sc(crypto.randomBytes(6).toString('hex'));
add(` rawset(${hp.tbl},${rtKey},${rtVal})`);
add(` local ${hp.rv}=rawget(${hp.tbl},${rtKey})`);
add(` if ${hp.rv}~=${rtVal} then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
const lenStr = sc(crypto.randomBytes(8).toString('hex'));
const lenVal = 16; 
add(` local _s=${lenStr}`);
add(` local ${hp.sl1}=#_s`);
add(` local ${hp.sl2}=string.len(_s)`);
add(` if ${hp.sl1}~=${hp.sl2} then ${n.killFn}() end`);
add(` if ${hp.sl1}~=${lenVal} then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local ${hp.pr}=pcall(function() end)`);
add(` if type(${hp.pr})~="boolean" then ${n.killFn}() end`);
add(` if ${hp.pr}~=true then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local _dbg=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('debug')})`);
add(` if not _dbg or not _dbg.getinfo then return end`);
add(` local _i1=_dbg.getinfo(rawget,${sc('u')})`);
add(` if _i1 and _i1.nups and _i1.nups>0 then ${n.killFn}() end`);
add(` local _i2=_dbg.getinfo(rawset,${sc('u')})`);
add(` if _i2 and _i2.nups and _i2.nups>0 then ${n.killFn}() end`);
add(` local _i3=_dbg.getinfo(tostring,${sc('u')})`);
add(` if _i3 and _i3.nups and _i3.nups>0 then ${n.killFn}() end`);
add(` end)`);

add(`end`);

const p3 = {};
[
'instNew','instType','cnRes','tsTrue','tsFalse','tsNil',
'repRes','tblA','tblLen','selCount',
'xpcallHit','hbDrift','hbPrev','hbDelta','hbConn3','rsvc4',
'ipairsTbl','nextTbl','mathT',
].forEach(k => { p3[k] = N(); });

add(`do`);

add(` pcall(function()`);
add(` local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('typeof')})`);
add(` local _in=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('Instance')})`);
add(` if not _tw or not _in then return end`);
add(` if _tw(_in.new)~=${sc('function')} then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('typeof')})`);
add(` local _in=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('Instance')})`);
add(` if not _tw or not _in then return end`);
add(` local _ok,_p=pcall(_in.new,${sc('Part')})`);
add(` if _ok and _p then`);
add(` if _tw(_p)~=${sc('Instance')} then ${n.killFn}() end`);
add(` pcall(function() _p:Destroy() end)`);
add(` end`);
add(` end)`);

add(` pcall(function()`);
add(` local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _g then return end`);
add(` local _ok,${p3.cnRes}=pcall(function() return _g.ClassName end)`);
add(` if _ok and ${p3.cnRes}~=${sc('DataModel')} then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` if tostring(true)~=${sc('true')} then ${n.killFn}() end`);
add(` if tostring(false)~=${sc('false')} then ${n.killFn}() end`);
add(` if tostring(nil)~=${sc('nil')} then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` if math.huge~=math.huge*2 then ${n.killFn}() end`);
add(` if math.huge<=1e308 then ${n.killFn}() end`);
add(` if type(math.huge)~=${sc('number')} then ${n.killFn}() end`);
add(` end)`);

const repSeed = crypto.randomBytes(2).toString('hex');
const repN = randInt(3, 7);
const repOut = repSeed.repeat(repN);
add(` pcall(function()`);
add(` local _r=string.rep(${sc(repSeed)},${repN})`);
add(` if _r~=${sc(repOut)} then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local ${p3.tblA}={10,20,30}`);
add(` table.remove(${p3.tblA},1)`);
add(` if #${p3.tblA}~=2 or ${p3.tblA}[1]~=20 then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local ${p3.selCount}=select(${sc('#')},1,2,3,4,5)`);
add(` if ${p3.selCount}~=5 then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` if type(nil)~=${sc('nil')} then ${n.killFn}() end`);
add(` if type({})~=${sc('table')} then ${n.killFn}() end`);
add(` if type(1)~=${sc('number')} then ${n.killFn}() end`);
add(` if type("x")~=${sc('string')} then ${n.killFn}() end`);
add(` if type(true)~=${sc('boolean')} then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` if rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('io')})~=nil then ${n.killFn}() end`);
add(` local _os=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('os')})`);
add(` if _os and rawget(_os,${sc('execute')})~=nil then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local _gf=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getfenv')})`);
add(` if type(_gf)~="function" then return end`);
add(` local _f0=_gf(0)`);

add(` if rawequal(_f0,_G) then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local _cy=rawget(coroutine,${sc('yield')})`);
add(` if type(_cy)~="function" then return end`);
add(` local _ok=pcall(_cy)`);

add(` if _ok then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local _smt=getmetatable("")`);
add(` if not _smt then return end`);
add(` local _idx=rawget(_smt,${sc('__index')})`);

add(` if _idx~=string then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local _mt=rawget(math,${sc('type')})`);
add(` if type(_mt)~="function" then return end`);
add(` if _mt(1)~=${sc('integer')} then ${n.killFn}() end`);
add(` if _mt(1.0)~=${sc('float')} then ${n.killFn}() end`);
add(` if _mt("x")~=false then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local ${p3.tblA}={1,2,3,4,5}`);
add(` local ${p3.tblLen}=rawlen(${p3.tblA})`);
add(` if ${p3.tblLen}~=5 then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
const errMsg = sc(crypto.randomBytes(6).toString('hex'));
add(` local _ok,_err=pcall(function() error(${errMsg}) end)`);
add(` if _ok then ${n.killFn}() end`);
add(` if type(_err)~="string" then ${n.killFn}() end`);
add(` if not _err:find(${errMsg}) then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local ${p3.xpcallHit}=false`);
add(` xpcall(function() error("x") end,function() ${p3.xpcallHit}=true end)`);
add(` if not ${p3.xpcallHit} then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local ${p3.ipairsTbl}={10,20,nil,40}`);
add(` local _count=0`);
add(` for _,_ in ipairs(${p3.ipairsTbl}) do _count=_count+1 end`);

add(` if _count~=2 then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local ${p3.nextTbl}={}`);
add(` local _k,_v=next(${p3.nextTbl})`);
add(` if _k~=nil or _v~=nil then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _g then return end`);
add(` local _ok,${p3.rsvc4}=pcall(function() return _g:GetService(${sc('RunService')}) end)`);
add(` if not _ok or not ${p3.rsvc4} then return end`);
add(` local _samples=0;local _total=0;local ${p3.hbConn3}`);
add(` ${p3.hbConn3}=${p3.rsvc4}.Heartbeat:Connect(function(dt)`);
add(` _samples=_samples+1`);
add(` _total=_total+dt`);
add(` if _samples<10 then return end`);
add(` ${p3.hbConn3}:Disconnect()`);

add(` local _avg=_total/_samples`);
add(` if _avg<0.001 or _avg>2 then ${n.killFn}() end`);
add(` end)`);
add(` end)`);

add(`end`);

const p4 = {};
[
'plrs','placeId','grav','httpEn','scr',
'isClient','isServer','taskRet','clk1','clk2',
].forEach(k => { p4[k] = N(); });

add(`do`);

add(` pcall(function()`);
add(` local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _g then return end`);
add(` local _ok,${p4.plrs}=pcall(function() return _g:GetService(${sc('Players')}) end)`);
add(` if not _ok or not ${p4.plrs} then return end`);
add(` local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('typeof')})`);
add(` if _tw and _tw(${p4.plrs})~=${sc('Instance')} then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _g then return end`);
add(` local _ok,_uis=pcall(function() return _g:GetService(${sc('UserInputService')}) end)`);

add(` if _ok and _uis then`);
add(` local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('typeof')})`);
add(` if _tw and _tw(_uis)~=${sc('Instance')} then ${n.killFn}() end`);
add(` end`);
add(` end)`);

add(` pcall(function()`);
add(` local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _g then return end`);
add(` local _ok,${p4.placeId}=pcall(function() return _g.PlaceId end)`);
add(` if _ok then`);
add(` if type(${p4.placeId})~="number" then ${n.killFn}() end`);

add(` if ${p4.placeId}<0 then ${n.killFn}() end`);
add(` end`);
add(` end)`);

add(` pcall(function()`);
add(` local _ws=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('workspace')})`);
add(` if not _ws then return end`);
add(` local _ok,${p4.grav}=pcall(function() return _ws.Gravity end)`);
add(` if _ok and type(${p4.grav})~="number" then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _g then return end`);
add(` local _ok,_hs=pcall(function() return _g:GetService(${sc('HttpService')}) end)`);
add(` if not _ok or not _hs then return end`);
add(` local _ok2,${p4.httpEn}=pcall(function() return _hs.HttpEnabled end)`);
add(` if _ok2 and type(${p4.httpEn})~="boolean" then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _g then return end`);
add(` local _ok,${p4.scr}=pcall(function() return _g:GetService(${sc('ScriptContext')}) end)`);
add(` if _ok and ${p4.scr} then`);
add(` local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('typeof')})`);
add(` if _tw and _tw(${p4.scr})~=${sc('Instance')} then ${n.killFn}() end`);
add(` end`);
add(` end)`);

add(` pcall(function()`);
add(` local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _g then return end`);
add(` local _ok,_ts=pcall(function() return _g:GetService(${sc('TweenService')}) end)`);
add(` if not _ok or not _ts then return end`);

add(` local _ok2=pcall(function() _ts:Create(nil,nil,nil) end)`);
add(` if _ok2 then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _g then return end`);
add(` local _ok,_rs=pcall(function() return _g:GetService(${sc('RunService')}) end)`);
add(` if not _ok or not _rs then return end`);
add(` local _ok2,${p4.isClient}=pcall(function() return _rs:IsClient() end)`);
add(` local _ok3,${p4.isServer}=pcall(function() return _rs:IsServer() end)`);
add(` if _ok2 and type(${p4.isClient})~="boolean" then ${n.killFn}() end`);
add(` if _ok3 and type(${p4.isServer})~="boolean" then ${n.killFn}() end`);

add(` if _ok2 and _ok3 and ${p4.isClient} and ${p4.isServer} then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('task')})`);
add(` if not _tw then return end`);
add(` local _ok,${p4.taskRet}=pcall(function() return _tw.wait(0) end)`);
add(` if _ok and type(${p4.taskRet})~="number" then ${n.killFn}() end`);
add(` if _ok and ${p4.taskRet}<0 then ${n.killFn}() end`);
add(` end)`);

add(` pcall(function()`);
add(` local _os=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('os')})`);
add(` if not _os then return end`);
add(` local _oc=rawget(_os,${sc('clock')})`);
add(` if type(_oc)~="function" then return end`);
add(` local ${p4.clk1}=_oc()`);
add(` local ${p4.clk2}=_oc()`);
add(` if type(${p4.clk1})~="number" then ${n.killFn}() end`);

add(` if ${p4.clk2}<${p4.clk1} then ${n.killFn}() end`);
add(` end)`);

add(`end`);

add(`pcall(function()`);
add(` local _b32=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('bit32')})`);
add(` if type(_b32)~="table" then ${n.killFn}() end`);
add(` local _bx=rawget(_b32,${sc('bxor')})`);
add(` if type(_bx)~="function" then ${n.killFn}() end`);

add(` if _bx(0,0)~=0 then ${n.killFn}() end`);
add(` if _bx(0xFFFF,0xFFFF)~=0 then ${n.killFn}() end`);

add(` local _tv=math.random(1,65534)`);
add(` local _tk=math.random(1,65534)`);
add(` if _bx(_bx(_tv,_tk),_tk)~=_tv then ${n.killFn}() end`);
add(`end)`);

add(`pcall(function()`);
add(` local _tsk=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('task')})`);
add(` if type(_tsk)~="table" then return end`);

add(` local _methods={${sc('wait')},${sc('spawn')},${sc('defer')},${sc('delay')}}`);
add(` for _,_m in ipairs(_methods) do`);
add(`  local _f=rawget(_tsk,_m)`);
add(`  if type(_f)~="function" then ${n.killFn}() end`);
add(`  if debug and debug.getinfo then`);
add(`   local _di=debug.getinfo(_f,"S")`);
add(`   if _di and _di.what~="C" then ${n.killFn}() end`);
add(`  end`);
add(` end`);
add(`end)`);

add(`pcall(function()`);
add(` local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('typeof')})`);
add(` if type(_tw)~="function" then ${n.killFn}() end`);

add(` if _tw(1)~="number" then ${n.killFn}() end`);
add(` if _tw("x")~="string" then ${n.killFn}() end`);
add(` if _tw(true)~="boolean" then ${n.killFn}() end`);
add(` if _tw(nil)~="nil" then ${n.killFn}() end`);
add(` if _tw({})~="table" then ${n.killFn}() end`);
add(`end)`);

add(`pcall(function()`);
add(` local _iNew=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('Instance')})`);
add(` if type(_iNew)~="table" then return end`);
add(` local _newFn=rawget(_iNew,${sc('new')})`);
add(` if type(_newFn)~="function" then return end`);
add(` local _ok,_part=pcall(_newFn,"Part")`);
add(` if not _ok or not _part then return end`);
add(` local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('typeof')})`);

add(` if _tw and _tw(_part)~="Instance" then ${n.killFn}() end`);

add(` local _ok2,_cn=pcall(function() return _part.ClassName end)`);
add(` if _ok2 and _cn~="Part" then ${n.killFn}() end`);
add(`end)`);

add(`pcall(function()`);
add(` local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('game')})`);
add(` if not _g then return end`);

add(` local _ok=pcall(function() return _g:GetService("__FakeService_xQz__") end)`);
add(` if _ok then ${n.killFn}() end`);
add(`end)`);

add(`pcall(function()`);
add(` local _v3=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('Vector3')})`);
add(` if type(_v3)~="table" then return end`);
add(` local _newFn=rawget(_v3,${sc('new')})`);
add(` if type(_newFn)~="function" then return end`);
add(` local _ok,_v=pcall(_newFn,1,2,3)`);
add(` if not _ok or not _v then return end`);
add(` local _ok2,_x=pcall(function() return _v.X end)`);
add(` if _ok2 and _x~=1 then ${n.killFn}() end`);
add(` local _ok3,_y=pcall(function() return _v.Y end)`);
add(` if _ok3 and _y~=2 then ${n.killFn}() end`);
add(`end)`);

add(`pcall(function()`);
add(` local _ss=rawget(string,${sc('split')})`);
add(` if type(_ss)~="function" then return end`);
add(` local _ok,_r=pcall(_ss,"a,b,c",",")`);
add(` if not _ok or type(_r)~="table" then return end`);
add(` if #_r~=3 then ${n.killFn}() end`);
add(` if _r[1]~="a" or _r[2]~="b" or _r[3]~="c" then ${n.killFn}() end`);
add(`end)`);

add(`pcall(function()`);
add(` local _buf=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('buffer')})`);
add(` if type(_buf)~="table" then return end`);
add(` local _create=rawget(_buf,${sc('create')})`);
add(` local _writeu8=rawget(_buf,${sc('writeu8')})`);
add(` local _readu8=rawget(_buf,${sc('readu8')})`);
add(` if type(_create)~="function" or type(_writeu8)~="function" or type(_readu8)~="function" then return end`);
add(` local _ok,_b=pcall(_create,4)`);
add(` if not _ok or not _b then return end`);
add(` local _ok2=pcall(_writeu8,_b,0,42)`);
add(` if not _ok2 then return end`);
add(` local _ok3,_v=pcall(_readu8,_b,0)`);
add(` if _ok3 and _v~=42 then ${n.killFn}() end`);
add(`end)`);

add(`pcall(function()`);
add(` local _grm=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getrawmetatable')})`);
add(` if type(_grm)~="function" then return end`);

add(` local _smt=_grm("")`);
add(` if type(_smt)=="table" then`);
add(`  if rawget(_smt,${sc('__namecall')})~=nil then ${n.killFn}() end`);
add(`  if rawget(_smt,${sc('__newindex')})~=nil then ${n.killFn}() end`);
add(` end`);
add(`end)`);

add(`pcall(function()`);
add(` local _ghu=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('gethui')})`);
add(` local _gcu=rawget((type(getfenv)=="function" and getfenv(0) or _G),${sc('getcoregui')})`);
add(` if type(_ghu)=="function" or type(_gcu)=="function" then ${n.killFn}() end`);
add(`end)`);

add(makeEntropyBlock(sourceBytes));

return L.join('\n') + '\n';
}

module.exports = { generateSecurityHeader };
