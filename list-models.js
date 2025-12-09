import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAC9TQedPbt8mTVvnqJXwzL6XCgH9ROACA");

async function listModels() {
  try {
    const result = await genAI.listModels();
    console.log("Available Models:");
    result.models.forEach(m => console.log(" -", m.name));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

listModels();
