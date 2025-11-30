# Full-Stack Project

A modern full-stack application built with React, Tailwind CSS, Bootstrap, and Node.js.

## Project Structure

```
project/
├── frontend/          # React application
│   ├── src/          # Source files
│   ├── public/       # Static assets
│   └── package.json
├── backend/          # Node.js server
│   ├── server.js     # Main server file
│   └── package.json
└── README.md
```

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Bootstrap** - CSS framework for responsive design
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

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
Edit `.env` file with your configuration (optional, defaults work fine).

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

## API Endpoints

- `GET /api` - Test endpoint
- `GET /api/health` - Health check endpoint

## Notes

- **The frontend is configured to proxy API requests to the backend** - All `/api/*` requests from the frontend will be forwarded to `http://localhost:5000`
- **Tailwind CSS and Bootstrap can be used together** - You can use both utility classes in your components
- **Make sure both servers are running for full functionality** - The frontend needs the backend to be running to make API calls
- **Run in separate terminals** - For better debugging and log visibility, it's recommended to run frontend and backend in separate terminal windows
- The React app will automatically check backend connectivity on load

