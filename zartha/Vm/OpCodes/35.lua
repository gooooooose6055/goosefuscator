-- CLOSE
-- Lua 5.1 semantics: closes open upvalues for all registers >= A.
-- In this VM, upvalue reads/writes go through the __index/__newindex
-- metatable on Upvalues, so there are no "open upvalue" objects to
-- close. We nil the stack slots from A upward to release GC references,
-- which is the only observable side-effect that matters at runtime.
return function(instruction, shiftAmount, constant, settings)
	local reg_a = _G.getReg(instruction, "A")
	return ([=[
	-- CLOSE: release stack refs >= %d so GC can collect
	for _ci = %d, top do
		Stack[_ci] = nil
	end
	top = math.max(top, %d - 1)
	]=]):format(reg_a, reg_a, reg_a)
end

