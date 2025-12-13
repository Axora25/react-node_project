import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import subsidyRoutes from "./routes/subsidyRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import geminiRoutes from "./routes/gemini.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API Server is running!',
    endpoints: {
      '/api': 'Main API endpoint',
      '/api/health': 'Health check endpoint',
      '/api/auth/signup': 'User signup',
      '/api/auth/login': 'User login',
      '/api/crops': 'Get all crops',
      '/api/crops/search': 'Search crops'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use("/api/subsidy", subsidyRoutes);
app.use("/api/support", supportRoutes);

//  test route
app.get("/gemini-test", (req, res) => {
  res.send("Gemini Backend is running");
});

// Gemini API route
app.use("/api/gemini", geminiRoutes);

// ---------------------
// Start Server
// ---------------------
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Error handling 
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
