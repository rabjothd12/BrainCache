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
exports.autoComplete = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.length < 10) {
      return res.json({ text: "" }); // avoid useless calls
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct", // better for writing
        max_tokens: 80,
        temperature: 0.6,
        messages: [
          {
            role: "user",
            content: `Continue this blog in a natural and concise way:\n${content.slice(-300)}`,
          },
        ],
      }),
    });

    const data = await response.json();

    res.json({
      text: data.choices[0].message.content,
    });

  } catch (error) {
    console.error("Autocomplete ERROR:", error);
    res.status(500).json({ message: "Autocomplete failed" });
  }
};