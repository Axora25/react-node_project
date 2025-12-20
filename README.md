# 🌾 AgriGrow - Agricultural Management Platform

A comprehensive full-stack agricultural platform designed to empower farmers with AI-powered pest management, smart crop recommendations, weather forecasts, and access to government subsidies. Built with modern web technologies and integrated with Google Gemini AI for intelligent agricultural assistance.

## ✨ Features

- 🤖 **AI-Powered Pest Management Chatbot** - Upload images of crop issues and get instant identification and treatment recommendations using Google Gemini AI
- 🌾 **Smart Crop Recommendations** - Data-driven crop suggestions based on soil type, climate, temperature, pH, rainfall, and nutrient levels
- 🌦️ **Weather Forecast** - Hyperlocal weather forecasts to help plan irrigation and harvest
- 💰 **Government Subsidies Tracker** - Browse and search agricultural subsidy programs
- 🚜 **Farm Technology Hub** - Access information about modern farming technologies and best practices
- 📝 **Community Blog Platform** - Share knowledge, read articles, and learn from fellow farmers
- 💬 **Support System** - Submit support requests and get help
- ⭐ **Feedback & Testimonials** - Share feedback and view community testimonials

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Bootstrap** - CSS framework for responsive design
- **React Router** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **node-fetch** - HTTP client for API calls

### AI Integration
- **Google Gemini API** - AI-powered chat and image analysis

## 📁 Project Structure

```
project/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── BlogForm.jsx
│   │   │   └── ...
│   │   ├── pages/              # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── CropRecommendation.jsx
│   │   │   ├── Weather.jsx
│   │   │   ├── PestManagement.jsx
│   │   │   ├── FarmTech.jsx
│   │   │   ├── Subsidies.jsx
│   │   │   └── ...
│   │   ├── assets/            # Images and static assets
│   │   ├── services/          # API service files
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── public/                # Static files
│   └── package.json
├── backend/                    # Node.js server
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/           # Route controllers
│   ├── models/                # Mongoose models
│   │   ├── User.js
│   │   ├── Crop.js
│   │   ├── Blog.js
│   │   ├── Feedback.js
│   │   └── ...
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── cropRoutes.js
│   │   ├── gemini.js
│   │   ├── blogRoutes.js
│   │   └── ...
│   ├── uploads/               # Uploaded files storage
│   ├── server.js              # Main server file
│   └── package.json
├── README.md
└── package.json               # Root package.json
```


## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Google Gemini API Key (for AI features)

### Installation

**Option 1: Install all dependencies at once (Recommended)**
```bash
npm run install:all
```

**Option 2: Install separately**
```bash
# Install root dependencies (includes concurrently)
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

**Set up environment variables:**
```bash
cd backend
cp env.example .env
```

Edit `.env` file with your configuration:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/agrigrow

# JWT Secret (change this in production)
JWT_SECRET=your-secret-key-change-in-production

# Google Gemini API Key (required for AI features)
GEMINI_API_KEY=your-gemini-api-key-here

# Server Port (optional, defaults to 5000)
PORT=5000
```

**Important:** 
- You need a MongoDB database running locally or use MongoDB Atlas
- Get your Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- The JWT_SECRET should be a strong random string in production

### Running the Application

**IMPORTANT: You need to run frontend and backend in SEPARATE terminals!**

#### Method 1: Separate Terminals (Recommended for Development)

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

#### Method 2: Single Command (Both Together)

From the root directory:
```bash
npm run dev
```
This runs both frontend and backend simultaneously using `concurrently`.

#### Method 3: Windows Batch Files (Windows Only)

Double-click these files in the root directory:
- `start-backend.bat` - Starts the backend server
- `start-frontend.bat` - Starts the frontend server
- `install-all.bat` - Installs all dependencies

Or run them from command prompt:
```cmd
start-backend.bat
start-frontend.bat
```

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

## Available Scripts

### Root Directory (Project Root)
- `npm run install:all` - Install all dependencies (root, frontend, backend)
- `npm run dev` - Run both frontend and backend together
- `npm run dev:frontend` - Run only frontend
- `npm run dev:backend` - Run only backend
- `npm run build` - Build frontend for production
- `npm run start:backend` - Start backend in production mode

### Frontend (`frontend/` directory)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (`backend/` directory)
- `npm start` - Start production server
- `npm run dev` - Start development server with watch mode

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Crops
- `GET /api/crops` - Get all crops
- `GET /api/crops/:id` - Get crop by ID
- `POST /api/crops` - Create new crop (admin)
- `POST /api/crops/search` - Search crops by criteria (soil, climate, season, etc.)
- `POST /api/crops/recommend` - Get crop recommendation based on soil parameters
- `PUT /api/crops/:id` - Update crop
- `DELETE /api/crops/:id` - Delete crop

### AI Chatbot (Gemini)
- `POST /api/gemini/chat` - Chat with AI assistant (supports text and image upload)
- `POST /api/gemini/spray-schedule` - Generate personalized spray schedule
- `POST /api/gemini/farm-tech` - Get farm technology recommendations

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog by ID
- `POST /api/blogs` - Create new blog (with image upload)

### Subsidies
- `GET /api/subsidy/categories` - Get subsidy categories
- `GET /api/subsidy/list` - Get subsidies (supports ?search= and ?category= query params)

### Support
- `POST /api/support/submit` - Submit support request

### Feedback
- `POST /api/feedback/submit` - Submit feedback
- `GET /api/feedback` - Get all feedbacks (for testimonials)

### Health Check
- `GET /api` - Test endpoint
- `GET /api/health` - Health check endpoint

## 🎯 Key Features Explained

### AI Pest Management Chatbot
- Upload images of crop issues for visual analysis
- Get instant pest/disease identification
- Receive treatment recommendations
- Generate personalized spray schedules based on chat history
- Powered by Google Gemini AI

### Crop Recommendation System
- Input soil parameters (N, P, K levels)
- Provide environmental data (temperature, humidity, pH, rainfall)
- Get data-driven crop recommendations
- Search crops by multiple criteria (soil type, climate, season)

### Weather Integration
- Hyperlocal weather forecasts
- Plan irrigation schedules
- Optimize harvest timing

### Blog Platform
- Create and publish agricultural blogs
- Upload images with blog posts
- Tag and categorize content
- Community knowledge sharing

## 📝 Notes

- **The frontend is configured to proxy API requests to the backend** - All `/api/*` requests from the frontend will be forwarded to `http://localhost:5000`
- **Tailwind CSS and Bootstrap can be used together** - You can use both utility classes in your components
- **Make sure both servers are running for full functionality** - The frontend needs the backend to be running to make API calls
- **Run in separate terminals** - For better debugging and log visibility, it's recommended to run frontend and backend in separate terminal windows
- **MongoDB is required** - Make sure MongoDB is installed and running, or configure MongoDB Atlas connection string
- **Google Gemini API Key is required** - For AI chatbot features to work, you need a valid Gemini API key
- The React app will automatically check backend connectivity on load

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory with:

```env
MONGODB_URI=mongodb://localhost:27017/agrigrow
JWT_SECRET=your-secret-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key-here
PORT=5000
```

## 🚀 Deployment

### Frontend Production Build
```bash
cd frontend
npm run build
```
The build output will be in `frontend/dist/`

### Backend Production
```bash
cd backend
npm start
```

## 📚 Additional Resources

- [MongoDB Setup Guide](./MONGODB_SETUP_GUIDE.md)
- [Quick Start Guide](./QUICK_START.md)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available for educational purposes.

