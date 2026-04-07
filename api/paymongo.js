export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items, customerInfo } = req.body;

  // PayMongo Checkout Session API
  const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

  if (!PAYMONGO_SECRET_KEY) {
    return res.status(500).json({ error: 'PayMongo Secret Key not configured in environment.' });
  }

  // Format line items for PayMongo
  // PayMongo expects amount in cents (e.g. 10000 for ₱100.00)
  const line_items = items.map(item => ({
    name: item.name,
    amount: Math.round(item.price * 100),
    currency: 'PHP',
    quantity: 1
  }));

  try {
    const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            description: `Reservation for ${customerInfo.name} - ${customerInfo.type}`,
            line_items: line_items,
            payment_method_types: ['gcash', 'paymaya', 'card'],
            success_url: req.headers.referer || 'https://your-vercel-url.vercel.app',
            cancel_url: req.headers.referer || 'https://your-vercel-url.vercel.app'
          }
        }
      })
    });

    const data = await response.json();

    if (data.errors) {
      console.error('PayMongo API Error:', data.errors);
      return res.status(400).json({ error: data.errors[0].detail });
    }

    res.status(200).json({ checkout_url: data.data.attributes.checkout_url });
  } catch (error) {
    console.error('Checkout Session Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
