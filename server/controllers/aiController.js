const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const ideaCache = {};
const autoCache = {};

exports.generateIdea = async (req, res) => {
  try {
    const { topic } = req.body;
    const key = topic || "general";

    if (ideaCache[key]) {
      return res.json({ idea: ideaCache[key] });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `You are a professional blog strategist.

Generate exactly 3 blog post ideas about: "${key}"

Rules:
- Each idea must be 1 short, catchy title (max 6 words)
- Do NOT include numbering
- Do NOT include explanations
- Each idea on a new line
- Make them engaging and modern

Output format:
Title 1
Title 2
Title 3`,
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
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `You are a skilled blog writer.

Continue the following blog in a natural, engaging tone.

Rules:
- Write 2–3 short sentences only
- Keep it clear and readable
- Match the tone of the existing content
- Do NOT repeat existing text
- Do NOT add headings or explanations

Blog:
${content.slice(-200)}`,
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