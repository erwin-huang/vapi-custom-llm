import express from "express";
import { streamResponse1, streamResponse2 } from "./streamingGPTText.js";

const app = express();

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const stream = await streamResponse1();
    stream.pipe(res);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/v2/chat/completions", async (req, res) => {
  try {
    const stream = await streamResponse2();
    stream.pipe(res);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});