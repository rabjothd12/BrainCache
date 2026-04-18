const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const ideaCache = {};
const autoCache = {};

exports.generateIdea = async (req, res) => {
  try {
    const { topic } = req.body;

    const key =
      topic && topic.trim() !== ""
        ? topic
        : "latest trends in technology, geopolitics, sports, and business";

    if (ideaCache[key]) {
      return res.json({ idea: ideaCache[key] });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `You are a professional content strategist.

Generate exactly 3 blog post ideas about: "${key}"

STRICT CONTEXT:
- Topics must be from real-world domains like Technology, Geopolitics, Sports, Business, or Current Affairs
- Do NOT generate topics about blogging, writing, or content creation

Rules:
- Each idea must be a short, specific title (max 7 words)
- Make them relevant to current trends
- Avoid generic phrases like "future of blogging"
- No numbering
- Each idea on a new line

Output format:
Title 1
Title 2
Title 3`,
        },
      ],
      temperature: 0.7,
      max_tokens: 60,
    });

    let result = response.choices[0]?.message?.content;

    if (!result) {
      return res.json({
        idea: "No ideas generated, try again.",
      });
    }

    const banned = ["blogging", "content writing", "how to write"];

    const isBad = banned.some((word) =>
      result.toLowerCase().includes(word)
    );

    if (isBad) {
      return res.json({
        idea: "Try a more specific topic like technology or sports.",
      });
    }

    result = result
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 3)
      .join("\n");

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
    const { content, title } = req.body;

    let baseText = "";

    if (content && content.length >= 10) {
        baseText = content;
    } else if (title && title.length >= 3) {
      baseText = `Write a blog about: ${title}`;
    } else {
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

Write or continue a blog based on the input.

Rules:
- If it's a title, start a blog introduction
- If it's content, continue naturally
- Write 2–4 short sentences
- Make it engaging and clear
- No headings, no repetition

Input:
${baseText.slice(-200)}`,
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