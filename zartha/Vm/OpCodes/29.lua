-- TAILCALL (opcode 29)
-- return R(A)(R(A+1), ..., R(A+B-1))
-- B == 0: args are R(A+1) through `top` (from a prior variable-result call)
--
-- Fix: use the `unpack` local from Header (table.unpack or unpack fallback).
-- Previous code used bare `unpack` which is the same local — just made explicit.
-- The return passes results straight through so the caller's call frame is
-- reused (tail-call semantics are naturally handled by Lua itself here).
return function(Inst, shiftAmount, constant, settings)
	local reg_a = _G.getReg(Inst, "A")
	local reg_b = _G.getReg(Inst, "B")

	if reg_b == 0 then
		-- Variable args: collect from reg_a+1 to top
		return ([=[
	do
		local _targs = {}
		for _i = %d + 1, top do
			_targs[_i - %d] = Stack[_i]
		end
		return Stack[%d](unpack(_targs, 1, top - %d))
	end
	]=]):format(reg_a, reg_a, reg_a, reg_a)
	else
		local args = {}
		for i = 1, reg_b - 1 do
			args[i] = ("Stack[%d]"):format(reg_a + i)
		end
		return ("\treturn Stack[%d](%s)"):format(reg_a, table.concat(args, ", "))
	end
end
