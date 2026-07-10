module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { number, message } = req.body;
  if (!number || !message) return res.status(400).json({ error: 'Missing number or message' });

  const apiKey = process.env.SEMAPHORE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing API key on server' });

  try {
    const params = new URLSearchParams();
    params.append('apikey', apiKey);
    params.append('number', number);
    params.append('message', message);

    const response = await fetch('https://api.semaphore.co/api/v4/messages', {
      method: 'POST',
      body: params,
    });

    const text = await response.text();
    if (!response.ok) return res.status(response.status).json({ error: text });
    return res.status(200).json({ success: true, data: text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
