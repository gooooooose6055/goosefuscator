return {
LuaVersion = "Lua51",
PrettyPrint = false,
Seed = 0,
Steps = {
{ Name = "Vmify" },
{ Name = "EncryptStrings" },
{ Name = "NumbersToExpressions"},
{ Name = "ConstantArray" },
{ Name = "SplitStrings" },
{ Name = "ProxifyLocals" },
{ Name = "AddVararg" },
{ Name = "WrapInFunction" },
{ Name = "AntiTamper",
Settings = { UseDebug = true }
},
}
}
