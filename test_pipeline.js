'use strict';

const { wrapWithDecompressor } = require('./obfuscator/compress');

var luaParts = ['-- Standard Lua 5.1 script'];
for (var i = 0; i < 200; i++) {
  luaParts.push('local var_' + i + ' = "value_' + i + '_' + Math.random().toString(36).substring(2, 10) + '"');
  luaParts.push('print(var_' + i + ')');
}
luaParts.push('local t = {}');
for (var i = 0; i < 50; i++) {
  luaParts.push('t[' + (i+1) + '] = string.format("item_%03d_%s", ' + (i+1) + ', tostring(math.random(1, 9999)))');
}
luaParts.push('print(table.concat(t, "\\n"))');
var LUA_SCRIPT = luaParts.join('\n');

var luauParts = ['-- Roblox Luau script'];
for (var j = 0; j < 200; j++) {
  luauParts.push('local part_' + j + ' = Instance.new("Part")');
  luauParts.push('part_' + j + '.Name = "Part_' + j + '"');
  luauParts.push('part_' + j + '.Parent = workspace');
}
luauParts.push('game:GetService("RunService").Heartbeat:Connect(function()');
luauParts.push('  for _, p in ipairs(workspace:GetChildren()) do print(p.Name) end');
luauParts.push('end)');
var LUAU_SCRIPT = luauParts.join('\n');

let passed = 0, failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log('  ✓ ' + name);
    passed++;
  } catch (e) {
    console.log('  ✗ ' + name + ': ' + e.message);
    failed++;
  }
}

console.log('\n=== Lua/Luau Full Pipeline Tests ===');

test('Standard Lua script compresses', function() {
  var result = wrapWithDecompressor(LUA_SCRIPT);
  if (typeof result !== 'string' || result.length === 0) throw new Error('empty result');
  console.log('    Size: ' + LUA_SCRIPT.length + ' -> ' + result.length + ' bytes');
});

test('Luau script compresses', function() {
  var result = wrapWithDecompressor(LUAU_SCRIPT);
  if (typeof result !== 'string' || result.length === 0) throw new Error('empty result');
  console.log('    Size: ' + LUAU_SCRIPT.length + ' -> ' + result.length + ' bytes');
});

test('Output has bitwise fallback', function() {
  var result = wrapWithDecompressor(LUA_SCRIPT);
  if (result.indexOf('bxor') === -1 && result.indexOf('bit32') === -1)
    throw new Error('no bitwise support');
});

test('Output has loadstring/load fallback', function() {
  var result = wrapWithDecompressor(LUA_SCRIPT);
  // loadstring is encoded as string.char(108,111,97,100,115,116,114,105,110,103) in the output
  if (result.indexOf('string.char') === -1 && result.indexOf('loadstring') === -1 && result.indexOf('load') === -1)
    throw new Error('no load detected');
});

test('Output has CRC32 integrity check', function() {
  var result = wrapWithDecompressor(LUA_SCRIPT);
  if (result.indexOf('4294967295') === -1)
    throw new Error('no CRC32');
});

test('Empty script returns itself', function() {
  var result = wrapWithDecompressor('');
  if (result !== '') throw new Error('not empty');
});

test('Tiny script does not crash', function() {
  var result = wrapWithDecompressor('x=1');
  if (typeof result !== 'string') throw new Error('not a string');
});

console.log('\n==================================================');
console.log('Results: ' + passed + ' passed, ' + failed + ' failed');
if (failed > 0) process.exit(1);
else console.log('ALL TESTS PASSED ✓');
