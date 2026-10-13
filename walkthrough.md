# PayMongo Integration Walkthrough

I have integrated **PayMongo** into the SMARTSERVE application. Users will now be redirected to a secure PayMongo checkout page (supporting GCash, Maya, and Cards) after confirming their reservation.

## Changes Made

### 1. Backend Endpoint: [paymongo.js](file:///c:/Users/USER/Desktop/SMARTSERVE/api/paymongo.js)
- Created a serverless function that interacts with the PayMongo API to create a Checkout Session.
- It securely handles the transaction and returns a `checkout_url`.

### 2. Frontend Logic: [app.js](file:///c:/Users/USER/Desktop/SMARTSERVE/app.js)
- Updated [submitReservation()](file:///c:/Users/USER/Desktop/SMARTSERVE/app.js#692-777) to:
  - Save the reservation to Firebase with a status of `awaiting_payment`.
  - Fetch the checkout URL from our new backend.
  - Redirect the user to PayMongo.

### 3. UI Updates: [index.html](file:///c:/Users/USER/Desktop/SMARTSERVE/index.html) & [style.css](file:///c:/Users/USER/Desktop/SMARTSERVE/style.css)
- Simplified the checkout drawer to focus on "Secure Online Payment".
- Added a premium-looking info box to reassure users.

---

## 🚀 How to get it working

To make the payments work, you need to add your PayMongo Secret Key to your environment variables.

### 1. Get your API Keys
1. Go to your [PayMongo Dashboard](https://dashboard.paymongo.com/).
2. Navigate to **Developers** > **API Keys**.
3. Copy your **Secret Key** (it starts with `sk_live_` for real payments or `sk_test_` for testing).

### 2. Set the Environment Variable
If you are using **Vercel**:
1. Go to your project settings in Vercel.
2. Navigate to **Environment Variables**.
3. Add a new variable:
   - **Key**: `PAYMONGO_SECRET_KEY`
   - **Value**: `[Your Secret Key]`
4. Redeploy your application.

### 3. Testing
You can use PayMongo's test cards and test GCash numbers to verify the flow while in "Test Mode".

| Payment Method | Test Number / Card |
| :--- | :--- |
| **GCash** | Use `09111111111` and any OTP |
| **Maya** | Use `09111111111` and any OTP |
| **Visa/Mastercard** | Use standard test cards from PayMongo docs |

> [!IMPORTANT]
> Never share your `sk_live_` key with anyone. The code I wrote accesses it securely via `process.env`.
