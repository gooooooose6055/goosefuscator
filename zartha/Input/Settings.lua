-- You cannot directly edit these and you must use flags in Main.lua to change these settings

return {
	["ConstantProtection"] = true,						-- Encrypts constants for stronger constant security
	["EncryptStrings"] = true, 						-- Encrypts strings in output for stronger security
	["AntiTamper"] = true,								-- Injects anti-tamper checks to detect script modification
	["ControlFlowFlattening"] = false,					-- Flattens control flow for simple obfuscation hardening
	--
	["Debug"] = false,									-- Enables debug tools to help debug errors
	["Minify"] = true, 								-- Minfies the output for smaller size
["Watermark"] = "File generated using Goosefuscator", 	-- Input any watermark you want here
	["LuaUCompatibility"] = true,						-- Removes Luau specific syntax to make it compatible with Lua 5.1 compiler
}
