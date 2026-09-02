export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
  const openrouterKey = (process.env.OPENROUTER_API_KEY || '').trim();

  // Option 1: Direct Google Gemini API (1,500 free requests/day, ultra-fast)
  if (geminiKey) {
    try {
      const messages = req.body.messages || [];
      const systemMsg = messages.find(m => m.role === 'system')?.content || '';
      const userMsgs = messages.filter(m => m.role !== 'system');

      // Strictly alternate turns (user -> model -> user -> model) to satisfy Gemini API requirements
      const contents = [];
      let lastRole = null;

      for (const m of userMsgs) {
        const role = m.role === 'assistant' ? 'model' : 'user';
        const text = (typeof m.content === 'string' ? m.content : JSON.stringify(m.content || '')).trim();
        if (!text) continue;

        if (role === lastRole && contents.length > 0) {
          contents[contents.length - 1].parts[0].text += '\n\n' + text;
        } else {
          contents.push({ role, parts: [{ text }] });
          lastRole = role;
        }
      }

      if (contents.length > 0 && contents[0].role === 'model') {
        contents.shift();
      }

      if (contents.length === 0) {
        contents.push({ role: 'user', parts: [{ text: 'Hello' }] });
      }

      const geminiModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
      for (const mod of geminiModels) {
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${mod}:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: systemMsg ? { parts: [{ text: systemMsg }] } : undefined,
            contents: contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1200
            }
          })
        });

        const geminiData = await geminiRes.json();
        if (geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = geminiData.candidates[0].content.parts[0].text;
          res.status(200).json({
            choices: [{ message: { content: text } }]
          });
          return;
        }
      }
    } catch (err) {
      console.warn('Direct Gemini API error:', err);
    }
  }

  // Option 2: OpenRouter Fallback Proxy
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey || ''}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-vercel-url.vercel.app',
        'X-Title': "Halden's AI Planner"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
