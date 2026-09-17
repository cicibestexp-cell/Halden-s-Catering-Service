import requests
import json

SUPABASE_URL = "https://nukbdmyqizrnkmbusdtm.supabase.co"
SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51a2JkbXlxaXpybmttYnVzZHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMjM3NTQsImV4cCI6MjA5ODg5OTc1NH0.WlKtqa8hBxLedDHS7-q10yoPne6VTjt5F4E86vTA5eY"

headers = {
    "apikey": SUPABASE_ANON,
    "Authorization": f"Bearer {SUPABASE_ANON}",
    "Content-Type": "application/json"
}

print("Fetching auth.users schema...")
response = requests.post(f"{SUPABASE_URL}/rest/v1/rpc/get_auth_schema_info", headers=headers)

if response.status_code == 200:
    cols = response.json()
    print(f"Total columns: {len(cols)}")
    for col in cols:
        name = col.get("column_name")
        nullable = col.get("is_nullable")
        default = col.get("column_default")
        
        if nullable == 'NO':
            print(f"REQUIRED: {name} | default={default}")
        else:
            print(f"OPTIONAL: {name} | default={default}")
else:
    print(f"Error {response.status_code}: {response.text}")
