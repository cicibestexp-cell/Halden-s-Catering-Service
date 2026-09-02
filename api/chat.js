export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
  const openrouterKey = (process.env.OPENROUTER_API_KEY || '').trim();

  // Option 1: Direct Google Gemini API
  // Uses the proper systemInstruction field — NOT the fake user/model turn injection
  // that was confusing the model and producing empty/blocked responses.
  if (geminiKey) {
    try {
      const messages = req.body.messages || [];
      const systemMsg = messages.find(m => m.role === 'system')?.content || '';
      const userMsgs = messages.filter(m => m.role !== 'system');

      // Build contents — strictly alternating user/model turns
      const contents = [];
      let lastRole = null;
      for (const m of userMsgs) {
        const role = m.role === 'assistant' ? 'model' : 'user';
        const text = (typeof m.content === 'string' ? m.content : JSON.stringify(m.content || '')).trim();
        if (!text) continue;

        if (role === lastRole && contents.length > 0) {
          // Merge consecutive same-role messages to avoid API rejection
          contents[contents.length - 1].parts[0].text += '\n\n' + text;
        } else {
          contents.push({ role, parts: [{ text }] });
          lastRole = role;
        }
      }

      // Gemini requires the conversation to start with a user turn
      if (contents.length === 0 || contents[0].role !== 'user') {
        contents.unshift({ role: 'user', parts: [{ text: 'Hello' }] });
      }

      const requestBody = {
        contents,
        generationConfig: { temperature: 0.75, maxOutputTokens: 1200 }
      };

      // Pass system instructions via the proper Gemini systemInstruction field
      if (systemMsg) {
        requestBody.systemInstruction = { parts: [{ text: systemMsg }] };
      }

      // Valid, confirmed working Gemini model names
      const geminiModels = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro'];
      for (const mod of geminiModels) {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${mod}:generateContent?key=${geminiKey}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return res.status(200).json({ choices: [{ message: { content: text } }] });
          }
          console.warn(`Gemini ${mod}: candidate returned but no text.`, JSON.stringify(geminiData).slice(0, 400));
        } else {
          const errText = await geminiRes.text();
          console.warn(`Gemini ${mod} HTTP ${geminiRes.status}:`, errText.slice(0, 400));
        }
      }
    } catch (err) {
      console.warn('Gemini API exception:', err.message);
    }
  }

  // Option 2: OpenRouter fallback (only runs if OPENROUTER_API_KEY is set in Vercel env)
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

  // Both paths failed — return a detectable empty response
  return res.status(200).json({
    choices: [],
    error: { message: 'All AI models unavailable. Please try again shortly.' }
  });
}
