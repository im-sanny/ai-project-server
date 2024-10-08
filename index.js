const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

const { GoogleGenerativeAI } = require("@google/generative-ai");
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const form = `
<form method="POST" action="/prompt">
<textarea name="prompt" id="prompt"></textarea>
<button type="submit">Generate json</button>
</form>
`;

app.use(express.urlencoded({ extended: true }));

app.get("/prompt", async (req, res) => {
  res.send(form);
});

app.post("/prompt", async (req, res) => {
  let { prompt } = req.body;
  prompt = prompt + ". data will be in json stringify version. no extra text";
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const cleanJsonString = text.replace(/\\n/g, "").replace(/\\/g, "");
  res.send({ data: cleanJsonString, status: 200 });
});

app.get("/", (req, res) => {
  res.send({ data: "server running", status: 200 });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
