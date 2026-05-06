'use strict';

// Generate a realistic ~256KB Lua/Luau script and obfuscate it via the API
const http = require('http');

// Build a realistic game script (~256KB)
const parts = [];
parts.push('-- Goosefuscator Stress Test: 256KB Realistic Luau Game Script');
parts.push('-- This script simulates a full game framework with UI, data, combat, and inventory');
parts.push('');

// Module 1: Configuration (~20KB)
parts.push('local Config = {}');
parts.push('Config.VERSION = "3.2.1"');
parts.push('Config.DEBUG = false');
parts.push('Config.MAX_PLAYERS = 50');
for (let i = 0; i < 120; i++) {
  parts.push('Config["SETTING_' + i + '"] = {');
  parts.push('  name = "Setting ' + i + '",');
  parts.push('  value = ' + (Math.random() * 1000).toFixed(2) + ',');
  parts.push('  enabled = ' + (Math.random() > 0.5 ? 'true' : 'false') + ',');
  parts.push('  description = "Configuration parameter #' + i + ' for the game engine",');
  parts.push('  category = "' + ['General', 'Combat', 'UI', 'Network', 'Audio'][i % 5] + '",');
  parts.push('  min = ' + Math.floor(Math.random() * 10) + ',');
  parts.push('  max = ' + (100 + Math.floor(Math.random() * 900)) + ',');
  parts.push('}');
}

// Module 2: Item Database (~60KB)
parts.push('');
parts.push('local ItemDB = {}');
const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
const itemTypes = ['Sword', 'Shield', 'Helmet', 'Chestplate', 'Boots', 'Ring', 'Amulet', 'Potion', 'Scroll', 'Bow'];
for (let i = 0; i < 300; i++) {
  const rarity = rarities[i % rarities.length];
  const type = itemTypes[i % itemTypes.length];
  parts.push('ItemDB[' + (i + 1) + '] = {');
  parts.push('  id = ' + (i + 1) + ',');
  parts.push('  name = "' + rarity + ' ' + type + ' of ' + ['Fire', 'Ice', 'Thunder', 'Shadow', 'Light', 'Nature'][i % 6] + '",');
  parts.push('  type = "' + type + '",');
  parts.push('  rarity = "' + rarity + '",');
  parts.push('  level = ' + (1 + Math.floor(i / 5)) + ',');
  parts.push('  damage = ' + (10 + i * 3) + ',');
  parts.push('  defense = ' + (5 + i * 2) + ',');
  parts.push('  health = ' + (50 + i * 10) + ',');
  parts.push('  mana = ' + (20 + i * 5) + ',');
  parts.push('  critChance = ' + (Math.random() * 0.5).toFixed(3) + ',');
  parts.push('  price = ' + (100 + i * 50) + ',');
  parts.push('  stackable = ' + (type === 'Potion' || type === 'Scroll' ? 'true' : 'false') + ',');
  parts.push('  description = "A powerful ' + rarity.toLowerCase() + ' ' + type.toLowerCase() + ' forged in the depths of the ancient realm.",');
  parts.push('}');
}

// Module 3: Combat System (~40KB)
parts.push('');
parts.push('local Combat = {}');
parts.push('Combat.ActiveFights = {}');
parts.push('');
for (let i = 0; i < 50; i++) {
  parts.push('function Combat.calculateDamage_' + i + '(attacker, defender, weapon)');
  parts.push('  local baseDmg = attacker.stats.strength * ' + (1.5 + Math.random()).toFixed(2));
  parts.push('  local weaponDmg = weapon and weapon.damage or 0');
  parts.push('  local defense = defender.stats.defense * ' + (0.5 + Math.random() * 0.5).toFixed(2));
  parts.push('  local critRoll = math.random()');
  parts.push('  local isCrit = critRoll < (attacker.stats.critChance or 0.05)');
  parts.push('  local multiplier = isCrit and ' + (1.5 + Math.random()).toFixed(2) + ' or 1.0');
  parts.push('  local totalDmg = math.max(1, math.floor((baseDmg + weaponDmg - defense) * multiplier))');
  parts.push('  if Config.DEBUG then');
  parts.push('    print(string.format("[Combat] %s -> %s: %d dmg (crit: %s)", attacker.name, defender.name, totalDmg, tostring(isCrit)))');
  parts.push('  end');
  parts.push('  return totalDmg, isCrit');
  parts.push('end');
  parts.push('');
}

