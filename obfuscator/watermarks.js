'use strict';

const { randInt } = require('./utils');
const crypto = require('crypto');

// ─────────────────────────────────────────────────────────────────
// Session fingerprint
// ─────────────────────────────────────────────────────────────────
function sessionId() {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
}

function timestamp() {
  const d = new Date();
  return d.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
}

function getUiUrl() {
  return 'https://goosefuscator.dev';
}

// ─────────────────────────────────────────────────────────────────
// ASCII art logo (FIGlet-style, safe ASCII only, pre-measured)
// ─────────────────────────────────────────────────────────────────

const GOOSE_LOGO = [
  '       __       ',
  '   ___( o)>     ',
  '   \\ <_. )      ',
  '    `---\'       ',
  '                ',
  '   __________  ____  _____ ______________  _______ _________  __________  ____ ',
  '  / ____/ __ \\/ __ \\/ ___// ____/ ____/ / / / ___// ____/   |/_  __/ __ \\/ __ \\',
  ' / / __/ / / / / / /\\__ \\/ __/ / /_  / / / /\\__ \\/ /   / /| | / / / / / / /_/ /',
  '/ /_/ / /_/ / /_/ /___/ / /___/ __/ / /_/ /___/ / /___/ ___ |/ / / /_/ / _, _/ ',
  '\\____/\\____/\\____//____/_____/_/    \\____//____/\\____/_/  |_/_/  \\____/_/ |_|  '
];

const GOOSE_LOGO_WIDTH = 79; // measured width of the widest line

// ─────────────────────────────────────────────────────────────────
// Decorative frame helpers (pure ASCII, no Unicode)
// ─────────────────────────────────────────────────────────────────

const W = 84; // box inner width (fits logo perfectly)

function pad(text, width) {
  const len = text.length;
  if (len >= width) return text.slice(0, width);
  return text + ' '.repeat(width - len);
}

function center(text, width) {
  const left = Math.max(0, Math.floor((width - text.length) / 2));
  return ' '.repeat(left) + text;
}

function boxLine(content) {
  return '||  ' + pad(content, W) + '  ||';
}

function emptyBoxLine() {
  return boxLine('');
}

// ─────────────────────────────────────────────────────────────────
// Goose watermark
// ─────────────────────────────────────────────────────────────────

function makeGooseWatermark() {
  const sid = sessionId();
  const ts = timestamp();

  const borderTop = ' .' + '='.repeat(W + 4) + '. ';
  const borderBottom = ' \'' + '='.repeat(W + 4) + '\' ';
  const borderInner = ' ' + '-'.repeat(W + 2) + ' ';

  const lines = [];

  lines.push(borderTop);
  lines.push(emptyBoxLine());

  // Logo
  GOOSE_LOGO.forEach(row => {
    lines.push('||  ' + pad(center(row, W), W) + '  ||');
  });

  lines.push(emptyBoxLine());
  lines.push('||  ' + center(borderInner, W) + '  ||');
  lines.push(emptyBoxLine());

  // Branding
  lines.push(boxLine(center('<[ PROTECTED BY GOOSEFUSCATOR ]>', W)));
  lines.push(boxLine(center('/// Best Obfuscator \\\\\\', W)));
  lines.push(emptyBoxLine());

  // Session info
  lines.push('||  ' + center(borderInner, W) + '  ||');
  lines.push(emptyBoxLine());
  lines.push(boxLine('    [+] Session Fingerprint : ' + sid));
  lines.push(boxLine('    [+] Deployment Time     : ' + ts));
  lines.push(emptyBoxLine());
  lines.push('||  ' + center(borderInner, W) + '  ||');
  lines.push(emptyBoxLine());

  // Warning

  lines.push(borderBottom);

  return '--[==[' + '\n' + lines.join('\n') + '\n' + ']==]';
}

function makeGooseFooter() {
  const sid = sessionId();
  const FW = 56;
  const border = '='.repeat(FW + 8);
  const inner = '-'.repeat(FW + 4);

  const fPad = (c) => '||  ' + pad(c, FW) + '  ||';
  const fCenter = (t) => fPad(center(t, FW));

  const lines = [
    border,
    fPad(''),
    fCenter('Goosefuscator'),
    fCenter('--- Best Lua Obfuscator ---'),
    fPad(''),
    '||  ' + inner + '  ||',
    fPad('  Build   : ' + sid),
    fPad(''),
    fCenter('Protected  *  Unique  *  Secure'),
    fPad(''),
    border,
  ];

  return '--[==[' + '\n' + lines.join('\n') + '\n' + ']==]';
}

// ─────────────────────────────────────────────────────────────────
// Stellar brand (backward compat)
// ─────────────────────────────────────────────────────────────────

const STELLAR_LOGO = [
  '   _____ __       ____                ____                        __              ',
  '  / ___// /____  / / /___  _____     / __/_  _______________  ___/ /____  _____   ',
  '  \\__ \\/ __/ _ \\/ / / __ `/ ___/    / /_/ / / / ___/ ___/ _ \\/ __  / __ \\/ ___/   ',
  ' ___/ / /_/  __/ / / /_/ / /       / __/ /_/ (__  ) /__/ __/ /_/ / /_/ / /       ',
  '/____/\\__/\\___/_/_/\\__,_/_/       /_/    \\__,_/____/\\___/\\___/\\__,_/\\____/_/        ',
];

function makeStellarWatermark() {
  const sid = sessionId();
  const borderOuter = '='.repeat(W + 8);
  const borderInner = '-'.repeat(W + 4);

  const lines = [borderOuter, emptyBoxLine()];
  STELLAR_LOGO.forEach(row => lines.push('||  ' + pad(center(row, W), W) + '  ||'));
  lines.push(emptyBoxLine());
  lines.push('||  ' + borderInner + '  ||');
  lines.push(emptyBoxLine());
  lines.push(boxLine(center('Stellarfuscator  *  Luau Native  *  Unique Every Run', W)));
  lines.push(boxLine(center('Session: ' + sid, W)));
  lines.push(emptyBoxLine());
  lines.push(borderOuter);

  return '--[==[' + '\n' + lines.join('\n') + '\n' + ']==]';
}

function makeStellarFooter() {
  const FW = 56;
  const border = '='.repeat(FW + 8);
  const fPad = (c) => '||  ' + pad(c, FW) + '  ||';
  const fCenter = (t) => fPad(center(t, FW));

  const lines = [
    border,
    fPad(''),
    fCenter('Stellarfuscator'),
    fCenter('github.com/stellarfuscator'),
    fPad(''),
    border,
  ];
  return '--[==[' + '\n' + lines.join('\n') + '\n' + ']==]';
}

// ─────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────

function makeWatermarks(brand) {
  if (brand === 'Stellarfuscator') {
    return { header: makeStellarWatermark(), footer: makeStellarFooter() };
  }
  return { header: makeGooseWatermark(), footer: makeGooseFooter() };
}

module.exports = { makeWatermarks };
