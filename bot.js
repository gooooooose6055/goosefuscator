'use strict';

require('dotenv').config();

const TOKEN    = process.env.DISCORD_TOKEN;
const OWNER_ID = process.env.OWNER_ID || '';

console.log('Goosefuscator v3 - starting up');
console.log('  DISCORD_TOKEN : ' + (TOKEN    ? 'set' : 'MISSING - set it in .env'));
console.log('  OWNER_ID      : ' + (OWNER_ID ? 'set' : 'not set (optional)'));

if (!TOKEN) {
  console.error('[FATAL] DISCORD_TOKEN is not set. Create a .env file based on .env.example.');
  process.exit(1);
}

const {
  Client, GatewayIntentBits,
  EmbedBuilder, AttachmentBuilder, Colors,
  ActionRowBuilder, StringSelectMenuBuilder,
} = require('discord.js');

const { obfuscate } = require('./obfuscator');
const db_           = require('./db');

const OBF_WEBHOOK = process.env.OBF_WEBHOOK || '';
const VFY_WEBHOOK = process.env.VFY_WEBHOOK || '';
const BRAND       = 'Goosefuscator';
const MAX_FILE_MB = 25;

const VALID_EXTS = ['.lua', '.lua51', '.lua53', '.luau', '.txt'];

function looksLikeLuau(src) {
  return /:\s*(number|string|boolean|any|nil|table|void|never|thread)\b/.test(src)
    || /\bcontinue\b/.test(src);
}

function isOwner(id) { return OWNER_ID && id === OWNER_ID; }