// Module 4: Player Management (~40KB)
parts.push('local PlayerManager = {}');
parts.push('PlayerManager.Players = {}');
parts.push('PlayerManager.Cache = {}');
parts.push('');
for (let i = 0; i < 35; i++) {
  parts.push('function PlayerManager.processAction_' + i + '(player, action, data)');
  parts.push('  if not player or not player.character then return false, "Invalid player" end');
  parts.push('  local startTime = tick()');
  parts.push('  local success = false');
  parts.push('  local result = nil');
  parts.push('  ');
  parts.push('  if action == "attack" then');
  parts.push('    local target = data and data.target');
  parts.push('    if target and target.health > 0 then');
  parts.push('      local dmg, crit = Combat.calculateDamage_' + (i % 80) + '(player, target, player.equipment.weapon)');
  parts.push('      target.health = math.max(0, target.health - dmg)');
  parts.push('      result = {damage = dmg, critical = crit, targetHealth = target.health}');
  parts.push('      success = true');
  parts.push('    end');
  parts.push('  elseif action == "heal" then');
  parts.push('    local amount = data and data.amount or ' + (20 + i * 5));
  parts.push('    player.health = math.min(player.maxHealth, player.health + amount)');
  parts.push('    result = {healed = amount, currentHealth = player.health}');
  parts.push('    success = true');
  parts.push('  elseif action == "useItem" then');
  parts.push('    local itemId = data and data.itemId');
  parts.push('    local item = ItemDB[itemId]');
  parts.push('    if item then');
  parts.push('      result = {item = item.name, effect = "applied"}');
  parts.push('      success = true');
  parts.push('    end');
  parts.push('  end');
  parts.push('  ');
  parts.push('  local elapsed = tick() - startTime');
  parts.push('  if Config.DEBUG then');
  parts.push('    print(string.format("[PlayerManager] Action %s for %s took %.4fs", action, player.name, elapsed))');
  parts.push('  end');
  parts.push('  return success, result');
  parts.push('end');
  parts.push('');
}

// Module 5: UI Framework (~30KB)
parts.push('local UI = {}');
parts.push('UI.Elements = {}');
parts.push('UI.ActiveScreens = {}');
parts.push('');
for (let i = 0; i < 30; i++) {
  parts.push('function UI.createPanel_' + i + '(parent, config)');
  parts.push('  local frame = Instance.new("Frame")');
  parts.push('  frame.Name = "Panel_' + i + '"');
  parts.push('  frame.Size = UDim2.new(' + (Math.random()).toFixed(2) + ', 0, ' + (Math.random()).toFixed(2) + ', 0)');
  parts.push('  frame.Position = UDim2.new(' + (Math.random()).toFixed(2) + ', 0, ' + (Math.random()).toFixed(2) + ', 0)');
  parts.push('  frame.BackgroundColor3 = Color3.fromRGB(' + Math.floor(Math.random()*255) + ', ' + Math.floor(Math.random()*255) + ', ' + Math.floor(Math.random()*255) + ')');
  parts.push('  frame.BackgroundTransparency = ' + (Math.random() * 0.5).toFixed(2));
  parts.push('  frame.BorderSizePixel = 0');
  parts.push('  ');
  parts.push('  local corner = Instance.new("UICorner")');
  parts.push('  corner.CornerRadius = UDim.new(0, ' + (4 + Math.floor(Math.random() * 12)) + ')');
  parts.push('  corner.Parent = frame');
  parts.push('  ');
  parts.push('  local label = Instance.new("TextLabel")');
  parts.push('  label.Name = "Title"');
  parts.push('  label.Size = UDim2.new(1, -20, 0, 30)');
  parts.push('  label.Position = UDim2.new(0, 10, 0, 5)');
  parts.push('  label.BackgroundTransparency = 1');
  parts.push('  label.Text = config and config.title or "Panel ' + i + '"');
  parts.push('  label.TextColor3 = Color3.new(1, 1, 1)');
  parts.push('  label.TextSize = 16');
  parts.push('  label.Font = Enum.Font.GothamBold');
  parts.push('  label.Parent = frame');
  parts.push('  ');
  parts.push('  frame.Parent = parent');
  parts.push('  UI.Elements["Panel_' + i + '"] = frame');
  parts.push('  return frame');
  parts.push('end');
  parts.push('');
}

// Module 6: Network Layer (~30KB)
parts.push('local Network = {}');
parts.push('Network.Remotes = {}');
parts.push('Network.RateLimits = {}');
parts.push('');
for (let i = 0; i < 30; i++) {
  parts.push('function Network.handleRequest_' + i + '(player, requestType, payload)');
  parts.push('  local now = tick()');
  parts.push('  local playerId = player.UserId');
  parts.push('  ');
  parts.push('  if not Network.RateLimits[playerId] then');
  parts.push('    Network.RateLimits[playerId] = {lastRequest = 0, count = 0}');
  parts.push('  end');
  parts.push('  ');
  parts.push('  local rateData = Network.RateLimits[playerId]');
  parts.push('  if now - rateData.lastRequest < ' + (0.1 + Math.random() * 0.5).toFixed(2) + ' then');
  parts.push('    rateData.count = rateData.count + 1');
  parts.push('    if rateData.count > ' + (5 + Math.floor(Math.random() * 10)) + ' then');
  parts.push('      warn("[Network] Rate limited player: " .. player.Name)');
  parts.push('      return false, "RATE_LIMITED"');
  parts.push('    end');
  parts.push('  else');
  parts.push('    rateData.count = 0');
  parts.push('  end');
  parts.push('  rateData.lastRequest = now');
  parts.push('  ');
  parts.push('  local success, result = pcall(function()');
  parts.push('    return PlayerManager.processAction_' + (i % 60) + '(player, requestType, payload)');
  parts.push('  end)');
  parts.push('  ');
  parts.push('  if not success then');
  parts.push('    warn("[Network] Error handling request: " .. tostring(result))');
  parts.push('    return false, "INTERNAL_ERROR"');
  parts.push('  end');
  parts.push('  return result');
  parts.push('end');
  parts.push('');
}

