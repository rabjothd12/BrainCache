const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const ideaCache = {};
const autoCache = {};

// 🔥 GENERATE IDEA
exports.generateIdea = async (req, res) => {
  try {
    const { topic } = req.body;
    const key = topic || "general";

    if (ideaCache[key]) {
      return res.json({ idea: ideaCache[key] });
    }

    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192", // ⚡ fast + reliable
      messages: [
        {
          role: "user",
          content: `Give 3 very short blog titles (max 5 words) about: ${key}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 60,
    });

    const result = response.choices[0]?.message?.content;

    if (!result) {
      return res.json({
        idea: "No ideas generated, try again.",
      });
    }

    ideaCache[key] = result;

    res.json({ idea: result });

  } catch (error) {
    console.error("Groq ERROR:", error);

    return res.json({
      idea: "AI temporarily unavailable, try again.",
    });
  }
};


// 🔥 AUTOCOMPLETE
exports.autoComplete = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.length < 10) {
      return res.json({ text: "" });
    }

    const key = content.slice(-100);

    if (autoCache[key]) {
      return res.json({ text: autoCache[key] });
    }

    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "user",
          content: `Continue this blog naturally:\n${content.slice(-150)}`,
        },
      ],
      temperature: 0.6,
      max_tokens: 80,
    });

    const result = response.choices[0]?.message?.content;

    if (!result) {
      return res.json({ text: "" });
    }

    autoCache[key] = result;

    res.json({ text: result });

  } catch (error) {
    console.error("Groq Autocomplete ERROR:", error.message);

    return res.json({ text: "" });
  }
};