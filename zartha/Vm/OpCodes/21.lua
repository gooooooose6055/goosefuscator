-- CONCAT
-- Lua 5.1: R(A) = R(B) .. ... .. R(C)
-- Wrap each slot in tostring() so values that are not strings or numbers
-- (e.g. booleans produced by a comparison just before this instruction)
-- don't cause a "attempt to concatenate" runtime error in the VM output.
return function(instruction, shiftAmount, constant, settings)
	local reg_a = _G.getReg(instruction, "A")
	local reg_b = _G.getReg(instruction, "B")
	local reg_c = _G.getReg(instruction, "C")

	return ([=[
	do
		local _parts = {}
		for _ci = %d, %d do
			_parts[_ci - %d + 1] = tostring(Stack[_ci])
		end
		Stack[%d] = table.concat(_parts)
	end
	]=]):format(reg_b, reg_c, reg_b, reg_a)
end