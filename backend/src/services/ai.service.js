const { OpenAI } = require("openai");
const { pipeline } = require('@xenova/transformers');

// Groq client - chat responses ke liye (super fast & free tier)
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Local embedding model - 768 dimensions wala (lightweight aur powerful)
let extractor = null;

(async () => {
  console.log("🔄 Loading 768-dim embedding model: Xenova/gte-base");
  console.log("   Pehli baar download hoga (~500-600 MB), 1-3 minute lagega.");
  console.log("   RAM usage: ~1.5-2 GB (safe for most systems)");
  
  try {
    extractor = await pipeline('feature-extraction', 'Xenova/gte-base');
    console.log("✅ Embedding model (gte-base) successfully loaded!");
    console.log("   Vectors ab exactly 768 dimensions ke banenge. Pinecone index same rahega.");
  } catch (error) {
    console.error("❌ Model load nahi ho paya:", error.message);
    console.error("   Internet check karo ya server restart karo.");
  }
})();

async function generateResponse(contents) {
  // Tera original Aurora persona system prompt (short version - chahe toh pura lamba wala paste kar dena)
  const systemPrompt = `
    <persona>
      <name>GolemAW</name>
      <mission>Be a helpful, accurate AI assistant with a playful, upbeat vibe. Empower users to build, learn, and create fast.</mission>
      <voice>Friendly, concise, Gen-Z energy without slang overload. Use plain language. Add light emojis sparingly (max one per paragraph).</voice>
      <values>Honesty, clarity, practicality, user-first. Admit limits. Prefer actionable steps.</values>
    </persona>
    <behavior>
      <tone>Playful but professional. Supportive, never condescending.</tone>
      <formatting>Clear headings, short paragraphs, minimal lists. Keep answers tight.</formatting>
    </behavior>
    <identity>You are "GolemAW". Refer to yourself as "GolemAW" when needed.</identity>
  `;

  // Gemini format se Groq/OpenAI format mein convert
  const messages = [
    { role: "system", content: systemPrompt },
    ...contents.map(msg => ({
      role: msg.role === "model" ? "assistant" : msg.role,
      content: msg.parts[0].text,
    })),
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",    // Best quality + fast (free tier mein available)
      // model: "llama3-8b-8192",          // Agar aur faster chahiye
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Groq API error:", error.message);
    return "Sorry, response generate karne mein issue aaya. Thoda der baad try karo. 😅";
  }
}

async function generateVector(text) {
  if (!extractor) {
    throw new Error("Embedding model abhi load ho raha hai. Server restart karo aur wait karo.");
  }

  try {
    const output = await extractor(text, {
      pooling: 'mean',      // Sentence embedding ke liye best
      normalize: true,      // Cosine similarity ke liye better results
    });

    const embedding = Array.from(output.data); // Exactly 768 length ka array

    // Debug (optional - production mein hata sakte ho)
    // console.log("Generated vector length:", embedding.length); // 768 hona chahiye

    return embedding;
  } catch (error) {
    console.error("Vector generation error:", error.message);
    throw error;
  }
}

module.exports = {
  generateResponse,
  generateVector,
};