// Module 7: Data tables (~36KB of string data)
parts.push('local Strings = {}');
for (let i = 0; i < 300; i++) {
  const phrases = [
    'The ancient warrior strikes with fury',
    'A mysterious potion bubbles in the cauldron',
    'The enchanted sword glows with ethereal light',
    'Dark shadows creep across the battlefield',
    'The healer channels divine energy',
    'Thunder crashes as lightning bolts rain down',
    'The shield absorbs the devastating blow',
    'Arrows fly through the misty forest',
  ];
  parts.push('Strings[' + (i + 1) + '] = "' + phrases[i % phrases.length] + ' [variant ' + i + ']"');
}

// Main init
parts.push('');
parts.push('-- Initialize all systems');
parts.push('local function init()');
parts.push('  print("[Goosefuscator Test] Initializing " .. Config.VERSION)');
parts.push('  print("[Goosefuscator Test] Loaded " .. #ItemDB .. " items")');
parts.push('  print("[Goosefuscator Test] Loaded " .. #Strings .. " strings")');
parts.push('  print("[Goosefuscator Test] All systems ready!")');
parts.push('  return true');
parts.push('end');
parts.push('');
parts.push('return init()');

const luaScript = parts.join('\n');
console.log('Generated script size: ' + (luaScript.length / 1024).toFixed(1) + ' KB');

// Send to the obfuscator API
const postData = JSON.stringify({
  code: luaScript,
  options: {
    vmLayers: 1,
    strings: true,
    numbers: true,
    junk: true,
    security: true,
    antiDecomp: true,
    constArr: true,
    compress: true,
    isLuau: true,
  },
});

const startTime = Date.now();

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/obfuscate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
  timeout: 600000,
}, function(res) {
  let body = '';
  res.on('data', function(chunk) { body += chunk; });
  res.on('end', function() {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    
    if (res.statusCode !== 200) {
      console.log('ERROR ' + res.statusCode + ': ' + body.substring(0, 500));
      process.exit(1);
    }
    
    try {
      const data = JSON.parse(body);
      console.log('');
      console.log('=== OBFUSCATION RESULTS ===');
      console.log('Input:      ' + (data.stats.inputSize / 1024).toFixed(1) + ' KB');
      console.log('Output:     ' + (data.stats.outputSize / 1024).toFixed(1) + ' KB');
      console.log('Ratio:      ' + data.stats.ratio + 'x');
      console.log('VM Layers:  ' + data.stats.vmLayers);
      console.log('Time:       ' + elapsed + 's');
      console.log('Steps:      ' + data.stats.steps.length);
      console.log('');
      console.log('Pipeline steps:');
      data.stats.steps.forEach(function(s, i) {
        console.log('  ' + (i + 1) + '. ' + s);
      });
      console.log('');
      
      // Quick structural validation
      var output = data.output;
      var hasLoadstring = output.indexOf('loadstring') !== -1 || output.indexOf('string.char') !== -1;
      var hasRC4 = output.indexOf('bxor') !== -1 || output.indexOf('bit32') !== -1;
      var notEmpty = output.length > 100;
      
      console.log('=== VALIDATION ===');
      console.log('Has loadstring/load: ' + (hasLoadstring ? '✓' : '✗'));
      console.log('Has bitwise ops:     ' + (hasRC4 ? '✓' : '✗'));
      console.log('Non-trivial output:  ' + (notEmpty ? '✓' : '✗'));
      console.log('No raw source leak:  ' + (output.indexOf('ItemDB') === -1 ? '✓' : '✗'));
      
      if (hasLoadstring && hasRC4 && notEmpty && output.indexOf('ItemDB') === -1) {
        console.log('');
        console.log('✅ 256KB OBFUSCATION: SUCCESS — NO ERRORS');
      } else {
        console.log('');
        console.log('❌ VALIDATION FAILED');
        process.exit(1);
      }
    } catch (e) {
      console.log('Parse error: ' + e.message);
      process.exit(1);
    }
  });
});

req.on('error', function(e) {
  console.log('Connection error: ' + e.message);
  console.log('Is the web server running? Start it with: node web.js');
  process.exit(1);
});

req.on('timeout', function() {
  console.log('Request timed out after 120s');
  req.destroy();
  process.exit(1);
});

req.write(postData);
req.end();
console.log('Sending ' + (Buffer.byteLength(postData) / 1024).toFixed(1) + ' KB to obfuscator...');
