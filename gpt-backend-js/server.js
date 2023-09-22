const express = require("express");
const cors = require("cors");
const { OpenAIApi } = require("openai");

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = "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";

const openai = new OpenAIApi({
  apiKey: OPENAI_API_KEY,
});

const chatWithGPT3 = async (userInput) => {
  const messages = [{ role: "user", content: userInput }];

  const response = await openai.createCompletion({
    engine: "text-davinci-002", // GPT-3.5 Turbo equivalent engine
    messages,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const assistantResponse = response.choices[0].message.content;
  return assistantResponse;
};

app.post("/ask", async (req, res) => {
  const user_input = req.body.user_input || "";

  if (user_input.toLowerCase() === "exit") {
    return res.json({ assistant_response: "Goodbye!" });
  }

  const assistantResponse = await chatWithGPT3(user_input);
  return res.json({ assistant_response: assistantResponse });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
