const fetch = require("node-fetch");

const cache = {};

exports.generateIdea = async (req, res) => {
  try {
    const { topic } = req.body;
    const key = topic || "general";

    if (cache[key]) {
      return res.json({ idea: cache[key] });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        max_tokens: 100,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: `Give exactly 3 short blog ideas (1 line each, no explanation) about: ${key}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const result = data.choices[0].message.content;

    cache[key] = result;

    res.json({ idea: result });

  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ message: "AI failed" });
  }
};