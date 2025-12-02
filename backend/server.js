import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import cropRoutes from './routes/cropRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

