export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { items, customerInfo, reservationId, meetingId, paymentType, returnUrl } = req.body;

  const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;
  if (!PAYMONGO_SECRET_KEY) {
    return res.status(500).json({ error: 'PayMongo Secret Key not configured in environment.' });
  }

  // Amount in centavos (PayMongo requires integer cents)
  const line_items = items.map(item => {
    let amtCentavos = 0;
    if (typeof item.price === 'number') {
      amtCentavos = Math.round(item.price * 100);
    } else if (typeof item.amount === 'number') {
      amtCentavos = Math.round(item.amount);
    } else if (item.price) {
      amtCentavos = Math.round(parseFloat(item.price) * 100);
    } else if (item.amount) {
      amtCentavos = Math.round(parseFloat(item.amount));
    }
    if (!amtCentavos || isNaN(amtCentavos) || amtCentavos < 100) {
      amtCentavos = 500000;
    }
    return {
      name: item.name || 'Halden Catering Reservation Payment',
      amount: amtCentavos,
      currency: 'PHP',
      quantity: item.quantity || 1
    };
  });

  // Derive base origin from request headers
  const origin =
    req.headers.origin ||
    (req.headers.referer ? req.headers.referer.split('/').slice(0, 3).join('/') : null) ||
    'https://smartserve-rho.vercel.app';

  // Determine return target page:
  // If returnUrl is explicitly passed, use it.
  // Otherwise if meetingId is present or paymentType is meeting-related, return to customer.html
  let basePath = returnUrl;
  if (!basePath) {
    if (meetingId || paymentType === 'initial_fee' || paymentType === 'cancellation_fee') {
      basePath = `${origin}/customer.html`;
    } else {
      basePath = `${origin}/index.html`;
    }
  }

  const separator = basePath.includes('?') ? '&' : '?';
  let successUrl = `${basePath}${separator}payment=success&resId=${reservationId || ''}`;
  if (paymentType) successUrl += `&type=${encodeURIComponent(paymentType)}`;
  if (meetingId)   successUrl += `&meetingId=${encodeURIComponent(meetingId)}`;

  let cancelUrl = `${basePath}${separator}payment=cancel&resId=${reservationId || ''}`;
  if (paymentType) cancelUrl += `&type=${encodeURIComponent(paymentType)}`;
  if (meetingId)   cancelUrl += `&meetingId=${encodeURIComponent(meetingId)}`;

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
            show_description:   true,
            show_line_items:    true,
            description: `${customerInfo?.type || 'Event'} Reservation — ${customerInfo?.name || 'Customer'}`,
            line_items,
            payment_method_types: ['gcash', 'paymaya', 'card'],
            success_url: successUrl,
            cancel_url:  cancelUrl
          }
        }
      })
    });

    const data = await response.json();

    if (data.errors) {
      console.error('PayMongo API Error:', JSON.stringify(data.errors));
      return res.status(400).json({ error: data.errors[0].detail });
    }

    res.status(200).json({
      checkout_url: data.data.attributes.checkout_url,
      url:          data.data.attributes.checkout_url,
      session_id:   data.data.id
    });

  } catch (error) {
    console.error('Checkout Session Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
