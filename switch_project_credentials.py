#!/usr/bin/env python3
"""
SMARTSERVE PROJECT CREDENTIALS SWITCHER
Updates the Supabase URL, Anon Key, and local auth storage keys across all frontend files.
"""

import os
import sys
import re

OLD_URL = "https://nukbdmyqizrnkmbusdtm.supabase.co"
OLD_REF = "nukbdmyqizrnkmbusdtm"
OLD_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51a2JkbXlxaXpybmttYnVzZHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMjM3NTQsImV4cCI6MjA5ODg5OTc1NH0.WlKtqa8hBxLedDHS7-q10yoPne6VTjt5F4E86vTA5eY"

TARGET_FILES = [
    "admin.html",
    "customer.html",
    "index.html",
    "scan.html",
    "staff.html",
    "backup.js",
    "restore.js",
    "admin.js",
    "app.js",
    "staff.js"
]

def switch_credentials(new_url, new_anon_key):
    new_url = new_url.rstrip('/')
    # Extract project reference (e.g. from https://abcdefghijklm.supabase.co -> abcdefghijklm)
    match = re.search(r'https?://([a-zA-Z0-9]+)\.supabase\.co', new_url)
    if not match:
        print("[ERROR] Could not extract project ref from URL. Expected format: https://<project-ref>.supabase.co")
        return False
        
    new_ref = match.group(1)
    print("=" * 65)
    print("SMARTSERVE CREDENTIALS SWITCHER")
    print(f"Old URL: {OLD_URL} (ref: {OLD_REF})")
    print(f"New URL: {new_url} (ref: {new_ref})")
    print(f"New Key: {new_anon_key[:12]}...{new_anon_key[-10:]}")
    print("=" * 65)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    updated_count = 0

    for fname in TARGET_FILES:
        fpath = os.path.join(base_dir, fname)
        if not os.path.exists(fpath):
            print(f"  - [SKIP] {fname} (not found)")
            continue
            
        with open(fpath, 'r', encoding='utf-8') as fp:
            content = fp.read()
            
        new_content = content
        
        # Replace URL
        new_content = new_content.replace(OLD_URL, new_url)
        # Replace Anon Key
        new_content = new_content.replace(OLD_ANON, new_anon_key)
        # Replace localStorage token keys
        new_content = new_content.replace(f"sb-{OLD_REF}-auth-token", f"sb-{new_ref}-auth-token")
        
        if new_content != content:
            with open(fpath, 'w', encoding='utf-8') as fp:
                fp.write(new_content)
            print(f"  + [UPDATED] {fname}")
            updated_count += 1
        else:
            print(f"  . [NO CHANGE] {fname}")

    print("=" * 65)
    print(f"SUCCESS: Updated {updated_count} files with the new Supabase credentials!")
    print("=" * 65)
    return True

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python switch_project_credentials.py <NEW_SUPABASE_URL> <NEW_ANON_KEY>")
        sys.exit(1)
        
    url = sys.argv[1].strip()
    key = sys.argv[2].strip()
    switch_credentials(url, key)
