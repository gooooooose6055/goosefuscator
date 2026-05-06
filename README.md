# Goosefuscator

lua obfuscator for roblox, runs your script through prometheus + zartha + a bunch of custom vm layers and a security header. pretty much nothing gets through it

---

## what it does

```
your script
→ prometheus (string encrypt, proxify locals, vm wrapping, antitamper)
→ zartha (bytecode vm layer)
→ number encoding, global proxying, constant array, string encrypt, junk injection
→ 1-3 vm layers (rolling xor + base64, each unique per run)
→ security header (anti env log, anti debug, anti hook, anti tamper, kill switch)
→ deflate compress + custom alphabet encode + rolling xor
```

every single run produces completely different output, different keys, different variable names, different opcodes

---

## setup

need node 18+ and lua 5.1

```
npm install
node setup.js
```

setup.js downloads lua5.1 and lune into bin/ automatically. if you're on windows it grabs the binary from luabinaries, linux/mac uses apt/brew

---

## running the bot

make a .env file (copy .env.example) and fill in your discord token + client id

```
npm start
```

then use `/obfuscate` in discord and attach your .lua file

---

## commands

### `/obfuscate`
attach a .lua file or paste code inline

options:
- `layers` — how many vm layers (1-6, default 6, auto-capped based on script size)
- `strings` — string encryption on/off
- `security` — security header on/off
- `antidecomp` — anti decompile poison on/off

### `/ironhelp`
shows all the features

---

## security header checks

runs before everything else, outside all the vm layers

- executor namespace detection (50+ known exploits)
- env logger detection via __newindex / __index hooks on _G
- rawset/rawget disagreement probe
- canary tables (two different types)
- string lib tampering (char/byte/dump/format)
- pcall proxy detection through debug.getinfo
- debug hook active check
- anti timing (step debugger probe)
- coroutine.wrap spy detection
- kill switch — silent infinite loop if anything fires

---

## zartha

zartha is a bytecode vm obfuscator, it compiles your lua to bytecode then builds a custom interpreter around it. its included in the zartha/ folder, you can also run it standalone:

```
lua zartha/Main.lua input.lua output.lua
```

flags: `--antitamper` `--encryptstrings` `--controlflowflattening` `--minify`

---

## prometheus

prometheus is a source level obfuscator with ast transforms. config is in prometheus/goose_config.lua, currently runs: Vmify, EncryptStrings, NumbersToExpressions, ConstantArray, SplitStrings, ProxifyLocals, AddVararg, WrapInFunction, AntiTamper

---

## notes

- only works in roblox (luau), uses task.wait / Instance / game / bit32 / debug
- max file size 256kb
- zartha and prometheus both need lua 5.1 installed (setup.js handles this)
- if zartha or prometheus fail they get skipped automatically, the rest of the pipeline still runs
- outputs are never the same twice

