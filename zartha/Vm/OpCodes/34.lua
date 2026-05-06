-- SETLIST (opcode 34)
-- R(A)[(C-1)*FPF+i] := R(A+i),  1 <= i <= B
-- FPF (fields per flush) = 50 in Lua 5.1.
--
-- Lua 5.1 spec edge case: if C == 0, the real block index is stored in the
-- raw word of the NEXT instruction (not the next logical instruction — the
-- literal next encoded word). TreeGenerator resolves this before calling us:
-- it reads allInstructions[index+1].Raw and stores it into inst.C, then
-- marks that next instruction as PSEUDO so the VM loop skips it.
-- By the time this handler runs, inst.C always holds the real block number.
--
-- B == 0: store everything from R(A+1) up to `top` (variable-length tail
-- from a previous CALL/VARARG with C==0 result count).
return function(Inst, shift, const)
	local reg_a = _G.getReg(Inst, "A")
	local reg_b = _G.getReg(Inst, "B")
	-- C comes in as a plain integer (already resolved by TreeGenerator)
	local reg_c = type(Inst.C) == "table" and Inst.C.i or (_G.getReg(Inst, "C"))

	-- Guard: if somehow C is still 0 at runtime (shouldn't happen after the
	-- compile-time fix, but belt-and-suspenders), default to block 1.
	-- We emit a runtime guard rather than silently writing to index 0.
	if reg_b == 0 then
		-- Variable length: stack top holds the last written register
		return ([=[
	do
		local _base = (%d - 1) * 50
		local _blk  = %d  -- pre-resolved block; 0 means compile-time fix missed it
		if _blk == 0 then _blk = 1 end
		local _lim  = top - %d
		for _i = 1, _lim do
			Stack[%d][_blk == 1 and _i or (_base + _i)] = Stack[%d + _i]
		end
	end
	]=]):format(reg_c, reg_c, reg_a, reg_a, reg_a)
	else
		return ([=[
	do
		local _base = (%d - 1) * 50
		for _i = 1, %d do
			Stack[%d][_base + _i] = Stack[%d + _i]
		end
	end
	]=]):format(reg_c, reg_b, reg_a, reg_a)
	end
end