function fmtMs(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

async function fetchSource(message) {
  const att = message.attachments.first();
  if (att) {
    if (att.size > MAX_FILE_MB * 1024 * 1024)
      throw new Error(`File too large - max ${MAX_FILE_MB}MB`);
    const ext = (att.name.match(/\.[^.]+$/) || [''])[0].toLowerCase();
    if (!VALID_EXTS.includes(ext))
      throw new Error(`Unsupported type \`${ext || '(none)'}\` - use .lua / .luau / .txt`);
    const res = await fetch(att.url);
    if (!res.ok) throw new Error('Could not download file');
    return { code: await res.text(), name: att.name.replace(/\.[^.]+$/, ''), filename: att.name, ext };
  }
  if (message.reference) {
    try {
      const ref  = await message.channel.messages.fetch(message.reference.messageId);
      const ratt = ref.attachments.find(a =>
        VALID_EXTS.includes((a.name.match(/\.[^.]+$/) || [''])[0].toLowerCase()));
      if (ratt) {
        const res = await fetch(ratt.url);
        if (!res.ok) throw new Error('Could not download reply file');
        return { code: await res.text(), name: ratt.name.replace(/\.[^.]+$/, ''), filename: ratt.name, ext: '' };
      }
    } catch {}
  }
  const body  = message.content.replace(/^\S+\s*/, '').trim();
  const inner = body.replace(/^```(?:lua[u5a-z0-9]*)?\n?/, '').replace(/```$/, '').trim();
  return inner ? { code: inner, name: 'snippet', filename: 'snippet.lua', ext: '' } : null;
}

async function sendWebhook(url, embeds, files) {
  if (!url) return;
  try {
    const payload = { embeds };
    if (files && files.length) {
      const form = new FormData();
      payload.attachments = files.map((f, i) => ({ id: i, filename: f.name }));
      form.append('payload_json', JSON.stringify(payload));
      for (let i = 0; i < files.length; i++)
        form.append(`files[${i}]`, new Blob([files[i].data]), files[i].name);
      await fetch(url, { method: 'POST', body: form });
    } else {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
  } catch (e) {
    console.warn('[webhook] failed:', e.message);
  }
}

async function logObf({ user, obfId, filename, code, inputKB, outputKB, isLuau, ok, error }) {
  if (!OBF_WEBHOOK) return;
  const embed = new EmbedBuilder()
    .setColor(ok ? Colors.Green : Colors.Red)
    .setTitle(ok ? 'Obfuscation' : 'Obfuscation Failed')
    .addFields(
      { name: 'User',   value: `${user.tag} (${user.id})`,  inline: true },
      { name: 'ObfID',  value: `\`${obfId}\``,              inline: true },
      { name: 'File',   value: filename,                     inline: true },
      { name: 'Mode',   value: isLuau ? 'Luau' : 'Lua 5.1', inline: true },
      { name: 'Input',  value: `${inputKB} KB`,             inline: true },
      ...(outputKB != null ? [{ name: 'Output', value: `${outputKB} KB`, inline: true }] : []),
      ...(error ? [{ name: 'Error', value: error.slice(0, 1000) }] : []),
    )
    .setTimestamp();
  const files = (ok && code) ? [{ name: filename, data: Buffer.from(code, 'utf-8') }] : [];
  await sendWebhook(OBF_WEBHOOK, [embed.toJSON()], files);
}

async function logVerify({ user, obfId, action }) {
  if (!VFY_WEBHOOK) return;
  const embed = new EmbedBuilder()
    .setColor(action === 'verified' ? Colors.Green : Colors.Red)
    .setTitle(`User ${action}`)
    .addFields(
      { name: 'User',  value: `${user.tag} (${user.id})`, inline: true },
      { name: 'ObfID', value: `\`${obfId}\``,             inline: true },
    )
    .setTimestamp();
  await sendWebhook(VFY_WEBHOOK, [embed.toJSON()]);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`[${BRAND}] Logged in as ${client.user.tag}`);
  client.user.setActivity('.help', { type: 3 });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('.')) return;

  const db   = db_.load();
  const user = db_.getUser(db, message.author.id);
  db_.regenTokens(user);

  const parts = message.content.slice(1).trim().split(/\s+/);
  const cmd   = parts[0].toLowerCase();
  const args  = parts.slice(1);

  if (cmd === 'help') {
    const modeLabel = { lua: 'Lua', luau: 'Luau', both: 'Both (Lua + Luau)' };
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`${BRAND} - Help`)
      .setDescription([
        '`.obfuscate` / `.obf` / `.o` — obfuscate an attached .lua file or pasted code',
        '`.set` — change your obfuscation mode (Lua, Luau, or Both)',
        '`.verify` — get your ObfID and verify access',
        '`.tokens` — check your token balance',
        '',
        `Your current mode: **${modeLabel[user.mode || 'both'] || 'Both (Lua + Luau)'}**`,
        '',
        isOwner(message.author.id)
          ? '**Owner:** `.give @user N` `.take @user N` `.revoke ObfID` `.unrevoke ObfID` `.blacklist` `.userinfo @user`'
          : '',
      ].join('\n').trim());
    return message.reply({ embeds: [embed] });
  }

  if (cmd === 'verify') {
    if (user.verified)
      return message.reply(`You are already verified. Your ObfID: \`${user.obfId}\``);
    user.verified = true;
    db_.save(db);
    await logVerify({ user: message.author, obfId: user.obfId, action: 'verified' });
    return message.reply(`Verified! Your ObfID: \`${user.obfId}\`\nYou have **${user.tokens}** tokens.`);
  }

  if (cmd === 'tokens') {
    const next = db_.nextRegenMs(user);
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Token Balance')
      .addFields(
        { name: 'Tokens',     value: String(user.tokens ?? 0),    inline: true },
        { name: 'Next +5 in', value: fmtMs(next),                 inline: true },
        { name: 'Total uses', value: String(user.totalUses ?? 0),  inline: true },
        { name: 'Your ObfID', value: `\`${user.obfId}\``,         inline: false },
      );
    return message.reply({ embeds: [embed] });
  }

  if (cmd === 'give' || cmd === 'take') {
    if (!isOwner(message.author.id)) return message.reply('No permission.');
    const target = message.mentions.users.first();
    const amount = parseInt(args[1], 10);
    if (!target || isNaN(amount) || amount < 1)
      return message.reply(`Usage: \`.${cmd} @user <amount>\``);
    const tUser = db_.getUser(db, target.id);
    db_.regenTokens(tUser);
    tUser.tokens = cmd === 'give'
      ? Math.min(db_.TOKENS_MAX, (tUser.tokens || 0) + amount)
      : Math.max(0, (tUser.tokens || 0) - amount);
    db_.save(db);
    return message.reply(`${cmd === 'give' ? 'Gave' : 'Removed'} **${amount}** token(s) ${cmd === 'give' ? 'to' : 'from'} ${target.tag}. They now have **${tUser.tokens}** tokens.`);
  }

  if (cmd === 'revoke' || cmd === 'unrevoke') {
    if (!isOwner(message.author.id)) return message.reply('No permission.');
    const obfId = args[0]?.toUpperCase();
    if (!obfId) return message.reply(`Usage: \`.${cmd} OBF-XXXXXX\``);
    if (cmd === 'revoke') {
      db.blacklist[obfId] = { at: Date.now() };
      db_.save(db);
      await logVerify({ user: message.author, obfId, action: 'revoked' });
      return message.reply(`Blacklisted \`${obfId}\`. That user can no longer obfuscate.`);
    } else {
      delete db.blacklist[obfId];
      db_.save(db);
      return message.reply(`Removed \`${obfId}\` from blacklist.`);
    }
  }

  if (cmd === 'blacklist') {
    if (!isOwner(message.author.id)) return message.reply('No permission.');
    const entries = Object.keys(db.blacklist);
    if (!entries.length) return message.reply('Blacklist is empty.');
    return message.reply({ embeds: [new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle('Blacklisted ObfIDs')
      .setDescription(entries.map(id => `\`${id}\``).join('\n').slice(0, 2000))] });
  }

  if (cmd === 'userinfo') {
    if (!isOwner(message.author.id)) return message.reply('No permission.');
    const target = message.mentions.users.first();
    if (!target) return message.reply('Usage: `.userinfo @user`');
    const tUser = db_.getUser(db, target.id);
    db_.regenTokens(tUser);
    return message.reply({ embeds: [new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`User Info - ${target.tag}`)
      .addFields(
        { name: 'Discord ID',  value: target.id,                         inline: true },
        { name: 'ObfID',       value: `\`${tUser.obfId}\``,             inline: true },
        { name: 'Verified',    value: tUser.verified ? 'Yes' : 'No',     inline: true },
        { name: 'Tokens',      value: String(tUser.tokens ?? 0),         inline: true },
        { name: 'Total Uses',  value: String(tUser.totalUses ?? 0),      inline: true },
        { name: 'Blacklisted', value: db.blacklist[tUser.obfId] ? 'Yes' : 'No', inline: true },
      )] });
  }

  if (cmd === 'set' || cmd === 'settings' || cmd === 'mode') {
    const currentMode = user.mode || 'both';
    const modeLabel = { lua: 'Lua', luau: 'Luau', both: 'Both (Lua + Luau)' };

    const menu = new StringSelectMenuBuilder()
      .setCustomId(`goose_mode_${message.author.id}`)
      .setPlaceholder(`Current: ${modeLabel[currentMode]}`)
      .addOptions([
        {
          label: 'Both (Lua + Luau)',
          description: 'Full compatibility — supports both Lua and Luau (default)',
          value: 'both',
          emoji: '🔁',
          default: currentMode === 'both',
        },
        {
          label: 'Luau Only',
          description: 'Optimized for Roblox Luau — strips type annotations, Luau-specific transforms',
          value: 'luau',
          emoji: '🎮',
          default: currentMode === 'luau',
        },
        {
          label: 'Lua Only',
          description: 'Standard Lua 5.1/5.2/5.3 — no Luau-specific features',
          value: 'lua',
          emoji: '📜',
          default: currentMode === 'lua',
        },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('⚙️ Obfuscation Settings')
      .setDescription([
        'Choose your obfuscation mode below.',
        '',
        `**Current mode:** ${modeLabel[currentMode]}`,
        '',
        '🔁 **Both** — Full Lua + Luau support (default)',
        '🎮 **Luau** — Roblox-optimized, strips type annotations',
        '📜 **Lua** — Standard Lua, no Luau-specific handling',
      ].join('\n'));

    return message.reply({ embeds: [embed], components: [row] });
  }

  if (cmd === 'obfuscate' || cmd === 'obf' || cmd === 'o') {
    if (db.blacklist[user.obfId])
      return message.reply('Your obfuscation ID has been revoked. Contact the server owner.');
    if (!user.verified)
      return message.reply('You need to verify first. Type `.verify` to get access.');
    if ((user.tokens || 0) < 1) {
      const next = db_.nextRegenMs(user);
      return message.reply(`You have no tokens. Next recharge in **${fmtMs(next)}**.`);
    }

    const thinking = await message.reply('Obfuscating...');
    let src = null;

    try {
      src = await fetchSource(message);
      if (!src) {
        await thinking.edit('Attach a `.lua` / `.luau` file or paste code after `.obfuscate`.');
        return;
      }
    } catch (err) {
      await thinking.edit(`**Error:** ${err.message}`);
      return;
    }

    // Determine Luau mode from user settings
    const userMode = user.mode || 'both';
    let isLuau;
    if (userMode === 'luau') {
      isLuau = true;  // Always treat as Luau
    } else if (userMode === 'lua') {
      isLuau = false; // Always treat as standard Lua
    } else {
      // 'both' mode: auto-detect from file extension or content
      isLuau = src.ext === '.luau' || looksLikeLuau(src.code);
    }
    const inputKB = (src.code.length / 1024).toFixed(1);
    const modeLabel = { lua: 'Lua', luau: 'Luau', both: 'Both' };

    await logObf({ user: message.author, obfId: user.obfId, filename: src.filename, code: src.code, inputKB, outputKB: null, isLuau, ok: true });

    user.tokens    = (user.tokens || 0) - 1;
    user.totalUses = (user.totalUses || 0) + 1;
    db_.save(db);

    try {
      const { output } = await obfuscate(src.code, {
        vmLayers: 6, strings: true, numbers: true, junk: true,
        security: true, antiDecomp: true, constArr: true,
        validate: !isLuau, isLuau, compress: true,
      });

      const outName  = `${src.name}_obf.lua`;
      const buf      = Buffer.from(output, 'utf-8');
      const outputKB = (buf.length / 1024).toFixed(1);

      const embed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle('Done')
        .addFields(
          { name: 'Input',       value: `${inputKB} KB`,              inline: true },
          { name: 'Output',      value: `${outputKB} KB`,             inline: true },
          { name: 'Mode',        value: `${isLuau ? 'Luau' : 'Lua'} (setting: ${modeLabel[userMode]})`, inline: true },
          { name: 'Tokens left', value: String(user.tokens),          inline: true },
        );

      await thinking.edit({ content: '', embeds: [embed], files: [new AttachmentBuilder(buf, { name: outName })] });

    } catch (err) {
      user.tokens    = (user.tokens || 0) + 1;
      user.totalUses = Math.max(0, (user.totalUses || 1) - 1);
      db_.save(db);

      await logObf({ user: message.author, obfId: user.obfId, filename: src.filename, code: null, inputKB, outputKB: null, isLuau, ok: false, error: err.message });

      const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle('Failed')
        .setDescription('```\n' + (err.message || String(err)).slice(0, 1800) + '\n```')
        .setFooter({ text: 'Token refunded.' });
      await thinking.edit({ content: '', embeds: [embed] }).catch(() => {});
    }
    return;
  }
});

