require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so the static frontend can call this backend
app.use(cors());
app.use(express.json());

// Initialize Gemini API Client
const apiKey = process.env.GEMINI_API_KEY;
let genAI;

if (apiKey && apiKey !== "your_api_key_here") {
  genAI = new GoogleGenerativeAI(apiKey);
  console.log("Gemini API Client initialized successfully.");
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in .env. API calls will fail until it is provided.");
}

// Helper to safely clean markdown wrapping from JSON responses
function cleanJsonText(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```json\s*/i, "");
    cleaned = cleaned.replace(/```$/, "");
    cleaned = cleaned.trim();
  }
  return cleaned;
}

// 1. Endpoint: POST /api/generate-futureme
app.post("/api/generate-futureme", async (req, res) => {
  const { name, age, goal, struggle, oneYearVision, tone } = req.body;

  // Simple validation
  if (!name || !age || !goal || !struggle || !oneYearVision || !tone) {
    return res.status(400).json({
      success: false,
      error: "Missing required profile parameters. Make sure all form fields are filled."
    });
  }

  if (!genAI) {
    return res.status(500).json({
      success: false,
      error: "Gemini API key is not configured in backend/.env. Please add it to start the reflection."
    });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const systemPrompt = `You are FutureMe, the future successful version of the user. You are not a generic motivational coach. You speak with emotional intelligence, clarity, and deep personal understanding. Your job is to help the user see who they are becoming, what they must change, and what they should do next.

Write as if you are the user’s future self speaking directly to their current self.

Tone selected by user: ${tone}
(Note:
- If tone is "Motivational": speak in a warm, inspiring, and supportive way.
- If tone is "Brutally Honest": speak in a direct, sharp, and no-excuses manner.
- If tone is "Calm Mentor": speak in a peaceful, wise, and grounded tone.
- If tone is "CEO Mode": speak in a strategic, focused, and execution-heavy business mindset.)

User details:
Name: ${name}
Age: ${age}
Goal: ${goal}
Current struggle: ${struggle}
One-year vision: ${oneYearVision}

Return only valid JSON in this exact format:
{
  "message": "A powerful 120-180 word message from the future self.",
  "futureIdentity": "A concise description of who the user is becoming.",
  "nextMoves": ["Action 1", "Action 2", "Action 3"],
  "habit": "One small daily habit they should start today.",
  "warning": "One mistake their future self warns them about.",
  "mantra": "A short memorable line they can repeat daily."
}

Make it highly specific to their details. Avoid generic motivation. Avoid clichés. Make it emotional but practical.`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();
    
    // Clean and Parse JSON response
    const cleanedText = cleanJsonText(responseText);
    const parsedData = JSON.parse(cleanedText);

    res.json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({
      success: false,
      error: "FutureMe could not respond right now. Try again."
    });
  }
});

// 2. Endpoint: POST /api/chat-futureme
app.post("/api/chat-futureme", async (req, res) => {
  const { userProfile, chatHistory, question } = req.body;

  if (!userProfile || !question) {
    return res.status(400).json({
      success: false,
      error: "Missing required chat parameters (userProfile or question)."
    });
  }

  if (!genAI) {
    return res.status(500).json({
      success: false,
      error: "Gemini API key is not configured in backend/.env. Please add it to start the reflection."
    });
  }

  const { name, age, goal, struggle, oneYearVision, tone } = userProfile;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    // Format chat history for prompt context
    const historyText = (chatHistory || [])
      .map(chat => {
        const sender = chat.role === "user" ? "Current Self" : "Future Me";
        return `${sender}: ${chat.message}`;
      })
      .join("\n");

    const chatPrompt = `You are FutureMe, the future version of the user who already achieved their one-year vision. Reply directly to the user’s question. Be personal, sharp, honest, and useful. Do not sound like a normal AI assistant. Do not mention that you are Gemini, an AI model, or a language assistant. Speak as the actual future self.

User profile:
Name: ${name}
Age: ${age}
Goal: ${goal}
Struggle: ${struggle}
One-year vision: ${oneYearVision}
Tone: ${tone}
(Note: Maintain the tone style consistently:
- Motivational: warm, inspiring, supportive
- Brutally Honest: direct, sharp, no excuses
- Calm Mentor: peaceful, wise, grounded
- CEO Mode: strategic, focused, execution-heavy)

Recent chat history:
${historyText || "No previous messages yet."}

Current question:
${question}

Reply in 2-5 short paragraphs. Give at least one clear action.`;

    const result = await model.generateContent(chatPrompt);
    const replyText = result.response.text().trim();

    res.json({
      success: true,
      reply: replyText
    });
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({
      success: false,
      error: "FutureMe could not respond right now. Try again."
    });
  }
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Catch-all route to serve index.html for any unmatched routes (such as /goal)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`FutureMe backend listening at http://localhost:${PORT}`);
});
