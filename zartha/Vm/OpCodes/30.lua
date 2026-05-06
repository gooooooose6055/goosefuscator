-- RETURN (opcode 30)
-- return R(A), ..., R(A+B-2)
-- B == 0: return R(A) through top  (variable-length, from prior variable-result CALL)
-- B == 1: no return values
-- B == 2: one return value R(A)
-- B >  2: fixed return values R(A) .. R(A+B-2)
--
-- Fix: `pointer = pointer + 1` is NOT needed before return — the VM while-loop
-- does that increment unconditionally. Returning exits the function directly.
return function(instruction, shiftAmount, constant, settings)
	local reg_a = _G.getReg(instruction, "A")
	local reg_b = _G.getReg(instruction, "B")

	if reg_b == 0 then
		-- Variable return count: return everything from reg_a to top
		return ([=[
	do
		local _out = {}
		local _n = 0
		for _i = %d, top do
			_n = _n + 1
			_out[_n] = Stack[_i]
		end
		return unpack(_out, 1, _n)
	end
	]=]):format(reg_a)
	elseif reg_b == 1 then
		-- No return values
		return "\treturn"
	elseif reg_b == 2 then
		-- Single return value
		return ("\treturn Stack[%d]"):format(reg_a)
	else
		-- Fixed multiple return values
		local rets = {}
		for i = 0, reg_b - 2 do
			rets[i + 1] = ("Stack[%d]"):format(reg_a + i)
		end
		return ("\treturn %s"):format(table.concat(rets, ", "))
	end
end