// ── Handle .set select menu interactions ──
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (!interaction.customId.startsWith('goose_mode_')) return;

  const targetUserId = interaction.customId.split('goose_mode_')[1];

  // Only the user who triggered .set can use this menu
  if (interaction.user.id !== targetUserId) {
    return interaction.reply({ content: '❌ This menu is not for you.', ephemeral: true });
  }

  const selected = interaction.values[0]; // 'lua', 'luau', or 'both'
  const modeLabel = { lua: 'Lua', luau: 'Luau', both: 'Both (Lua + Luau)' };

  // Save to DB
  const db   = db_.load();
  const user = db_.getUser(db, interaction.user.id);
  user.mode  = selected;
  db_.save(db);

  const embed = new EmbedBuilder()
    .setColor(0x57F287)
    .setTitle('✅ Mode Updated')
    .setDescription(`Your obfuscation mode has been set to **${modeLabel[selected]}**.`)
    .addFields(
      { name: 'Mode', value: modeLabel[selected], inline: true },
      { name: 'Effect', value: selected === 'luau'
        ? 'Type annotations will be stripped. Luau-specific optimizations enabled.'
        : selected === 'lua'
          ? 'Standard Lua mode. No Luau features.'
          : 'Auto-detects Luau from file extension and code content.',
        inline: false },
    );

  // Update the message to remove the select menu and show confirmation
  await interaction.update({ embeds: [embed], components: [] });
});

client.on('error', err => console.error('Discord error:', err));
process.on('unhandledRejection', err => console.error('Unhandled rejection:', err));

console.log('[boot] Connecting to Discord...');
client.login(TOKEN).catch(err => {
  console.error('[FATAL] Login failed:', err.message);
  console.error('Check your DISCORD_TOKEN in .env - it may be expired or invalid.');
  process.exit(1);
});
