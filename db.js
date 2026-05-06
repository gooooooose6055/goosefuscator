'use strict';

const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto'); 

const DB_PATH = path.join(__dirname, 'data', 'db.json');

function load() {
  try {
    if (!fs.existsSync(DB_PATH)) return fresh();
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return fresh();
  }
}

function fresh() {
  return { users: {}, blacklist: {} };
}

function save(db) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const tmp = DB_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tmp, DB_PATH);
}

function makeObfId() {
  return 'OBF-' + crypto.randomBytes(6).toString('hex').toUpperCase();
}

const REGEN_MS     = 12 * 60 * 60 * 1000;
const TOKENS_REGEN = 5;
const TOKENS_MAX   = 20;

function getUser(db, discordId) {
  if (!db.users[discordId]) {
    db.users[discordId] = {
      obfId:     makeObfId(),
      verified:  false,
      tokens:    TOKENS_REGEN,
      lastRegen: Date.now(),
      totalUses: 0,
    };
  }
  return db.users[discordId];
}

function regenTokens(user) {
  const now     = Date.now();
  const elapsed = now - (user.lastRegen || 0);
  const periods = Math.floor(elapsed / REGEN_MS);
  if (periods > 0) {
    user.tokens    = Math.min(TOKENS_MAX, (user.tokens || 0) + periods * TOKENS_REGEN);
    user.lastRegen = (user.lastRegen || now) + periods * REGEN_MS;
  }
}

function nextRegenMs(user) {
  const elapsed = Date.now() - (user.lastRegen || 0);
  return Math.max(0, REGEN_MS - (elapsed % REGEN_MS));
}

module.exports = { load, save, getUser, regenTokens, nextRegenMs, makeObfId, TOKENS_REGEN, TOKENS_MAX };
