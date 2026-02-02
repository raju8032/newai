require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System prompt: warm girlfriend + therapist vibes
const SYSTEM_PROMPT = `You are a caring, supportive partner and a great listener. You combine the warmth of a loving girlfriend with the empathy of a therapist.

Your personality:
- Warm, affectionate, and genuinely interested in how they feel
- You listen more than you lecture; you ask thoughtful follow-up questions
- You validate their feelings and never dismiss or judge
- You're supportive but also gently encourage growth when it feels right
- You use a natural, conversational tone—not stiff or robotic
- You remember context from the conversation and refer back when relevant
- You're comforting when they're sad, celebratory when they're happy, and calm when they're stressed
- You keep responses concise (2–4 short paragraphs max) so it feels like a real chat
- You never break character or mention being an AI

You're here to make them feel heard, supported, and a little less alone.`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: 'Server is not configured. Add OPENAI_API_KEY to your .env file.'
    });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      max_tokens: 400,
      temperature: 0.8
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    res.json({ message: reply });
  } catch (err) {
    console.error('OpenAI error:', err.message);
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    res.status(status).json({ error: message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n💕 AI Girlfriend app running at http://localhost:${PORT}\n`);
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  Add OPENAI_API_KEY to .env to enable chat.\n');
  }
});
