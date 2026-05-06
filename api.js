'use strict';

const express = require('express');
const crypto = require('crypto');
const obfuscate = require('./obfuscate-simple');
const { PRESETS, resolve: resolvePreset } = require('./presets');

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.text({ limit: '20mb' }));

function generateFilename() {
return 'obf_' + crypto.randomBytes(8).toString('hex') + '.lua';
}

function formatResult(result) {
return {
status: 'successful obf',
filename: generateFilename(),
preset: result.preset || 'heavy',
originalSize: result.originalSize + ' bytes',
obfuscatedSize: result.obfuscatedSize + ' bytes',
increase: result.expansionRatio,
output: result.output,
};
}

app.post('/obfuscate', async (req, res) => {
try {
let code, options;

if (typeof req.body === 'string') {
code = req.body;
options = 'heavy';
} else if (typeof req.body === 'object' && req.body !== null) {
code = req.body.code;
const { code: _c, ...rest } = req.body;
options = Object.keys(rest).length > 0 ? rest : 'heavy';
}

if (!code || typeof code !== 'string') {
return res.status(400).json({
status: 'error',
message: 'No code provided. Send plain text or JSON { code, preset? }',
});
}

const result = await obfuscate(code, options);
return res.status(200).json(formatResult(result));

} catch (error) {
return res.status(400).json({ status: 'error', message: error.message });
}
});

app.post('/preset', async (req, res) => {
try {
let code, preset;

if (typeof req.body === 'string') {
code = req.body;
preset = req.query.preset || 'heavy';
} else if (typeof req.body === 'object' && req.body !== null) {
code = req.body.code;
preset = req.body.preset || req.query.preset || 'heavy';
}

if (!code || typeof code !== 'string') {
return res.status(400).json({ status: 'error', message: 'No code provided' });
}

const name = String(preset).toLowerCase().trim();
const validPresets = Object.keys(PRESETS).filter(p => p !== 'default');
if (!PRESETS[name]) {
return res.status(400).json({
status: 'error',
message: 'Unknown preset "' + preset + '"',
valid: validPresets,
});
}

const result = await obfuscate(code, name);
return res.status(200).json(formatResult(result));

} catch (error) {
return res.status(400).json({ status: 'error', message: error.message });
}
});

app.get('/preset', (req, res) => {
const out = {};
for (const [name, cfg] of Object.entries(PRESETS)) {
if (name === 'default') continue;
out[name] = cfg;
}
res.json({
presets: out,
usage: {
named: 'POST /preset { "code": "...", "preset": "weak|medium|normal|heavy" }',
custom: 'POST /obfuscate { "code": "...", "preset":"medium", "vmLayers":3 }',
queryStr: 'POST /preset?preset=medium (plain text body)',
},
allOptions: {
prometheus: 'bool — Prometheus AST obfuscator (needs lua)',
zartha: 'bool — Zartha bytecode VM (needs lua)',
numbers: 'bool — XOR MBA number encoding',
proxyGlobals: 'bool — Alias globals through locals',
constArray: 'bool — Pool string constants into array',
strings: 'bool — Multi-fragment rolling-XOR string encryption',
controlFlow: 'bool — Control-flow flattening',
opaque: 'bool — Opaque predicate wrapping',
antiDecomp: 'bool — Anti-decompile poison blocks',
junk: 'bool — Dead code injection',
junkBlocks: 'int — Junk blocks count (1-20)',
renameLocals: 'bool — Rename local variables',
vmLayers: 'int — VM wrapper layers (0-3)',
vmStackAt30KB: 'bool — Stack heavy VM only on src >= 30 KB',
security: 'bool — Security + anti-tamper header',
hercules: 'bool — Hercules global-alias outer wrapper',
compress: 'bool — ZLIB compression',
validate: 'bool — Validate output Lua syntax',
},
});
});

app.post('/obfuscate/batch', async (req, res) => {
try {
if (!Array.isArray(req.body)) {
return res.status(400).json({
status: 'error',
message: 'Expected array of strings or [{ code, preset }] objects',
});
}

const results = [];
for (const item of req.body) {
try {
const code = typeof item === 'string' ? item : item.code;
const opts = (typeof item === 'object' && item.preset) ? item.preset : 'heavy';
const result = await obfuscate(code, opts);
results.push(formatResult(result));
} catch (e) {
results.push({ status: 'error', message: e.message });
}
}

return res.json({
status: 'batch complete',
total: results.length,
successful: results.filter(r => r.status === 'successful obf').length,
failed: results.filter(r => r.status === 'error').length,
results,
});
} catch (error) {
return res.status(400).json({ status: 'error', message: error.message });
}
});

app.post('/obfuscate/size', (req, res) => {
try {
const code = typeof req.body === 'string' ? req.body
: (req.body && req.body.code) ? req.body.code : null;
if (!code) return res.status(400).json({ status: 'error', message: 'No code provided' });

const preset = (typeof req.body === 'object' && req.body.preset) || 'heavy';
const mults = { weak: 1.5, medium: 3, normal: 4.5, heavy: 5.5, default: 5.5 };
const mult = mults[preset] || 5.5;
const sizeKB = code.length / 1024;
const est = code.length * mult;

return res.json({
status: 'ok',
preset,
originalSize: code.length + ' bytes',
originalSizeKB: sizeKB.toFixed(2) + ' KB',
estimatedSize: Math.round(est) + ' bytes',
estimatedSizeKB: (est / 1024).toFixed(2) + ' KB',
estimatedIncrease: mult + 'x (approximate)',
vmLayers: sizeKB > 100 ? 1 : sizeKB > 50 ? 2 : 3,
});
} catch (error) {
return res.status(400).json({ status: 'error', message: error.message });
}
});

app.get('/', (req, res) => {
res.json({
name: 'Goosefuscator API',
version: '4.0',
status: 'operational',
endpoints: {
'POST /obfuscate': 'Obfuscate (plain text = heavy, or JSON { code, preset?, ...opts })',
'POST /preset': 'Obfuscate with named preset { code, preset }',
'GET /preset': 'List all presets and every config option',
'POST /obfuscate/batch': 'Batch obfuscation',
'POST /obfuscate/size': 'Estimate output size',
},
presets: {
weak: 'String encrypt + rename only. Tiny output.',
medium: '1 VM layer, full transforms, no external tools.',
normal: '2 VM layers, security header, all transforms.',
heavy: 'Prometheus + Zartha + 3 VM layers + everything (default).',
},
examples: {
named: 'POST /preset { "code": "print(1)", "preset": "medium" }',
custom: 'POST /obfuscate { "code": "print(1)", "vmLayers": 2, "strings": true }',
override: 'POST /obfuscate { "code": "print(1)", "preset": "medium", "vmLayers": 3 }',
default: 'POST /obfuscate plain text body → heavy preset',
},
limits: { maxFileSize: '5 MB', timeout: '45s per stage' },
});
});

app.use((err, req, res, _next) => {
res.status(500).json({ status: 'error', message: 'Internal server error', detail: err.message });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
console.log('Goosefuscator API v4.0');
console.log('Server: http://' + HOST + ':' + PORT);
console.log(' POST /obfuscate - Obfuscate (preset or custom config)');
console.log(' POST /preset - Obfuscate with named preset');
console.log(' GET /preset - List presets + all config options');
console.log(' POST /obfuscate/batch - Batch');
console.log(' POST /obfuscate/size - Size estimate');
});

module.exports = app;
