const fetch = require("node-fetch");

const ideaCache = {};
const autoCache = {};

// timeout wrapper
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

// 🔥 GENERATE IDEA
exports.generateIdea = async (req, res) => {
  try {
    const { topic } = req.body;
    const key = topic || "general";

    // cache
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
          model: "mistralai/mistral-7b-instruct", // 🔥 FAST + STABLE
          max_tokens: 60,
          temperature: 0.7,
          messages: [
            {
              role: "user",
              content: `Give 3 very short blog titles (max 5 words) about: ${key}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // ✅ CRITICAL FIX
    if (!response.ok) {
      console.error("OpenRouter HTTP Error:", response.status);
      console.error("Response:", data);
      return res.status(500).json({ message: "AI API failed" });
    }

    // ✅ SAFE VALIDATION
    if (!data?.choices?.[0]?.message?.content) {
      console.error("Invalid AI structure:", data);
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

    const response = await fetchWithTimeout(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct", // 🔥 switched from llama → faster
          max_tokens: 50,
          temperature: 0.6,
          messages: [
            {
              role: "user",
              content: `Continue this blog naturally:\n${content.slice(-150)}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // ✅ CRITICAL FIX
    if (!response.ok) {
      console.error("OpenRouter HTTP Error:", response.status);
      console.error("Response:", data);
      return res.status(500).json({ message: "AI API failed" });
    }

    // ✅ SAFE VALIDATION
    if (!data?.choices?.[0]?.message?.content) {
      console.error("Invalid autocomplete structure:", data);
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