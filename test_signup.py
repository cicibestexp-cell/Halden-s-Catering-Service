import requests
import json
import time

SUPABASE_URL = "https://nukbdmyqizrnkmbusdtm.supabase.co"
SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51a2JkbXlxaXpybmttYnVzZHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMjM3NTQsImV4cCI6MjA5ODg5OTc1NH0.WlKtqa8hBxLedDHS7-q10yoPne6VTjt5F4E86vTA5eY"

headers = {
    "apikey": SUPABASE_ANON,
    "Authorization": f"Bearer {SUPABASE_ANON}",
    "Content-Type": "application/json"
}

test_email = "test.migration@example.com"
test_password = "TestPassword123!"

print("1. Signing up a test user to see how Supabase does it internally...")
signup_res = requests.post(
    f"{SUPABASE_URL}/auth/v1/signup",
    headers=headers,
    json={"email": test_email, "password": test_password}
)

print(f"Signup response: {signup_res.status_code}")
if signup_res.status_code not in [200, 201]:
    print(signup_res.text)
else:
    data = signup_res.json()
    user_id = data.get("user", {}).get("id")
    print(f"User created with ID: {user_id}")
    
    print("\n2. Fetching the exact auth.users row...")
    u_res = requests.post(f"{SUPABASE_URL}/rest/v1/rpc/get_test_user_row", headers=headers, json={"test_email": test_email})
    if u_res.status_code == 200:
        print(json.dumps(u_res.json(), indent=2))
    else:
        print(u_res.text)
        
    print("\n3. Fetching the exact auth.identities row...")
    i_res = requests.post(f"{SUPABASE_URL}/rest/v1/rpc/get_test_identity_row", headers=headers, json={"test_user_id": user_id})
    if i_res.status_code == 200:
        print(json.dumps(i_res.json(), indent=2))
    else:
        print(i_res.text)
