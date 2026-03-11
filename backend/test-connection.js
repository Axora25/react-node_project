import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const testConnection = async () => {
  try {
    console.log('Connecting to:', process.env.MONGODB_URI.split('@')[1]); // Log host only for safety
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Success: Connected to MongoDB Atlas!');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error: Could not connect to MongoDB Atlas');
    console.error(error.message);
    process.exit(1);
  }
};

testConnection();
