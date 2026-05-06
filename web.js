'use strict';

const express = require('express');
const path = require('path');
const { obfuscate } = require('./obfuscator');

const app = express();
const PORT = process.env.WEB_PORT || 3000;

// Parse large bodies (obfuscated output can be big)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API: Obfuscate code
app.post('/api/obfuscate', async (req, res) => {
  try {
    const { code, options } = req.body;

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({ error: 'No code provided' });
    }

    if (code.length > 500 * 1024) {
      return res.status(400).json({ error: 'Code too large (max 500KB)' });
    }

    const opts = {
      vmLayers: (options && options.vmLayers != null) ? options.vmLayers : 3,
      strings: (options && options.strings != null) ? options.strings : true,
      numbers: (options && options.numbers != null) ? options.numbers : true,
      junk: (options && options.junk != null) ? options.junk : true,
      security: (options && options.security != null) ? options.security : true,
      antiDecomp: (options && options.antiDecomp != null) ? options.antiDecomp : true,
      constArr: (options && options.constArr != null) ? options.constArr : true,
      validate: false,
      isLuau: (options && options.isLuau != null) ? options.isLuau : true,
      prometheus: false,
      zartha: false,
      compress: (options && options.compress != null) ? options.compress : true,
    };

  const startTime = Date.now();
  const result = await obfuscate(code, opts);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  res.json({
    output: result.output,
    stats: {
      inputSize: code.length,
      outputSize: result.output.length,
      ratio: (result.output.length / code.length).toFixed(1),
      vmLayers: result.vmLayersUsed,
      time: elapsed,
      steps: result.log,
    },
  });
} catch (err) {
  console.error('Obfuscation error:', err);
  res.status(500).json({ error: 'Obfuscation failed: ' + err.message });
}
});

const server = app.listen(PORT, () => {
  console.log(`\n  🦆 Goosefuscator Web UI`);
  console.log(`  ━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  Running at: http://localhost:${PORT}`);
  console.log(`  Press Ctrl+C to stop\n`);
});
server.timeout = 600000; // 10 minutes for large scripts
