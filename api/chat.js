export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
  const openrouterKey = (process.env.OPENROUTER_API_KEY || '').trim();

  // Option 1: Direct Google Gemini API
  // Only tries ONE model to stay within Vercel's 10-second serverless timeout.
  if (geminiKey) {
    try {
      const messages = req.body.messages || [];
      const systemMsg = messages.find(m => m.role === 'system')?.content || '';
      const userMsgs = messages.filter(m => m.role !== 'system');

      // Build strictly alternating user/model turns
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

      // Gemini requires conversation to start with a user turn
      if (contents.length === 0 || contents[0].role !== 'user') {
        contents.unshift({ role: 'user', parts: [{ text: 'Hello' }] });
      }

      const requestBody = {
        contents,
        generationConfig: { temperature: 0.75, maxOutputTokens: 800 }
      };

      // Use systemInstruction (proper Gemini API field).
      // Truncate to 6000 chars to avoid slow responses that cause Vercel timeout.
      if (systemMsg) {
        requestBody.systemInstruction = { parts: [{ text: systemMsg.slice(0, 6000) }] };
      }

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
      );

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return res.status(200).json({ choices: [{ message: { content: text } }] });
        }
        // No text — return the actual block/finish reason for debugging
        const reason = geminiData.candidates?.[0]?.finishReason
          || geminiData.promptFeedback?.blockReason
          || 'EMPTY_RESPONSE';
        console.warn('Gemini empty, reason:', reason, JSON.stringify(geminiData).slice(0, 300));
        return res.status(200).json({ choices: [], _geminiError: reason });
      } else {
        const errText = await geminiRes.text();
        console.warn(`Gemini HTTP ${geminiRes.status}:`, errText.slice(0, 300));
        return res.status(200).json({
          choices: [],
          _geminiError: `HTTP_${geminiRes.status}: ${errText.slice(0, 120)}`
        });
      }
    } catch (err) {
      console.warn('Gemini exception:', err.message);
      return res.status(200).json({ choices: [], _geminiError: `EXCEPTION: ${err.message}` });
    }
  }

  // Option 2: OpenRouter fallback (only if key is set)
  if (openrouterKey) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openrouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://halden-s-catering-service.vercel.app',
          'X-Title': "Halden's AI Planner"
        },
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      console.warn('OpenRouter exception:', err.message);
    }
  }

  return res.status(200).json({
    choices: [],
    _geminiError: geminiKey ? 'ALL_FAILED' : 'NO_API_KEY_CONFIGURED'
  });
}
