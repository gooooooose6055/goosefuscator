-- CALL (opcode 28)
-- R(A), ..., R(A+C-2) := R(A)(R(A+1), ..., R(A+B-1))
-- B == 0: args are R(A+1)..top  (preceding CALL/VARARG left variable results)
-- C == 0: store all results into R(A)..top  (caller doesn't know count)
-- C == 1: discard all results
-- C == 2: store exactly one result into R(A)
-- C >  2: store C-1 results into R(A)..R(A+C-2)
return function(Inst, shiftAmount, constant, settings)
	local reg_a = _G.getReg(Inst, "A")
	local reg_b = _G.getReg(Inst, "B")
	local reg_c = _G.getReg(Inst, "C")

	-- Helper: build fixed-arg call string
	local function fixedArgStr(count)
		local args = {}
		for i = 1, count do
			args[i] = ("Stack[%d]"):format(reg_a + i)
		end
		return table.concat(args, ", ")
	end

	-- Helper: result-storage snippet (fixed C > 0)
	local function fixedResultStore(argExpr)
		if reg_c == 0 then
			-- Variable result count: update top
			return ([=[
	do
		local _res = {Stack[:A:](%s)}
		local _len = #_res
		if _len == 0 then
			Stack[:A:] = nil; top = :A:
		else
			top = :A: + _len - 1
			for _i = 1, _len do Stack[:A: + _i - 1] = _res[_i] end
		end
	end
	]=]):format(argExpr)
		elseif reg_c == 1 then
			-- Discard all results
			return ("\tStack[:A:](%s)"):format(argExpr)
		elseif reg_c == 2 then
			-- Single result
			return ("\tStack[:A:] = Stack[:A:](%s)"):format(argExpr)
		else
			-- Multiple fixed results
			local slots = {}
			for i = 0, reg_c - 2 do
				slots[i + 1] = ("Stack[%d]"):format(reg_a + i)
			end
			return ("\t%s = Stack[:A:](%s)"):format(table.concat(slots, ", "), argExpr)
		end
	end

	if reg_b == 0 then
		-- Variable args: gather from reg_a+1 to top
		local varGather = ([=[
	do
		local _vargs = {}
		local _vc = 0
		for _i = :A: + 1, top do
			_vc = _vc + 1; _vargs[_vc] = Stack[_i]
		end
		local _argExpr = unpack(_vargs, 1, _vc)
		%s
	end
	]=])
		if reg_c == 0 then
			return ([=[
	do
		local _vargs = {}; local _vc = 0
		for _i = :A: + 1, top do _vc = _vc + 1; _vargs[_vc] = Stack[_i] end
		local _res = {Stack[:A:](unpack(_vargs, 1, _vc))}
		local _len = #_res
		if _len == 0 then Stack[:A:] = nil; top = :A:
		else top = :A: + _len - 1
			for _i = 1, _len do Stack[:A: + _i - 1] = _res[_i] end
		end
	end
	]=])
		elseif reg_c == 1 then
			return ([=[
	do
		local _vargs = {}; local _vc = 0
		for _i = :A: + 1, top do _vc = _vc + 1; _vargs[_vc] = Stack[_i] end
		Stack[:A:](unpack(_vargs, 1, _vc))
	end
	]=])
		elseif reg_c == 2 then
			return ([=[
	do
		local _vargs = {}; local _vc = 0
		for _i = :A: + 1, top do _vc = _vc + 1; _vargs[_vc] = Stack[_i] end
		Stack[:A:] = Stack[:A:](unpack(_vargs, 1, _vc))
	end
	]=])
		else
			local slots = {}
			for i = 0, reg_c - 2 do
				slots[i + 1] = ("Stack[%d]"):format(reg_a + i)
			end
			return ([=[
	do
		local _vargs = {}; local _vc = 0
		for _i = :A: + 1, top do _vc = _vc + 1; _vargs[_vc] = Stack[_i] end
		%s = Stack[:A:](unpack(_vargs, 1, _vc))
	end
	]=]):format(table.concat(slots, ", "))
		end
	else
		-- Fixed arg count
		local argStr = fixedArgStr(reg_b - 1)
		return fixedResultStore(argStr)
	end
end
