'use strict';

const PRESETS = {

weak: {
prometheus: false,
zartha: false,
numbers: false,
proxyGlobals: false,
constArray: false,
strings: true,
controlFlow: false,
opaque: false,
antiDecomp: false,
junk: false,
junkBlocks: 0,
renameLocals: true,
vmLayers: 0,
vmStackAt30KB: false,
security: false,
hercules: false,
compress: false,
validate: true,
},

medium: {
prometheus: false,
zartha: false,
numbers: true,
proxyGlobals: true,
constArray: true,
strings: true,
controlFlow: false,
opaque: true,
antiDecomp: false,
junk: true,
junkBlocks: 5,
renameLocals: true,
vmLayers: 1,
vmStackAt30KB: false,
security: false,
hercules: true,
compress: true,
validate: true,
},

normal: {
prometheus: false,
zartha: false,
numbers: true,
proxyGlobals: true,
constArray: true,
strings: true,
controlFlow: true,
opaque: true,
antiDecomp: true,
junk: true,
junkBlocks: 10,
renameLocals: true,
vmLayers: 2,
vmStackAt30KB: true,
security: true,
hercules: true,
compress: true,
validate: true,
},

heavy: {
prometheus: true,
zartha: true,
numbers: true,
proxyGlobals: true,
constArray: true,
strings: true,
controlFlow: true,
opaque: true,
antiDecomp: true,
junk: true,
junkBlocks: 20,
renameLocals: true,
vmLayers: 3,
vmStackAt30KB: true,
security: true,
hercules: true,
compress: true,
validate: true,
},
};

PRESETS.default = PRESETS.heavy;

function resolve(input) {
if (!input) return { ...PRESETS.heavy };

if (typeof input === 'string') {
const name = input.toLowerCase().trim();
if (!PRESETS[name]) {
throw new Error(
`Unknown preset "${name}". Valid presets: ${Object.keys(PRESETS).join(', ')}`
);
}
return { ...PRESETS[name] };
}

if (typeof input === 'object') {

const base = input.preset
? resolve(input.preset)
: { ...PRESETS.heavy };

const { preset: _ignored, ...overrides } = input;
return { ...base, ...overrides };
}

return { ...PRESETS.heavy };
}

module.exports = { PRESETS, resolve };
