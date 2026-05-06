'use strict';

async function logObfuscation({ webhookUrl, brand, userId, username, filename, inputKB, outputKB, isLuau, ok, error }) {
  if (!webhookUrl) return;
  try {
    const color  = ok ? 0x57F287 : 0xED4245;
    const status = ok ? 'Success' : 'Failed';
    const embed  = {
      title:     `${brand} — ${status}`,
      color,
      fields: [
        { name: 'User',   value: `<@${userId}> (${username})`, inline: true },
        { name: 'File',   value: `\`${filename}\``,            inline: true },
        { name: 'Mode',   value: isLuau ? 'Luau' : 'Lua 5.1', inline: true },
        { name: 'Input',  value: `${inputKB} KB`,              inline: true },
        { name: 'Output', value: ok ? `${outputKB} KB` : 'n/a', inline: true },
      ],
      timestamp: new Date().toISOString(),
    };
    if (!ok && error) {
      embed.fields.push({ name: 'Error', value: '```\n' + String(error).slice(0, 300) + '\n```' });
    }
    await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ embeds: [embed] }),
    });
  } catch (_) {}
}

module.exports = { logObfuscation };
