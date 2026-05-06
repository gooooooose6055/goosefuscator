-- Vm Template
return [=[
%s
%s
		-- VM function
		return (function()
			local Stack,Temp,Upvalues,ConstantsCache,ProtosConstants,vmEnv,pointer,top = {},{},{},{},{},{},1,0

			local Checks,ConstantsDecode = :INSERTENVLOG:,(function() -- Constants decode
				-- Position-XOR decoder: each data byte is XOR'd with a key derived
				-- from (slotIndex * 7 + bytePos * 13 + SHIFTER) % 223 + 1.
				-- The last byte of every constant is always a type identifier
				-- (11=number, 4=string, 7=boolean, 6=nil) and is NOT XOR-encoded.
				local _shi = :CONSTANT_SHIFTER:
				for i, v in pairs(Constants) do
					local len = #v
					local lastByte = byte(v, len)
					-- Undo position-XOR on all bytes except the trailing type id
					local decoded = {}
					for bi = 1, len - 1 do
						local kb = (i * 7 + bi * 13 + _shi) % 223 + 1
						decoded[bi] = char(bxor(byte(v, bi), kb))
					end
					local data = concat(decoded)
					if lastByte == 11 then
						ConstantsCache[i] = tonumber(data)
					elseif lastByte == 7 then
						ConstantsCache[i] = byte(data, 1) == 116 -- 't' == true
					elseif lastByte == 6 then
						ConstantsCache[i] = nil
					else
						-- lastByte == 4 (string) or any fallback
						ConstantsCache[i] = data
					end
				end
			end)()

			local C = ConstantsCache

			-- VM STARTS HERE
			while true do
				%s
				%s
			end
		end)()

]=]