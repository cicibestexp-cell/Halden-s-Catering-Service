import json
import glob
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

backup_dir = r'backup/full_backup_2026-10-14_09-13-35'

with open('MIGRATION_PART1_SCHEMA.sql', 'r', encoding='utf-8') as f:
    schema = f.read()

# Parse tables
tables = {}
for m in re.finditer(r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?public\.([a-zA-Z0-9_]+)\s*\((.*?)\);', schema, re.DOTALL):
    tname = m.group(1)
    body = m.group(2)
    cols = {}
    for line in body.splitlines():
        line = line.strip().rstrip(',')
        if line.startswith('--') or not line or line.startswith('CONSTRAINT') or line.startswith('PRIMARY KEY'):
            continue
        parts = line.split()
        if len(parts) >= 2:
            cname = parts[0].replace('"', '')
            ctype = parts[1].lower()
            not_null = 'not null' in line.lower()
            cols[cname] = {'type': ctype, 'not_null': not_null, 'raw': line}
    tables[tname] = cols

# Add ALTER TABLE columns
for m in re.finditer(r'ALTER\s+TABLE\s+public\.([a-zA-Z0-9_]+)\s+ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+"([^"]+)"\s+([a-zA-Z0-9_]+)', schema):
    tname, cname, ctype = m.group(1), m.group(2), m.group(3).lower()
    if tname in tables and cname not in tables[tname]:
        tables[tname][cname] = {'type': ctype, 'not_null': False, 'raw': 'alter'}

print(f"Checking {len(tables)} tables against backup JSONs...")
issues = []
for f in glob.glob(os.path.join(backup_dir, '*.json')):
    tname = os.path.basename(f)[:-5]
    if tname.startswith('_'):
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        rows = json.load(fp)
    if not rows:
        continue
    if tname not in tables:
        issues.append(f"Table {tname} has data but NOT in schema!")
        continue
    tcols = tables[tname]
    for r_idx, r in enumerate(rows):
        for cname, val in r.items():
            if cname not in tcols:
                issues.append(f"Table {tname} has col {cname} in data but NOT in schema!")
                continue
            col_info = tcols[cname]
            ctype = col_info['type']
            # Check NOT NULL
            if val is None:
                if col_info['not_null']:
                    issues.append(f"NULL VIOLATION: {tname}.{cname} is NOT NULL but row {r_idx} has NULL")
                continue
            # Check UUID
            if ctype == 'uuid':
                if not isinstance(val, str) or not re.match(r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$', str(val)):
                    issues.append(f"UUID VIOLATION: {tname}.{cname} expects uuid, got {type(val).__name__}: {repr(val)[:50]}")
            # Check boolean
            elif ctype == 'boolean':
                if not isinstance(val, bool):
                    issues.append(f"BOOLEAN VIOLATION: {tname}.{cname} expects bool, got {type(val).__name__}: {repr(val)[:50]}")
            # Check numeric / integer / bigint
            elif any(x in ctype for x in ['numeric', 'int', 'bigint', 'smallint', 'double', 'float']):
                if isinstance(val, str):
                    try:
                        float(val)
                    except ValueError:
                        issues.append(f"NUMERIC VIOLATION: {tname}.{cname} expects {ctype}, got string: {repr(val)[:50]}")
            # Check date
            elif ctype == 'date':
                if isinstance(val, str) and not re.match(r'^\d{4}-\d{2}-\d{2}$', val):
                    issues.append(f"DATE VIOLATION: {tname}.{cname} expects date (YYYY-MM-DD), got: {repr(val)[:50]}")

print(f"Total issues found: {len(issues)}")
for iss in sorted(list(set(issues))):
    print(" ", iss)
