const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('C:/Users/semmy/Downloads/goosefuscator_fixed (3)/goosefuscator/app/stage1.bin');

let decompressed = Buffer.alloc(0);
const inflator = zlib.createInflateRaw({ flush: zlib.constants.Z_SYNC_FLUSH });

inflator.on('data', chunk => {
  decompressed = Buffer.concat([decompressed, chunk]);
});

inflator.on('end', () => {
  console.log("Finished. Size:", decompressed.length);
  fs.writeFileSync('C:/Users/semmy/Downloads/goosefuscator_fixed (3)/goosefuscator/app/stage1.lua', decompressed);
});

inflator.on('error', err => {
  console.log("Error:", err.message);
  console.log("Recovered Size:", decompressed.length);
  fs.writeFileSync('C:/Users/semmy/Downloads/goosefuscator_fixed (3)/goosefuscator/app/stage1.lua', decompressed);
});

// Write in small 1-byte chunks to force flush!
for(let i=0; i<buf.length; i++) {
  inflator.write(buf.slice(i, i+1));
}
inflator.end();
