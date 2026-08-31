"""
SMARTSERVE — Supabase Full Backup Script (Python version)
----------------------------------------------------------
Backs up ALL known tables from your Supabase project to JSON files.
Tables that don't exist or are inaccessible are automatically skipped.

Usage:
  python backup_py.py

Output:
  backup/2026-08-20_15-06/
    ├── reservations.json
    ├── personnel.json
    ├── meetings.json
    ├── ... (every table)
    └── _summary.json
"""

import json
import os
import urllib.request
import urllib.error
from datetime import datetime

# ─── CONFIG ──────────────────────────────────────────────────────────────────
SUPABASE_URL  = 'https://nukbdmyqizrnkmbusdtm.supabase.co'
SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51a2JkbXlxaXpybmttYnVzZHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMjM3NTQsImV4cCI6MjA5ODg5OTc1NH0.WlKtqa8hBxLedDHS7-q10yoPne6VTjt5F4E86vTA5eY'

TABLES = [
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
]

def discover_tables():
    url = f"{SUPABASE_URL}/rest/v1/"
    req = urllib.request.Request(
        url,
        headers={
            'apikey':        SUPABASE_ANON,
            'Authorization': f'Bearer {SUPABASE_ANON}',
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            paths = list(data.get('paths', {}).keys())
            discovered = [p.strip('/') for p in paths if p != '/' and not p.startswith('/rpc/')]
            if len(discovered) > 0:
                # Union with TABLES list to ensure complete coverage
                all_t = sorted(list(set(TABLES + discovered)))
                return all_t
    except Exception as e:
        pass
    return TABLES

# ─── HELPERS ─────────────────────────────────────────────────────────────────

def fetch_all_rows(table):
    """Fetch ALL rows from a table using pagination (1000 rows per page)."""
    all_rows = []
    offset   = 0
    total    = None

    while True:
        url = f"{SUPABASE_URL}/rest/v1/{table}?select=*&offset={offset}&limit=1000"
        req = urllib.request.Request(
            url,
            headers={
                'apikey':        SUPABASE_ANON,
                'Authorization': f'Bearer {SUPABASE_ANON}',
                'Content-Type':  'application/json',
                'Prefer':        'count=exact',
            }
        )

        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                body = resp.read().decode('utf-8')
                rows = json.loads(body)
                all_rows.extend(rows)

                if total is None:
                    cr = resp.headers.get('Content-Range', '')
                    import re
                    m = re.search(r'/(\d+)$', cr)
                    total = int(m.group(1)) if m else len(rows)

                if len(all_rows) >= total or len(rows) == 0:
                    break
                offset += len(rows)

        except urllib.error.HTTPError as e:
            return None, f"HTTP {e.code}: {e.reason}"
        except Exception as e:
            return None, str(e)

    return all_rows, None


# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    import sys
    # Force UTF-8 output on Windows to avoid cp1252 encoding errors
    if sys.stdout.encoding != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')

    print('\n+==========================================+')
    print('|   SMARTSERVE -- Supabase Backup Tool   |')
    print('+==========================================+\n')

    timestamp  = datetime.now().strftime('%Y-%m-%d_%H-%M')
    script_dir = os.path.dirname(os.path.abspath(__file__))
    backup_dir = os.path.join(script_dir, 'backup', timestamp)
    os.makedirs(backup_dir, exist_ok=True)

    tables_to_backup = discover_tables()
    print(f'>> Saving to: {backup_dir}')
    print(f'   Backing up {len(tables_to_backup)} tables...\n')

    summary    = {'timestamp': timestamp, 'tables': {}, 'totalRows': 0}
    backed_up  = 0
    skipped    = 0

    for table in tables_to_backup:
        label = (table + ' ').ljust(38, '.')
        print(f'  [ ] {label}', end='', flush=True)

        rows, error = fetch_all_rows(table)

        if error:
            print(f'SKIPPED  ({error[:60]})')
            summary['tables'][table] = {'status': 'skipped', 'rows': 0}
            skipped += 1
            continue

        out_path = os.path.join(backup_dir, f'{table}.json')
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(rows, f, indent=2, ensure_ascii=False)

        count = len(rows)
        print(f'OK  {count} rows')
        summary['tables'][table] = {'status': 'ok', 'rows': count}
        summary['totalRows'] += count
        backed_up += 1

    # Write summary
    summary_path = os.path.join(backup_dir, '_summary.json')
    with open(summary_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print('\n------------------------------------------')
    print(f'Backup complete!')
    print(f'  {summary["totalRows"]} total rows across {backed_up} tables')
    if skipped > 0:
        print(f'  {skipped} tables skipped (not in DB or no access)')
    print(f'  Saved to: {backup_dir}')
    print('------------------------------------------\n')


if __name__ == '__main__':
    main()
