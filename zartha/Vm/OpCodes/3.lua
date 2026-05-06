-- LOADNIL
-- In Lua 5.1 bytecode: sets R(A) through R(B) to nil.
-- B is an *absolute* register index, not an offset from A.
-- Bug was: loop used `0..reg_b` making it A..A+B instead of A..B.
return function(instruction, shiftAmount, constant, settings)
	local reg_a = _G.getReg(instruction, "A")
	local reg_b = _G.getReg(instruction, "B")

	if reg_a == reg_b then
		-- Single register
		return ("\tStack[%d] = nil"):format(reg_a)
	else
		local nils = {}
		for i = reg_a, reg_b do          -- A to B inclusive (both absolute)
			nils[#nils + 1] = ("Stack[%d]"):format(i)
		end
		return ("\t%s = nil"):format(table.concat(nils, ", "))
	end
end