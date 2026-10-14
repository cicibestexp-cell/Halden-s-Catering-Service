import json
import glob
import os
import re

backup_dir = r'backup/full_backup_2026-10-14_09-13-35'

with open('MIGRATION_PART1_SCHEMA.sql', 'r', encoding='utf-8') as f:
    schema = f.read()

# Extract table schemas and column types
table_schemas = {}
for m in re.finditer(r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?public\.([a-zA-Z0-9_]+)\s*\((.*?)\);', schema, re.DOTALL):
    tname = m.group(1)
    body = m.group(2)
    col_types = {}
    for line in body.splitlines():
        line = line.strip().rstrip(',')
        if line.startswith('--') or not line or 'PRIMARY KEY' in line or 'CONSTRAINT' in line:
            continue
        parts = line.split()
        if len(parts) >= 2:
            cname = parts[0].replace('"', '')
            col_types[cname] = parts[1].lower()
    table_schemas[tname] = col_types

# Also check ALTER TABLE ADD COLUMN lines
for m in re.finditer(r'ALTER\s+TABLE\s+public\.([a-zA-Z0-9_]+)\s+ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+\"([^\"]+)\"\s+([a-zA-Z0-9_]+)', schema):
    tname = m.group(1)
    col = m.group(2)
    ctype = m.group(3).lower()
    if tname in table_schemas:
        # If it wasn't in CREATE TABLE, store it
        if col not in table_schemas[tname]:
            table_schemas[tname][col] = ctype

# Now check each JSON file
mismatches = []
for f in glob.glob(os.path.join(backup_dir, '*.json')):
    tname = os.path.basename(f)[:-5]
    if tname.startswith('_'):
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        rows = json.load(fp)
    if not rows:
        continue
    
    schema_cols = table_schemas.get(tname, {})
    for r_idx, r in enumerate(rows):
        for k, v in r.items():
            if v is None:
                continue
            expected_type = schema_cols.get(k)
            if not expected_type:
                continue
            if 'numeric' in expected_type or 'int' in expected_type:
                if isinstance(v, str):
                    try:
                        float(v)
                    except ValueError:
                        mismatches.append((tname, k, expected_type, type(v).__name__, repr(v)[:40]))
            elif expected_type == 'date':
                if isinstance(v, str):
                    # Check if standard ISO date YYYY-MM-DD
                    if not re.match(r'^\d{4}-\d{2}-\d{2}$', v):
                        mismatches.append((tname, k, expected_type, type(v).__name__, repr(v)[:40]))

print(f"Total type mismatches found: {len(mismatches)}")
unique_mismatches = sorted(list(set(mismatches)))
for m in unique_mismatches:
    print(f"  Table: {m[0]}, Col: {m[1]} (Schema: {m[2]}, Data: {m[3]}, Val: {m[4]})")
