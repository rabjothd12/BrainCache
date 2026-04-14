const fetch = require("node-fetch");

// 🔥 GENERATE IDEAS
exports.generateIdea = async (req, res) => {
  try {
    const { topic } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "user",
            content: `Give 3 creative blog ideas with short engaging intros about: ${topic || "general blogging"}`,
          },
        ],
      }),
    });

    const data = await response.json();

    res.json({
      idea: data.choices[0].message.content,
    });

  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ message: "AI failed" });
  }
};

// 🔥 AUTOCOMPLETE
exports.autoComplete = async (req, res) => {
  try {
    const { content } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "user",
            content: `Continue this blog naturally:\n${content}`,
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