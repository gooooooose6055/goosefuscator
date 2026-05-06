-- VM Header: defines all locals scoped to the outer wrapper function
-- (Env, Constants, shiftKey, decrypt) so they are visible to the inner VM
-- closure and all opcode-generated code that closes over them.
--
-- HISTORY: this file was 0 bytes, which caused every generated script to crash
-- immediately because gsub/byte/char/unpack/tfind/etc were all nil.
return [=[
	-- ── String / table primitives ──────────────────────────────────
	local byte, char, sub, gsub, find, concat =
		string.byte, string.char, string.sub, string.gsub, string.find, table.concat

	-- unpack: Lua 5.1 global; LuaU / Lua 5.2+ stores it in table.unpack
	local unpack = table.unpack or unpack

	-- Single-char pattern used by the legacy gsub decoder path
	local dot = "."

	-- table.find polyfill (absent in standard Lua 5.1 and Lua 5.4)
	local tfind = table.find or function(t, val)
		for i = 1, #t do if t[i] == val then return i end end
		return nil
	end

	-- setmetatable shorthand (used by CLOSURE upvalue maps + EnvLogDetection)
	local setmeta = setmetatable

	-- bit32.bxor with cascading fallbacks:
	--   1. bit32 (Roblox / Lua 5.2)
	--   2. bit   (LuaJIT / some Lua 5.1 builds)
	--   3. pure-Lua software XOR
	local bxor = (bit32 and bit32.bxor) or (bit and bit.bxor) or
		function(a, b)
			local r, s = 0, 1
			while a > 0 or b > 0 do
				if a % 2 ~= b % 2 then r = r + s end
				a, b, s = math.floor(a / 2), math.floor(b / 2), s * 2
			end
			return r
		end

	-- ── EnvLogDetection locals ─────────────────────────────────────
	local pnt        = print
	local proxy      = newproxy or function() return setmeta({}, {}) end
	local stringv    = "string"
	local __newindex = "__newindex"
	local __index    = "__index"

	-- ── Populate Constants table ───────────────────────────────────
	-- The outer wrapper passes Constants in as {} (empty table). We fill it
	-- here from the encoded entries TreeGenerator substitutes in below.
	-- We use a nested `do` block with a distinct local name (_enc) so it
	-- doesn't shadow the outer `Constants` parameter.
	do
		local _enc = {CONSTANTS_HERE_BASEVM}
		for _k, _v in pairs(_enc) do
			Constants[_k] = _v
		end
	end
]=]
