#!/usr/bin/env python3
"""
SMARTSERVE AUTOMATED SUPABASE RESTORATION SCRIPT
Restores all 63 tables from the local JSON backup into a new Supabase project.
"""

import os
import sys
import json
import urllib.request
import urllib.error
import time

BACKUP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backup', 'full_backup_2026-10-14_09-13-35')

def restore_database(new_supabase_url, new_api_key):
    new_supabase_url = new_supabase_url.rstrip('/')
    
    # Verify backup dir
    summary_path = os.path.join(BACKUP_DIR, '_summary.json')
    if not os.path.exists(summary_path):
        print(f"[ERROR] Backup summary not found at {summary_path}")
        return False
        
    with open(summary_path, 'r', encoding='utf-8') as f:
        summary = json.load(f)
        
    tables_exported = summary.get('tables_exported', {})
    total_tables = len(tables_exported)
    print("=" * 65)
    print(f"SMARTSERVE SUPABASE RESTORATION ENGINE")
    print(f"Target: {new_supabase_url}")
    print(f"Tables to restore: {total_tables}")
    print("=" * 65)
    
    total_restored_rows = 0
    failed_tables = []
    
    # Priority order: users first so user IDs match if any logic needs them
    sorted_tables = sorted(tables_exported.keys(), key=lambda t: 0 if t == 'users' else 1)
    
    for idx, table_name in enumerate(sorted_tables, 1):
        expected_rows = tables_exported[table_name]
        json_file = os.path.join(BACKUP_DIR, f"{table_name}.json")
        
        if not os.path.exists(json_file):
            print(f"[{idx}/{total_tables}] SKIP: {table_name} (backup file not found)")
            continue
            
        with open(json_file, 'r', encoding='utf-8') as fp:
            rows = json.load(fp)
            
        if not rows or len(rows) == 0:
            print(f"[{idx}/{total_tables}] OK (Empty): {table_name} (0 rows)")
            continue
            
        print(f"[{idx}/{total_tables}] Restoring {table_name} ({len(rows)} rows)...", end="", flush=True)
        
        # Batch insert in chunks of 100
        batch_size = 100
        success_count = 0
        table_failed = False
        
        for b_start in range(0, len(rows), batch_size):
            batch = rows[b_start : b_start + batch_size]
            
            # Prepare request
            url = f"{new_supabase_url}/rest/v1/{table_name}"
            req = urllib.request.Request(
                url,
                data=json.dumps(batch).encode('utf-8'),
                headers={
                    'apikey': new_api_key,
                    'Authorization': f'Bearer {new_api_key}',
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                },
                method='POST'
            )
            
            try:
                with urllib.request.urlopen(req) as resp:
                    success_count += len(batch)
            except urllib.error.HTTPError as err:
                err_msg = err.read().decode('utf-8', errors='ignore')
                print(f" FAIL at batch {b_start}-{b_start+len(batch)}: {err.code} - {err_msg[:120]}")
                failed_tables.append((table_name, f"HTTP {err.code}: {err_msg[:100]}"))
                table_failed = True
                break
            except Exception as e:
                print(f" FAIL: {e}")
                failed_tables.append((table_name, str(e)))
                table_failed = True
                break
                
            time.sleep(0.05)
            
        if not table_failed:
            print(f" DONE! ({success_count}/{len(rows)} rows)")
            total_restored_rows += success_count
            
    print("\n" + "=" * 65)
    print(f"RESTORATION COMPLETE")
    print(f"Total Rows Restored: {total_restored_rows}")
    if failed_tables:
        print(f"Failed Tables ({len(failed_tables)}):")
        for ft, reason in failed_tables:
            print(f"  - {ft}: {reason}")
    else:
        print("ALL TABLES RESTORED WITH 100% SUCCESS!")
    print("=" * 65)
    return len(failed_tables) == 0

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python restore_database.py <NEW_SUPABASE_URL> <NEW_SERVICE_ROLE_OR_ANON_KEY>")
        sys.exit(1)
        
    url = sys.argv[1].strip()
    key = sys.argv[2].strip()
    restore_database(url, key)
