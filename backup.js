/**
 * SMARTSERVE — Supabase Full Backup Script
 * -----------------------------------------
 * Backs up ALL known tables in your Supabase project.
 * Tables that don't exist are automatically skipped (no errors).
 *
 * Usage:
 *   node backup.js
 *
 * Output:
 *   backup/2026-08-17_03-14/
 *     ├── meetings.json
 *     ├── guests.json
 *     ├── ... (every table)
 *     └── _summary.json
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SUPABASE_URL  = 'https://nukbdmyqizrnkmbusdtm.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51a2JkbXlxaXpybmttYnVzZHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMjM3NTQsImV4cCI6MjA5ODg5OTc1NH0.WlKtqa8hBxLedDHS7-q10yoPne6VTjt5F4E86vTA5eY';

// Complete list — compiled from code analysis + Supabase dashboard.
// Tables that don't exist in DB are silently skipped.
const TABLES = [
  'additional_reservation_details',
  'adhoc_charges',
  'admin_chats',
  'ai_conversations',
  'allocation_history',
  'announcements',
  'chat_messages',
  'chats',
  'customer_cart',
  'deploymentlogs',
  'designs',
  'directives',
  'equipment_assets',
  'equipment_cycles',
  'equipment_flags',
  'equipment_inventory',
  'equipment_maintenance',
  'equipment_resupply',
  'execution_activities',
  'foodtaste',
  'guests',
  'issueresolutions',
  'maintenancetasks',
  'meetings',
  'menu_items',
  'messages',
  'personnel',
  'premade_package_items',
  'premade_packages',
  'purchaseorders',
  'recipe_ingredients',
  'rental_orders',
  'reservation_decorations',
  'reservation_items',
  'reservation_payments',
  'reservations',
  'routine_check',
  'suppliers',
  'users',
  'venue_equipment',
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function pad(n) { return String(n).padStart(2, '0'); }

function makeTimestamp() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`;
}

function httpsGet(urlStr, extraHeaders) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
        ...(extraHeaders || {})
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

/**
 * Fetches ALL rows from a table, paginating in chunks of 1000.
 */
async function fetchAllRows(table) {
  let allRows = [];
  let offset  = 0;
  let total   = null;

  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/${encodeURIComponent(table)}?select=*&offset=${offset}&limit=1000`;
    const { statusCode, headers: respHeaders, body } = await httpsGet(url, {
      'Prefer': 'count=exact'
    });

    if (statusCode >= 400) {
      return { rows: null, skipped: true, reason: body.slice(0, 120) };
    }

    const rows = JSON.parse(body);
    allRows = allRows.concat(rows);

    if (total === null) {
      const cr = respHeaders['content-range'] || '';
      const m  = cr.match(/\/(\d+)$/);
      total = m ? parseInt(m[1]) : rows.length;
    }

    if (allRows.length >= total || rows.length === 0) break;
    offset += rows.length;
  }

  return { rows: allRows, skipped: false };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   SMARTSERVE — Supabase Backup Tool     ║');
  console.log('╚══════════════════════════════════════════╝\n');

  const timestamp = makeTimestamp();
  const backupDir = path.join(__dirname, 'backup', timestamp);
  fs.mkdirSync(backupDir, { recursive: true });

  console.log(`📁 Saving to: ${backupDir}`);
  console.log(`   Backing up ${TABLES.length} tables...\n`);

  const summary = { timestamp, tables: {}, totalRows: 0 };

  for (const table of TABLES) {
    process.stdout.write(`  ⏳ ${table.padEnd(35)}`);

    try {
      const { rows, skipped, reason } = await fetchAllRows(table);

      if (skipped) {
        console.log(`SKIPPED  (table not in DB)`);
        summary.tables[table] = { status: 'skipped', rows: 0 };
        continue;
      }

      const outPath = path.join(backupDir, `${table}.json`);
      fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), 'utf8');

      console.log(`✅  ${rows.length} rows`);
      summary.tables[table] = { status: 'ok', rows: rows.length };
      summary.totalRows += rows.length;

    } catch (err) {
      console.log(`❌  ERROR: ${err.message}`);
      summary.tables[table] = { status: 'error', error: err.message };
    }
  }

  fs.writeFileSync(
    path.join(backupDir, '_summary.json'),
    JSON.stringify(summary, null, 2),
    'utf8'
  );

  const backed  = Object.values(summary.tables).filter(t => t.status === 'ok').length;
  const skipped = Object.values(summary.tables).filter(t => t.status === 'skipped').length;

  console.log('\n──────────────────────────────────────────');
  console.log(`✅  Backup complete!`);
  console.log(`    ${summary.totalRows} total rows across ${backed} tables`);
  if (skipped > 0) console.log(`    ${skipped} tables skipped (not in DB yet)`);
  console.log(`    📁 ${backupDir}`);
  console.log('──────────────────────────────────────────\n');
}

main().catch(err => {
  console.error('\n❌ Backup failed:', err.message);
  process.exit(1);
});
