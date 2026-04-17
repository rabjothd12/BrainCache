const fetch = require("node-fetch");

const ideaCache = {};
const autoCache = {};

// 🔥 FIXED TIMEOUT (30s)
const fetchWithTimeout = async (url, options, timeoutMs = 30000) => {
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
          model: "openchat/openchat-7b", // 🔥 faster model
          max_tokens: 50,
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

    // ✅ HANDLE API FAILURE (NO 500)
    if (!response.ok) {
      console.error("OpenRouter Error:", data);
      return res.json({
        idea: "AI is busy right now, try again."
      });
    }

    // ✅ SAFE VALIDATION
    if (!data?.choices?.[0]?.message?.content) {
      console.error("Invalid AI structure:", data);
      return res.json({
        idea: "No ideas generated, try again."
      });
    }

    const result = data.choices[0].message.content;

    ideaCache[key] = result;

    res.json({ idea: result });

  } catch (error) {
    console.error("AI ERROR:", error.message);

    return res.json({
      idea: "Temporary AI issue, please retry."
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

    const response = await fetchWithTimeout(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openchat/openchat-7b", // 🔥 faster model
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

    // ✅ HANDLE API FAILURE
    if (!response.ok) {
      console.error("Autocomplete Error:", data);
      return res.json({
        text: ""
      });
    }

    // ✅ SAFE VALIDATION
    if (!data?.choices?.[0]?.message?.content) {
      console.error("Invalid autocomplete structure:", data);
      return res.json({
        text: ""
      });
    }

    const result = data.choices[0].message.content;

    autoCache[key] = result;

    res.json({ text: result });

  } catch (error) {
    console.error("Autocomplete ERROR:", error.message);

    return res.json({
      text: ""
    });
  }
};