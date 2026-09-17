/**
 * SMARTSERVE — Supabase Restore Script
 * --------------------------------------
 * Reads a backup folder and restores all rows back into Supabase.
 * Uses upsert — safe to run even if the table still has data.
 *
 * Usage:
 *   node restore.js                          ← restores the LATEST backup automatically
 *   node restore.js 2026-08-17_03-15        ← restores a specific backup by folder name
 *
 * What it does:
 *   - Reads each .json file from the backup folder
 *   - Upserts all rows back into the matching Supabase table
 *   - Existing rows are overwritten; deleted rows are recreated
 *   - Does NOT delete rows that exist in Supabase but not in the backup
 */

const https  = require('https');
const fs     = require('fs');
const path   = require('path');

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SUPABASE_URL  = 'https://nukbdmyqizrnkmbusdtm.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51a2JkbXlxaXpybmttYnVzZHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMjM3NTQsImV4cCI6MjA5ODg5OTc1NH0.WlKtqa8hBxLedDHS7-q10yoPne6VTjt5F4E86vTA5eY';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function httpsRequest(urlStr, method, body, extraHeaders) {
  return new Promise((resolve, reject) => {
    const u    = new URL(urlStr);
    const data = body ? JSON.stringify(body) : null;

    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method,
      headers: {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',   // upsert behaviour
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(extraHeaders || {})
      }
    };

    const req = https.request(options, (res) => {
      let respBody = '';
      res.on('data', c => respBody += c);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: respBody }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

/**
 * Upsert rows into a table in chunks of 500 to avoid payload limits.
 */
async function upsertRows(table, rows) {
  const CHUNK = 500;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const url   = `${SUPABASE_URL}/rest/v1/${encodeURIComponent(table)}`;
    const { statusCode, body } = await httpsRequest(url, 'POST', chunk);

    if (statusCode >= 400) {
      throw new Error(`HTTP ${statusCode}: ${body.slice(0, 200)}`);
    }
    inserted += chunk.length;
  }
  return inserted;
}

// ─── PICK BACKUP FOLDER ───────────────────────────────────────────────────────

function pickBackupFolder(targetTimestamp) {
  const backupRoot = path.join(__dirname, 'backup');

  if (!fs.existsSync(backupRoot)) {
    throw new Error(`No backup folder found at ${backupRoot}. Run backup.js first.`);
  }

  const folders = fs.readdirSync(backupRoot)
    .filter(f => fs.statSync(path.join(backupRoot, f)).isDirectory())
    .sort();

  if (folders.length === 0) {
    throw new Error('No backup snapshots found. Run backup.js first.');
  }

  if (targetTimestamp) {
    const match = folders.find(f => f === targetTimestamp);
    if (!match) {
      throw new Error(
        `Backup "${targetTimestamp}" not found.\n` +
        `Available backups:\n  ${folders.join('\n  ')}`
      );
    }
    return path.join(backupRoot, match);
  }

  // Default: use latest backup
  const latest = folders[folders.length - 1];
  return path.join(backupRoot, latest);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   SMARTSERVE — Supabase Restore Tool    ║');
  console.log('╚══════════════════════════════════════════╝\n');

  const targetTimestamp = process.argv[2] || null;
  const backupDir       = pickBackupFolder(targetTimestamp);
  const backupName      = path.basename(backupDir);

  console.log(`📂 Restoring from: ${backupDir}\n`);

  // Read all .json files in the backup folder (skip _summary.json)
  const files = fs.readdirSync(backupDir)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'));

  if (files.length === 0) {
    throw new Error('No table files found in the backup folder.');
  }

  const summary = { restoredFrom: backupName, tables: {}, totalRows: 0 };
  let totalRestored = 0;

  for (const file of files) {
    const table = file.replace('.json', '');
    process.stdout.write(`  ⏳ ${table.padEnd(35)}`);

    try {
      const filePath = path.join(backupDir, file);
      const rows     = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      if (rows.length === 0) {
        console.log(`⏭  0 rows (empty table, skipped)`);
        summary.tables[table] = { status: 'empty', rows: 0 };
        continue;
      }

      const count = await upsertRows(table, rows);
      console.log(`✅  ${count} rows restored`);
      summary.tables[table] = { status: 'ok', rows: count };
      summary.totalRows += count;
      totalRestored    += count;

    } catch (err) {
      console.log(`❌  ERROR: ${err.message}`);
      summary.tables[table] = { status: 'error', error: err.message };
    }
  }

  console.log('\n──────────────────────────────────────────');
  console.log(`✅  Restore complete!`);
  console.log(`    ${totalRestored} rows restored from backup: ${backupName}`);
  console.log('──────────────────────────────────────────\n');
}

main().catch(err => {
  console.error('\n❌ Restore failed:', err.message);
  process.exit(1);
});
