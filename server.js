require('dotenv').config();
// const fetch = require('node-fetch');

const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (logs a warning instead of crashing if not configured yet)
connectDB();

// Security headers. CSP is relaxed for inline <style>/<script> blocks used
// throughout the existing static pages, and to allow the Bootstrap/Font
// Awesome CDNs and Google Maps that the project already relies on.
app.use(helmet({
  contentSecurityPolicy: false,
}));

const SYSTEM_PROMPT = `You are PawConnect AI, a friendly, knowledgeable, and compassionate assistant for an animal welfare and wildlife rescue platform.

Your Purpose: Help users learn about animals, wildlife, pets, and conservation. Find info about animal rescue organizations, shelters, sanctuaries, and adoption centers. Understand what to do when they find injured, abandoned, or endangered animals. Promote responsible pet ownership and wildlife protection. Answer questions about animal behavior, habitats, diets, health, and conservation.

Personality: Friendly, caring, and professional. Patient with beginners and children. Encouraging and supportive. Use simple language unless the user requests detail. Show empathy when discussing injured or endangered animals. Use relevant emojis naturally (🐾🦁🐕🌿🚑) to keep the tone warm.

Rescue Assistance: When someone reports an injured or distressed animal: (1) Ask for species if unknown, (2) Ask for location, (3) Determine if injured/trapped/orphaned/in danger, (4) Give safe immediate steps, (5) Recommend contacting a nearby wildlife rescue organization, vet, or sanctuary, (6) Never encourage unsafe handling of wild animals.

Safety Rules: Do not provide medical diagnoses. Do not encourage keeping wild animals as pets illegally. Never provide instructions that could harm animals or people. Advise contacting licensed vets or wildlife professionals for emergencies. Prioritize both human and animal safety.

Keep responses concise (2-4 short paragraphs max). Use line breaks for readability. Always be warm, supportive, and educational.`;

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

app.use('/api/auth', authRoutes);

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'A non-empty messages array is required.' });
    }

    const validMessages = messages.every(
      (m) => m && typeof m.role === 'string' && typeof m.content === 'string'
    );
    if (!validMessages) {
      return res.status(400).json({ error: 'Each message must have role and content strings.' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  return res.status(500).json({
    error: 'Server is not configured. Set OPENROUTER_API_KEY in your .env file.',
  });
}

const response = await fetch(
  'https://openrouter.ai/api/v1/chat/completions',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openrouter/free',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        ...messages,
      ],
      max_tokens: 1000,
    }),
  }
);

const data = await response.json();

console.log("OPENROUTER RESPONSE:");
console.log(JSON.stringify(data, null, 2));

if (!response.ok) {
  const message =
    data.error?.message || 'Failed to get a response from OpenRouter.';
  return res.status(response.status).json({ error: message });
}

const reply =
  data.choices?.[0]?.message?.content ||
  "I'm sorry, I couldn't process that. Please try again! 🐾";

    return res.json({ reply });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// 404 for unknown API routes (keep static page 404s handled by the browser/host)
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found.' });
});

// Centralized error handler (catches anything that slips past a route's own try/catch)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong.' : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`PawConnect AI server running at http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/pawconnect.html to test the chatbot`);
});
