# Quick Start Guide - MongoDB Setup

## 🚀 Step-by-Step Instructions

### 1. Install MongoDB

**Option A: Local MongoDB (Recommended for Learning)**
- Download: https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Connection string: `mongodb://localhost:27017/agrigrow`

**Option B: MongoDB Atlas (Cloud - Free)**
- Sign up: https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string from Atlas dashboard

### 2. Install MongoDB Compass (GUI Tool - Like phpMyAdmin)

- Download: https://www.mongodb.com/try/download/compass
- Connect using: `mongodb://localhost:27017` (local) or your Atlas connection string
- This is your database management tool!

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- `mongoose` - MongoDB driver
- `bcryptjs` - Password hashing
- `jsonwebtoken` - Authentication

### 4. Configure Environment

```bash
cd backend
# Create .env file
```

Add to `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agrigrow
JWT_SECRET=your-secret-key-here
```

### 5. Start Backend Server

```bash
cd backend
npm run dev
```

You should see: `MongoDB Connected: ...`

### 6. Start Frontend

```bash
cd frontend
npm run dev
```

### 7. Test Your Setup

1. **Sign Up:**
   - Go to: http://localhost:3000/login
   - Click "Sign Up"
   - Create an account

2. **Login:**
   - Use your credentials to login

3. **Add Crop Data:**
   - Use MongoDB Compass or API to add crops
   - Example API call:
   ```bash
   POST http://localhost:5000/api/crops
   ```

4. **Search Crops:**
   - Go to: http://localhost:3000/crop-recommendation
   - Enter search criteria
   - Get recommendations!

## 📁 Project Structure

```
project/
├── backend/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── models/
│   │   ├── User.js           # User model (login/signup)
│   │   └── Crop.js           # Crop model (recommendations)
│   ├── routes/
│   │   ├── authRoutes.js     # Login/Signup APIs
│   │   └── cropRoutes.js     # Crop APIs
│   └── server.js             # Main server file
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx              # Login page
    │   │   └── CropRecommendation.jsx # Crop search page
    │   └── components/
    │       └── Navbar.jsx             # Navigation
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Crops
- `GET /api/crops` - Get all crops
- `POST /api/crops` - Add new crop (admin)
- `POST /api/crops/search` - Search crops
- `GET /api/crops/:id` - Get crop by ID

## 📝 Adding Crop Data

### Method 1: Using MongoDB Compass
1. Open MongoDB Compass
2. Connect to your database
3. Select `agrigrow` database
4. Click on `crops` collection
5. Click "Add Data" → "Insert Document"
6. Add JSON data

### Method 2: Using API
```bash
POST http://localhost:5000/api/crops
Content-Type: application/json

{
  "name": "Rice",
  "description": "Staple food crop",
  "soilType": ["clay", "loamy"],
  "climate": ["tropical", "subtropical"],
  "season": ["monsoon", "summer"],
  "waterRequirement": "high",
  "temperatureRange": { "min": 20, "max": 35 },
  "phRange": { "min": 5.5, "max": 7.0 },
  "yield": "4-6 tons per hectare"
}
```

## 🎯 Next Steps

1. ✅ MongoDB installed and connected
2. ✅ User authentication working
3. ✅ Crop recommendation search working
4. 🔄 Add more crop data
5. 🔄 Add admin panel for managing crops
6. 🔄 Add more features (weather, pest management, etc.)

## 💡 Tips

- **MongoDB Compass** = phpMyAdmin for MongoDB
- **Collections** = Tables in MySQL
- **Documents** = Rows in MySQL
- Use MongoDB Compass to view/edit data easily
- All passwords are automatically hashed (secure!)

## 🆘 Troubleshooting

**MongoDB not connecting?**
- Check if MongoDB service is running
- Verify connection string in `.env`
- Check MongoDB Compass can connect

**API not working?**
- Make sure backend is running on port 5000
- Check MongoDB connection in backend logs
- Verify `.env` file exists

**Frontend not connecting to backend?**
- Check CORS is enabled (already done)
- Verify backend URL in frontend code
- Check browser console for errors



