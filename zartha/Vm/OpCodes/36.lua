-- CLOSURE
-- Builds a Lua function from a prototype's bytecode + constants.
-- Fixed: inline constant decoder now uses the same position-XOR scheme
-- as getConstants() in TreeGenerator.lua (was Caesar shift, now per-slot XOR).
-- Fixed: number decode no longer uses the VM's `pointer` as a start offset.
return function(inst, shiftAmount, constant, settings)
	local output = ([=[
	local prevStack = Stack
	local prevUpvalues = Upvalues
	local C1

	if not ProtosConstants[:PROTOHERE:] then
		C1 = {}
		local encoded = {CONSTANTS_PROTOTYPE:PROTOHERE:HERE}
		local _shi = :CONSTANT_SHIFTER:

		for i, v in pairs(encoded) do
			-- Position-XOR decode: matches getConstants() encoder in TreeGenerator.
			-- Last byte is always the type identifier (11/4/7/6), not XOR-encoded.
			local len = #v
			local lastByte = byte(v, len)
			local decoded = {}
			for bi = 1, len - 1 do
				local kb = (i * 7 + bi * 13 + _shi) % 223 + 1
				decoded[bi] = char(bxor(byte(v, bi), kb))
			end
			local data = concat(decoded)
			if lastByte == 11 then
				%s
			elseif lastByte == 7 then
				C1[i] = byte(data, 1) == 116 -- 't' == true
			elseif lastByte == 6 then
				C1[i] = nil
			else
				-- lastByte == 4 (string) or fallback
				C1[i] = data
			end
		end
		ProtosConstants[:PROTOHERE:] = C1
	else
		C1 = ProtosConstants[:PROTOHERE:]
	end

	Stack[:A:] = function(...) -- PROTOTYPE :PROTOHERE:
		local Varargs, Stack, Temp, Upvalues, pointer, top, Map = {}, {}, {}, {}, 1, 0, :MAPPING:
		local Args = {...}
		local C = C1

		-- fix upvalues
		if next(Map) then
			setmeta(Upvalues, {
			 [__index] = function(self, Key)
			 local map = Map[Key]
			 if not map then return nil end

			 if map[1] == 0 then -- Type 0: Parent Stack
			 return prevStack[map[2]]
			 else -- Type 1: Parent Upvalue
			 return prevUpvalues[map[2]]
			 end
			 end,
			 [__newindex] = function(self, Key, Value)
			 local map = Map[Key]
			 if not map then return end

			 if map[1] == 0 then
			 prevStack[map[2]] = Value
			 else
			 prevUpvalues[map[2]] = Value
			 end
			 end,
			 [__metatable] = {}
			})
		end
		-- Args
		local argCount = #Args
		for i = 1, argCount do
			Stack[i - 1] = Args[i]
			Varargs[i] = Args[i]
		end

		while true do
		INST_PROTOTYPE:PROTOHERE:HERE
		pointer = pointer+1
		end
	end
]=]):format(
		-- Number decode: tonumber(data) — data already has identifier stripped.
		-- No longer uses VM `pointer` as an offset (was a fragile bug).
		"C1[i] = tonumber(data)"
	)

	return output
end
