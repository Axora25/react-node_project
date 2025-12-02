# MongoDB Setup Guide for AgriGrow Project

## Step 1: Install MongoDB

### Option A: MongoDB Local Installation (Recommended for Development)

1. **Download MongoDB Community Server:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select your OS (Windows/Mac/Linux)
   - Download and install

2. **Start MongoDB:**
   - **Windows:** MongoDB should start automatically as a service
   - **Mac/Linux:** Run `mongod` in terminal

### Option B: MongoDB Atlas (Cloud - Free Tier Available)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Add it to your `.env` file

## Step 2: MongoDB Compass (Like phpMyAdmin for MySQL)

**MongoDB Compass** is the GUI tool for MongoDB (similar to phpMyAdmin):

1. **Download MongoDB Compass:**
   - Go to: https://www.mongodb.com/try/download/compass
   - Download and install

2. **Connect to your database:**
   - For local: `mongodb://localhost:27017`
   - For Atlas: Use your connection string from Atlas

3. **What you can do in Compass:**
   - View all databases and collections
   - Add/edit/delete documents (like rows in MySQL)
   - Run queries
   - Import/Export data
   - View database statistics

## Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- `mongoose` - MongoDB driver for Node.js
- `bcryptjs` - For hashing passwords
- `jsonwebtoken` - For authentication tokens

## Step 4: Configure Environment Variables

1. Copy the example env file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` file:
   - For local MongoDB: `MONGODB_URI=mongodb://localhost:27017/agrigrow`
   - For Atlas: Use your connection string from MongoDB Atlas

## Step 5: Start Your Backend Server

```bash
cd backend
npm run dev
```

You should see: `MongoDB Connected: ...`

## Step 6: Test Your Setup

### Test Signup:
```bash
POST http://localhost:5000/api/auth/signup
Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Test Login:
```bash
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Add a Crop (Example):
```bash
POST http://localhost:5000/api/crops
Body (JSON):
{
  "name": "Rice",
  "description": "Staple food crop",
  "soilType": ["clay", "loamy"],
  "climate": ["tropical", "subtropical"],
  "season": ["monsoon", "summer"],
  "waterRequirement": "high",
  "temperatureRange": {
    "min": 20,
    "max": 35
  },
  "phRange": {
    "min": 5.5,
    "max": 7.0
  },
  "yield": "4-6 tons per hectare"
}
```

## Database Structure

### Collections (Like Tables in MySQL):

1. **users** - Stores user accounts
   - name, email, password (hashed), role

2. **crops** - Stores crop information
   - name, description, soilType, climate, season, etc.

## Next Steps

1. Create Login page in frontend
2. Create Crop Recommendation page
3. Connect frontend to backend APIs
4. Add authentication protection to routes

## Common Commands

- View databases in MongoDB: Open MongoDB Compass
- Check if MongoDB is running: `mongosh` (MongoDB shell)
- List databases: `show dbs`
- Use database: `use agrigrow`
- Show collections: `show collections`

