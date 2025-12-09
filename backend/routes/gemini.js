import express from "express";
import fetch from "node-fetch";
import multer from "multer";

const router = express.Router();
const upload = multer(); // memory storage for small uploads

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

// Accept either JSON body or multipart/form-data (with optional file)
router.post("/chat", upload.single('file'), async (req, res) => {
  try {
    // message may come from JSON body or from form-data text fields
    const message = req.body?.message || '';
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) return res.status(500).json({ error: "Missing API KEY" });

    // If a file is uploaded, we currently do not perform image analysis here.
    // For now we accept the upload and continue using the supplied message text.
    if (req.file) {
      console.log('Received file:', req.file.originalname, 'size:', req.file.size);
      // TODO: integrate an image analysis pipeline or forward the image to a vision API
    }

    const prompt = `You are an agricultural expert. Respond to: ${message}`;

    const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    // If Gemini returns non-2xx, capture the body for debugging
    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unable to read error body');
      console.error('Gemini API returned error', response.status, errText);
      return res.status(response.status).json({ error: `Gemini API error: ${response.status} ${errText}` });
    }

    const data = await response.json();

    return res.json({
      response: data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
    });
  } catch (err) {
    console.error('Gemini route error:', err);
    res.status(500).json({ error: err.message });
  }
});

  // Spray schedule route: accepts JSON with 'chatHistory' and optional 'prompt'
  router.post('/spray-schedule', async (req, res) => {
    try {
      const { chatHistory = '', prompt: customPrompt } = req.body || {};
      const API_KEY = process.env.GEMINI_API_KEY;
      if (!API_KEY) return res.status(500).json({ error: 'Missing API KEY' });

      const promptText = customPrompt || `You are an agricultural expert creating a spray schedule. Based on this conversation: "${chatHistory || 'No specific crop or pest mentioned yet.'}", please create a detailed, practical spray schedule for the farmer.`;

      const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => 'Unable to read error body');
        console.error('Gemini API returned error (spray-schedule)', response.status, errText);
        return res.status(response.status).json({ error: `Gemini API error: ${response.status} ${errText}` });
      }

      const data = await response.json();
      return res.json({ response: data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response' });
    } catch (err) {
      console.error('Spray schedule error:', err);
      res.status(500).json({ error: err.message });
    }
  });

export default router;
