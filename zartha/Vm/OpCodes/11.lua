-- SELF
-- R(A+1) := R(B); R(A) := R(B)[RK(C)]
-- Fixed: removed the erroneous `if Stack[A+1]` guard — Lua's SELF does not
-- conditionally skip the index; if R(B) is nil the runtime should error normally.
return function(inst, shiftAmount, constant, settings)
	local C = inst.C
	local reg_a = _G.getReg(inst, "A")
	local reg_b = _G.getReg(inst, "B")

	local c_access = C.k and ("C[%d]"):format(_G.getMappedConstant(C.i)) or ("Stack[%d]"):format(C.i)

	return ([=[
	Stack[%d] = Stack[%d]
	Stack[%d] = Stack[%d][%s]
	]=]):format(reg_a + 1, reg_b, reg_a, reg_b, c_access)
end