const fetch = require("node-fetch");

const ideaCache = {};
const autoCache = {};

const fetchWithTimeout = async (url, options, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
};

exports.generateIdea = async (req, res) => {
  try {
    const { topic } = req.body;
    const key = topic || "general";

    if (ideaCache[key]) {
      return res.json({ idea: ideaCache[key] });
    }

    const response = await fetchWithTimeout(
      "https://openrouter.ai/api/v1/chat/completions",
      {
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
      }
    );

    const data = await response.json();

    if (!data || !data.choices || !data.choices[0]) {
      console.error("Bad AI response:", data);
      return res.status(500).json({ message: "Invalid AI response" });
    }

    const result = data.choices[0].message.content;

    ideaCache[key] = result;

    res.json({ idea: result });

  } catch (error) {
    console.error("AI ERROR:", error.message);
    res.status(500).json({ message: "AI failed" });
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

    const response = await fetchWithTimeout(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          max_tokens: 80,
          temperature: 0.6,
          messages: [
            {
              role: "user",
              content: `Continue this blog in a natural and concise way:\n${content.slice(-300)}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!data || !data.choices || !data.choices[0]) {
      console.error("Bad autocomplete response:", data);
      return res.status(500).json({ message: "Invalid AI response" });
    }

    const result = data.choices[0].message.content;

    autoCache[key] = result;

    res.json({ text: result });

  } catch (error) {
    console.error("Autocomplete ERROR:", error.message);
    res.status(500).json({ message: "Autocomplete failed" });
  }
};