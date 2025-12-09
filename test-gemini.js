import { GoogleGenerativeAI } from "@google/generative-ai";

// Read API key from environment variable to avoid committing secrets.
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Missing GEMINI_API_KEY in environment. Set it before running this script.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function testKey() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent("Hello! Just checking if the API key works.");
    console.log("✅ API key is working!");
    // some libs return async text, handle gracefully
    try {
      console.log("Response:", await result.response.text());
    } catch (e) {
      console.log("Response object:", result.response);
    }
  } catch (err) {
    console.log("❌ API key test failed.");
    console.error(err?.message || err);
  }
}

testKey();
