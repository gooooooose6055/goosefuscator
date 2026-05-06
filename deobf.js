const fs = require('fs');

const scriptPath = 'C:/Users/semmy/Downloads/Goosefuscator-pella/app/obfuscator/script.lua';
const code = fs.readFileSync(scriptPath, 'utf8');

const chunks = {};
const chunkRegex = /local ([a-zA-Z0-9_]+)="([^"]+)"/g;
let match;
while ((match = chunkRegex.exec(code)) !== null) {
  if (match[2].length > 100) chunks[match[1]] = match[2];
}

const permMatch = code.match(/local ([a-zA-Z0-9_]+)=\{([0-9,]+)\}\r?\nlocal ([a-zA-Z0-9_]+)=\{([a-zA-Z0-9_,]+)\}/);
const permVars = permMatch[2].split(',').map(Number);
const chunkVars = permMatch[4].split(',');

const orderedChunks = [];
for (let i = 0; i < permVars.length; i++) {
  orderedChunks.push(chunks[chunkVars[permVars[i] - 1]]);
}
const encodedStr = orderedChunks.join('');

const b85_alpha = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+,-./:;<=>?@[]^_`{|}~';
const b85Map = {};
for (let i = 0; i < b85_alpha.length; i++) b85Map[b85_alpha[i]] = i;

function decodeBase85(str) {
  const out = [];
  for (let i = 0; i < str.length; i += 5) {
    const chunk = Math.min(5, str.length - i);
    let val = 0;
    for (let j = 0; j < chunk; j++) {
      val = val * 85 + b85Map[str[i + j]];
    }
    // padd missing characters to max
    for (let j = chunk; j < 5; j++) {
      val = val * 85 + 84;
    }
    const bytes = [];
    for (let j = 3; j >= 0; j--) {
      bytes.push(Math.floor(val / Math.pow(256, j)) % 256);
    }
    out.push(...bytes.slice(0, chunk - 1));
  }
  return Buffer.from(out);
}

const buf = decodeBase85(encodedStr);
console.log(`Base85 Decoded length: ${buf.length}`);

const keyMatch = code.match(/local ([a-zA-Z0-9_]+)=\{([0-9,]+)\}\r?\nlocal _rmx/);
const mixedKey = keyMatch[2].split(',').map(Number);
const math_pi = Math.floor(Math.PI * 100) % 256;
const math_sqrt2 = Math.floor(Math.SQRT2 * 1000) % 256;
const rmx = [ "L".charCodeAt(0), math_pi, math_sqrt2 ]; 
const key = mixedKey.map((b, i) => b ^ rmx[i % 3]);

function rc4Encrypt(buf, key) {
  const S = Array.from({ length: 256 }, (_, i) => i);
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key[i % key.length]) & 0xFF;
    [S[i], S[j]] = [S[j], S[i]];
  }
  const out = Buffer.alloc(buf.length);
  let x = 0, y = 0;
  // Use bitwise xor fallback identical to Lua (it's standard RC4)
  for (let k = 0; k < buf.length; k++) {
    x = (x + 1) & 0xFF;
    y = (y + S[x]) & 0xFF;
    [S[x], S[y]] = [S[y], S[x]];
    out[k] = buf[k] ^ S[(S[x] + S[y]) & 0xFF];
  }
  return out;
}

const deflated = rc4Encrypt(buf, key);
console.log(`RC4 Decrypted. ${deflated.length}`);

const zlib = require('zlib');
try {
  const res = zlib.inflateRawSync(deflated);
  console.log("Deflate SUCCESS! Size:", res.length);
  fs.writeFileSync('C:/Users/semmy/Downloads/goosefuscator_fixed (3)/goosefuscator/app/stage1.lua', res);
} catch (e) {
  console.log("Deflate failed:", e.message);
  // try byte-by-byte recovery just in case
  const pako = require('pako');
  const infl2 = new pako.Inflate({ raw: true });
  try { for(let x=0; x<deflated.length; x++) infl2.push(deflated.slice(x,x+1), false); } catch(e2){}
  if (infl2.result) {
    console.log("Recovered partial data size:", infl2.result.length);
    fs.writeFileSync('C:/Users/semmy/Downloads/goosefuscator_fixed (3)/goosefuscator/app/stage1.lua', infl2.result);
  }
}
