const f = require('fengari');
const L = f.lauxlib.luaL_newstate();
f.lualib.luaL_openlibs(L);
const code = `
local vBx = function(a,b) 
  local r,s=0,1 
  while a>0 or b>0 do 
    if a%2~=b%2 then r=r+s end 
    a=math.floor(a/2)
    b=math.floor(b/2)
    s=s*2 
  end 
  return r 
end
for i=0,255 do 
  for j=0,255 do 
    if vBx(i,j) ~= (i|j)-(i&j) then 
      print('ERROR', i,j, vBx(i,j)) 
    end 
  end 
end 
print('TEST DONE')
`;
f.lauxlib.luaL_dostring(L, f.to_luastring(code));
