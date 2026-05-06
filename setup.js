#!/usr/bin/env node
'use strict';

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const { createWriteStream } = require('fs');

const BIN = path.join(__dirname, 'bin');
const LUNE_VERSION = 'v0.8.9';

const platform = process.platform; 
const arch = process.arch; 

const isLinux = platform === 'linux';
const isMac = platform === 'darwin';
const isWin = platform === 'win32';

function luneTarget() {
if (isLinux && arch === 'arm64') return 'linux-aarch64';
if (isLinux) return 'linux-x86_64';
if (isMac && arch === 'arm64') return 'macos-aarch64';
if (isMac) return 'macos-x86_64';
if (isWin) return 'windows-x86_64';
throw new Error(`Unsupported platform: ${platform}/${arch}`);
}

const luaBin = path.join(BIN, isWin ? 'lua5.1.exe' : 'lua5.1');
const luneBin = path.join(BIN, isWin ? 'lune.exe' : 'lune');

function mkbin() {
if (!fs.existsSync(BIN)) fs.mkdirSync(BIN, { recursive: true });
}

function run(cmd, opts = {}) {
console.log(' $', cmd);
return spawnSync(cmd, { shell: true, stdio: 'inherit', ...opts });
}

function exists(p) { return fs.existsSync(p); }

function download(url, dest) {
return new Promise((resolve, reject) => {
console.log(` ↓ ${url}`);
const follow = (u) => {
https.get(u, res => {
if (res.statusCode === 301 || res.statusCode === 302) {
return follow(res.headers.location);
}
if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
const out = createWriteStream(dest);
res.pipe(out);
out.on('finish', () => out.close(resolve));
out.on('error', reject);
}).on('error', reject);
};
follow(url);
});
}

async function unzip(zipPath, targetDir) {

if (isWin) {
run(`powershell -Command "Expand-Archive -Force '${zipPath}' '${targetDir}'"`, { stdio: 'pipe' });
} else {
run(`unzip -o -q "${zipPath}" -d "${targetDir}"`, { stdio: 'pipe' });
}
}

async function installLua() {
if (exists(luaBin)) { console.log(' lua5.1 already in bin/'); return; }

console.log('\n Installing lua 5.1...');
mkbin();

if (isLinux) {
const r = run('apt-get install -y lua5.1 2>/dev/null || apt install -y lua5.1');

const found = ['/usr/bin/lua5.1', '/usr/local/bin/lua5.1'].find(exists);
if (found) {
fs.copyFileSync(found, luaBin);
fs.chmodSync(luaBin, 0o755);
console.log(' lua5.1 → bin/lua5.1');
} else {

run('apt-get install -y luajit 2>/dev/null || true');
const jit = ['/usr/bin/luajit', '/usr/local/bin/luajit'].find(exists);
if (jit) {
fs.copyFileSync(jit, luaBin);
fs.chmodSync(luaBin, 0o755);
console.log(' luajit → bin/lua5.1 (fallback)');
} else {
console.warn(' Could not install lua5.1 via apt. Install manually: apt install lua5.1');
}
}

} else if (isMac) {
run('brew install lua@5.1 2>/dev/null || brew install lua 2>/dev/null || true');
const found = [
'/usr/local/bin/lua5.1', '/opt/homebrew/bin/lua5.1',
'/usr/local/bin/lua', '/opt/homebrew/bin/lua',
].find(exists);
if (found) {
fs.copyFileSync(found, luaBin);
fs.chmodSync(luaBin, 0o755);
console.log(' lua5.1 → bin/lua5.1');
} else {
console.warn(' Could not find lua after brew install. Install manually: brew install lua@5.1');
}

} else if (isWin) {

const luaZip = path.join(os.tmpdir(), 'lua51.zip');
const luaUrl = 'https://sourceforge.net/projects/luabinaries/files/5.1.5/Tools%20Executables/lua-5.1.5_Win64_bin.zip/download';
try {
await download(luaUrl, luaZip);
const luaTmp = path.join(os.tmpdir(), 'lua51_extract');
await unzip(luaZip, luaTmp);

const exeFile = fs.readdirSync(luaTmp).find(f => f.toLowerCase().includes('lua') && f.endsWith('.exe'));
if (exeFile) {
fs.copyFileSync(path.join(luaTmp, exeFile), luaBin);
console.log(' lua5.1.exe → bin/lua5.1.exe');
}
} catch (e) {
console.warn(' Could not download lua5.1 for Windows:', e.message);
console.warn(' Download manually from: https://luabinaries.sourceforge.net');
console.warn(' Place lua5.1.exe in the bin/ folder.');
}
}
}

async function installLune() {
if (exists(luneBin)) { console.log(' lune already in bin/'); return; }

console.log('\n Installing lune', LUNE_VERSION, '...');
mkbin();

const target = luneTarget();
const zipName = isWin
? `lune-${LUNE_VERSION}-${target}.zip`
: `lune-${LUNE_VERSION}-${target}.zip`;
const url = `https://github.com/lune-org/lune/releases/download/${LUNE_VERSION}/${zipName}`;
const zipPath = path.join(os.tmpdir(), zipName);

try {
await download(url, zipPath);
} catch (e) {
console.error(' Failed to download lune:', e.message);
console.error(' Manual install: https://github.com/lune-org/lune/releases/tag/' + LUNE_VERSION);
console.error(' Place the lune binary in bin/');
return;
}

const extractDir = path.join(os.tmpdir(), 'lune_extract_' + Date.now());
fs.mkdirSync(extractDir, { recursive: true });
await unzip(zipPath, extractDir);

function findBin(dir, name) {
for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
const full = path.join(dir, entry.name);
if (entry.isDirectory()) {
const found = findBin(full, name);
if (found) return found;
} else if (entry.name === name) {
return full;
}
}
return null;
}

const binName = isWin ? 'lune.exe' : 'lune';
const found = findBin(extractDir, binName);

if (found) {
fs.copyFileSync(found, luneBin);
if (!isWin) fs.chmodSync(luneBin, 0o755);
console.log(' lune → bin/' + binName);
} else {

const top = fs.readdirSync(extractDir);
const luneFile = top.find(f => f === binName || f === 'lune' || f === 'lune.exe');
if (luneFile) {
fs.copyFileSync(path.join(extractDir, luneFile), luneBin);
if (!isWin) fs.chmodSync(luneBin, 0o755);
console.log(' lune → bin/' + binName);
} else {
console.error(' Could not find lune binary in zip. Contents:', top);
}
}

try { fs.unlinkSync(zipPath); } catch (_) {}
}

function verify() {
console.log('\n Verifying...');
const luaOk = exists(luaBin);
const luneOk = exists(luneBin);

if (luaOk) {
const r = spawnSync(luaBin, ['-e', 'print(_VERSION)'], { encoding: 'utf-8' });
console.log(` lua: ${r.stdout?.trim() || 'ok'}`);
} else {
console.log(' lua: not found in bin/');
}

if (luneOk) {
const r = spawnSync(luneBin, ['--version'], { encoding: 'utf-8' });
console.log(` lune: ${(r.stdout || r.stderr)?.trim() || 'ok'}`);
} else {
console.log(' lune: not found in bin/');
}

if (luaOk && luneOk) {
console.log('\n All binaries ready. Run: npm start\n');
} else {
console.log('\n Some binaries missing — affected pipeline stages will be skipped.\n');
}
}

(async () => {
console.log(' Lua Scam Scanner — Setup');
console.log(` Platform: ${platform}/${arch}\n`);
try {
await installLua();
await installLune();
verify();
} catch (e) {
console.error(' Setup error:', e.message);
process.exit(1);
}
})();
