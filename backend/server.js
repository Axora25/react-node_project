import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import geminiRoutes from "./routes/gemini.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());              // allows React to connect
app.use(express.json());      // allows JSON POST body

// Mount routes
app.use("/api/gemini", geminiRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Start server using PORT from environment when available
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Another process is listening on this port.`);
    console.error('Use a different PORT in .env or stop the process using this port.');
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
