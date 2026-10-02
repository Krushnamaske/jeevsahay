require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

const PORT = process.env.PORT || 3000;

// ==========================================
// DATABASE
// ==========================================

connectDB();

// ==========================================
// SECURITY
// ==========================================

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  express.json({
    limit: '1mb',
  })
);

// ==========================================
// STATIC WEBSITE FILES
// ==========================================

app.use(express.static(path.join(__dirname)));

// Make homepage.html the main website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'homepage.html'));
});

// ==========================================
// AUTH ROUTES
// ==========================================

app.use('/api/auth', authRoutes);

// ==========================================
// PAWCONNECT AI SYSTEM PROMPT
// ==========================================

const SYSTEM_PROMPT = `
You are PawConnect AI, a friendly, knowledgeable, and compassionate assistant
for an animal welfare and wildlife rescue platform.

Your Purpose:
Help users learn about animals, wildlife, pets, and conservation.
Find information about animal rescue organizations, shelters, sanctuaries,
and adoption centers.

Understand what to do when users find injured, abandoned, or endangered animals.

Promote responsible pet ownership and wildlife protection.

Answer questions about:
- Animal behavior
- Habitats
- Diets
- General animal health information
- Conservation
- Rescue
- Adoption
- Wildlife protection

Personality:
Friendly, caring, and professional.
Patient with beginners and children.
Encouraging and supportive.
Use simple language unless the user requests more detail.
Show empathy when discussing injured or endangered animals.
Use relevant emojis naturally such as 🐾 🦁 🐕 🌿 🚑.

Rescue Assistance:
When someone reports an injured or distressed animal:

1. Ask for the species if unknown.
2. Ask for the location.
3. Determine whether the animal is injured, trapped, orphaned, or in danger.
4. Give safe immediate steps.
5. Recommend contacting a nearby wildlife rescue organization,
   veterinarian, animal shelter, or sanctuary.
6. Never encourage unsafe handling of wild animals.

Safety Rules:
Do not provide medical diagnoses.
Do not encourage keeping wild animals illegally as pets.
Never provide instructions that could harm animals or people.
Advise contacting licensed veterinarians or wildlife professionals for emergencies.
Prioritize both human and animal safety.

Keep responses concise:
2-4 short paragraphs maximum.

Use line breaks for readability.
Always be warm, supportive, and educational.
`;

// ==========================================
// PAWCONNECT AI CHAT
// ==========================================

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (
      !messages ||
      !Array.isArray(messages) ||
      messages.length === 0
    ) {
      return res.status(400).json({
        error: 'A non-empty messages array is required.',
      });
    }

    const validMessages = messages.every(
      (message) =>
        message &&
        typeof message.role === 'string' &&
        typeof message.content === 'string'
    );

    if (!validMessages) {
      return res.status(400).json({
        error: 'Each message must have role and content strings.',
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error('❌ OPENROUTER_API_KEY is missing.');

      return res.status(500).json({
        error: 'OpenRouter API key is not configured.',
      });
    }

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',

          'HTTP-Referer':
            process.env.SITE_URL ||
            'https://jeevsahay-zzr0.onrender.com',

          'X-Title': 'JeevSahay - PawConnect AI',
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

    console.log('OPENROUTER RESPONSE:');
    console.log(JSON.stringify(data, null, 2));

    if (!response.ok) {
      const message =
        data?.error?.message ||
        'Failed to get a response from OpenRouter.';

      console.error('❌ OpenRouter Error:', message);

      return res.status(response.status).json({
        error: message,
      });
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      "I'm sorry, I couldn't process that. Please try again! 🐾";

    return res.json({
      reply,
    });

  } catch (err) {
    console.error('❌ Chat endpoint error:', err);

    return res.status(500).json({
      error: 'Internal server error. Please try again later.',
    });
  }
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'JeevSahay server is running',
  });
});

// ==========================================
// API 404
// ==========================================

app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found.',
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong.'
        : err.message,
  });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `🐾 PawConnect AI server running on port ${PORT}`
  );

  console.log(
    `🌐 JeevSahay server started successfully`
  );
});