export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;
  if (!PAYMONGO_SECRET_KEY) {
    return res.status(500).json({ error: 'PayMongo Secret Key not configured in environment.' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nukbdmyqizrnkmbusdtm.supabase.co';
  const SUPABASE_ANON = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51a2JkbXlxaXpybmttYnVzZHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMjM3NTQsImV4cCI6MjA5ODg5OTc1NH0.WlKtqa8hBxLedDHS7-q10yoPne6VTjt5F4E86vTA5eY';

  // =========================================================================
  // ACTION: CHECK PAYMENT STATUS
  // Allows the Admin side to check if payment is already received in real-time,
  // even BEFORE the customer clicks "Return to Merchant".
  // =========================================================================
  const isCheck = req.method === 'GET' || req.body?.action === 'check';
  if (isCheck) {
    let sessionId = req.query?.sessionId || req.body?.sessionId || '';
    const meetingId = req.query?.meetingId || req.body?.meetingId || '';
    let resId = req.query?.resId || req.query?.reservationId || req.body?.resId || req.body?.reservationId || '';

    // If sessionId is missing, try looking it up from meetings.live_draft
    if (!sessionId && meetingId) {
      try {
        const mGet = await fetch(`${SUPABASE_URL}/rest/v1/meetings?id=eq.${meetingId}&select=live_draft,reservation_id,reservationId,initial_fee_status,initial_fee_method,initial_fee_received,initial_fee_ref_id`, {
          headers: { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}` }
        });
        const mRows = await mGet.json();
        if (mRows && mRows[0]) {
          if (!resId) resId = mRows[0].reservation_id || mRows[0].reservationId || '';
          if (mRows[0].initial_fee_status === 'paid') {
            return res.status(200).json({
              paid: true,
              status: 'paid',
              method: mRows[0].initial_fee_method || 'gcash',
              amount: mRows[0].initial_fee_received || 5000,
              refId: mRows[0].initial_fee_ref_id || ('PAY-INIT-' + String(resId || meetingId || '000000').slice(-6).toUpperCase())
            });
          }
          sessionId = mRows[0].live_draft?.paymongo_session_id || '';
        }
      } catch (e) {}
    }

    if (!sessionId) {
      return res.status(200).json({ paid: false, status: 'no_session' });
    }

    try {
      const pmRes = await fetch(`https://api.paymongo.com/v1/checkout_sessions/${sessionId}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`
        }
      });
      const sessionData = await pmRes.json();
      if (sessionData.errors) {
        return res.status(400).json({ error: sessionData.errors[0].detail });
      }

      const attrs = sessionData.data?.attributes || {};
      const payments = attrs.payments || [];
      const isPaid = attrs.status === 'paid' || payments.some(p => p.attributes?.status === 'paid');

      if (isPaid) {
        const pObj = payments[0] || {};
        const payId = pObj.id || ('PAY-' + sessionId.slice(-8));
        const payMethod = pObj.attributes?.source?.type || pObj.attributes?.payment_method_type || pObj.attributes?.payment_method_used || 'gcash';
        const payAmount = (pObj.attributes?.amount ? pObj.attributes.amount / 100 : 5000);
        const now = new Date().toISOString();
        const refId = 'PAY-INIT-' + String(resId || meetingId || '000000').slice(-6).toUpperCase();

        const sbHeaders = {
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        };

        // 1. Update Supabase meetings
        if (meetingId) {
          try {
            await fetch(`${SUPABASE_URL}/rest/v1/meetings?id=eq.${meetingId}`, {
              method: 'PATCH',
              headers: sbHeaders,
              body: JSON.stringify({
                initial_fee_status: 'paid',
                initial_fee_method: payMethod,
                initial_fee_received: payAmount,
                initial_fee_change: 0,
                initial_fee_paid_at: now,
                initial_fee_received_by: `PayMongo Gateway (${payMethod.toUpperCase()})`,
                initial_fee_ref_id: refId
              })
            });
          } catch (mErr) {
            console.error('Supabase meetings live update error:', mErr);
          }
        }

        // 2. Update Supabase reservations & reservation_payments
        if (resId) {
          try {
            await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${resId}`, {
              method: 'PATCH',
              headers: sbHeaders,
              body: JSON.stringify({
                initial_fee_status: 'paid',
                initial_fee_paid: true,
                payment_status: 'initial_paid',
                updated_at: now
              })
            });

            await fetch(`${SUPABASE_URL}/rest/v1/reservation_payments`, {
              method: 'POST',
              headers: { ...sbHeaders, 'Prefer': 'resolution=merge-duplicates' },
              body: JSON.stringify({
                reservation_id: resId,
                initial_fee_amount: payAmount,
                initial_fee_status: 'paid',
                initial_fee_method: payMethod,
                initial_fee_received: payAmount,
                initial_fee_change: 0,
                initial_fee_paid_at: now,
                initial_fee_received_by: `PayMongo Gateway (${payMethod.toUpperCase()})`,
                updated_at: now
              })
            });
          } catch (rErr) {
            console.error('Supabase reservations live update error:', rErr);
          }
        }

        return res.status(200).json({
          paid: true,
          status: 'paid',
          paymentId: payId,
          method: payMethod,
          amount: payAmount,
          refId: refId
        });
      }

      return res.status(200).json({
        paid: false,
        status: attrs.status || 'active'
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // =========================================================================
  // ACTION: CREATE CHECKOUT SESSION
  // =========================================================================
  const { items, customerInfo, reservationId, meetingId, paymentType, returnUrl } = req.body;

  // Amount in centavos (PayMongo requires integer cents)
  const line_items = (items || []).map(item => {
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
    const custName = customerInfo?.name || 'Customer';
    const custEmail = customerInfo?.email || undefined;
    const custPhone = customerInfo?.phone || undefined;

    const sessionPayload = {
      data: {
        attributes: {
          send_email_receipt: true,
          show_description:   true,
          show_line_items:    true,
          description: `${customerInfo?.type || 'Event'} Reservation — ${custName}`,
          line_items,
          payment_method_types: ['gcash', 'paymaya', 'card'],
          success_url: successUrl,
          cancel_url:  cancelUrl
        }
      }
    };

    if (custEmail || custPhone || custName) {
      sessionPayload.data.attributes.billing = {
        name: custName,
        email: custEmail,
        phone: custPhone
      };
    }

    const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`
      },
      body: JSON.stringify(sessionPayload)
    });

    const data = await response.json();

    if (data.errors) {
      console.error('PayMongo API Error:', JSON.stringify(data.errors));
      return res.status(400).json({ error: data.errors[0].detail });
    }

    const sessionId = data.data.id;
    const checkoutUrl = data.data.attributes.checkout_url;

    // Immediately persist session_id to Supabase meetings.live_draft so the admin meeting room
    // can start real-time polling before the customer even begins checkout
    if (meetingId) {
      try {
        const mGet = await fetch(`${SUPABASE_URL}/rest/v1/meetings?id=eq.${meetingId}&select=live_draft`, {
          headers: { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}` }
        });
        const mJson = await mGet.json();
        const curDraft = (mJson && mJson[0] && typeof mJson[0].live_draft === 'object' && mJson[0].live_draft) ? mJson[0].live_draft : {};
        curDraft.paymongo_session_id = sessionId;
        curDraft.paymongo_res_id = reservationId || '';
        curDraft.paymongo_checkout_url = checkoutUrl;

        await fetch(`${SUPABASE_URL}/rest/v1/meetings?id=eq.${meetingId}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_ANON,
            'Authorization': `Bearer ${SUPABASE_ANON}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ live_draft: curDraft })
        });
      } catch (sbErr) {
        console.warn('Could not record paymongo_session_id on meeting draft:', sbErr);
      }
    }

    res.status(200).json({
      checkout_url: checkoutUrl,
      url:          checkoutUrl,
      session_id:   sessionId
    });

  } catch (error) {
    console.error('Checkout Session Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
