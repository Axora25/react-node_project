import express from 'express';
import Crop from '../models/Crop.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all crops
router.get('/', async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get crop by ID
router.get('/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new crop (for admin to upload data)
router.post('/', async (req, res) => {
  try {
    const crop = await Crop.create(req.body);
    res.status(201).json({
      message: 'Crop added successfully',
      crop
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Recommend crop based on numerical values (distance-based algorithm)
router.post('/recommend', async (req, res) => {
  try {
    const { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall } = req.body;
    
    // First, try to find crops stored in the data array structure (from MongoDB import)
    let crops = [];
    
    // Get the database connection and query the collection directly (bypass schema)
    const db = mongoose.connection.db;
    const cropsCollection = db.collection('crops');
    
    // Check for document with type "table" and name "crop_data" (MongoDB import structure)
    const dataDocument = await cropsCollection.findOne({ type: 'table', name: 'crop_data' });
    
    if (dataDocument && dataDocument.data && Array.isArray(dataDocument.data)) {
      // Extract crops from the data array
      crops = dataDocument.data;
      console.log(`Found ${crops.length} crops in data array`);
    } else {
      // Fallback: try to find individual crop documents (not table type)
      const individualCrops = await cropsCollection.find({ 
        $or: [
          { type: { $ne: 'table' } },
          { type: { $exists: false } }
        ]
      }).toArray();
      crops = individualCrops;
      console.log(`Found ${crops.length} individual crop documents`);
    }
    
    if (crops.length === 0) {
      return res.json({ crop: 'No crop found', error: 'No crops available in database' });
    }

    const input = {
      nitrogen: parseFloat(nitrogen) || 0,
      phosphorus: parseFloat(phosphorus) || 0,
      potassium: parseFloat(potassium) || 0,
      temperature: parseFloat(temperature) || 0,
      humidity: parseFloat(humidity) || 0,
      ph: parseFloat(ph) || 0,
      rainfall: parseFloat(rainfall) || 0
    };

    let minDiff = Number.MAX_SAFE_INTEGER;
    let closestCrop = null;
    let fieldCount = 0; // Track how many fields we're comparing

    // Calculate distance for each crop
    for (const crop of crops) {
      let diff = 0;
      let fieldsCompared = 0;
      
      // Get crop name - handle different field names (label, crop, name, etc.)
      const cropName = crop.label || crop.crop || crop.name || crop.crop_name || 'Unknown Crop';
      
      // Calculate difference for each field
      // Handle different possible field names from the data array
      const cropNitrogen = crop.N || crop.nitrogen || crop.Nitrogen;
      const cropPhosphorus = crop.P || crop.phosphorus || crop.Phosphorus;
      const cropPotassium = crop.K || crop.potassium || crop.Potassium;
      const cropTemp = crop.temperature || crop.Temperature || crop.temp;
      const cropHumidity = crop.humidity || crop.Humidity;
      const cropPh = crop.ph || crop.pH || crop.PH;
      const cropRainfall = crop.rainfall || crop.Rainfall || crop.rainfall_mm;
      
      // Check for null/undefined and use proper values
      if (cropNitrogen != null && !isNaN(cropNitrogen)) {
        diff += Math.abs(input.nitrogen - cropNitrogen);
        fieldsCompared++;
      }
      
      if (cropPhosphorus != null && !isNaN(cropPhosphorus)) {
        diff += Math.abs(input.phosphorus - cropPhosphorus);
        fieldsCompared++;
      }
      
      if (cropPotassium != null && !isNaN(cropPotassium)) {
        diff += Math.abs(input.potassium - cropPotassium);
        fieldsCompared++;
      }
      
      // Use temperature - check for temperatureRange first, then direct temperature
      if (crop.temperatureRange && crop.temperatureRange.min != null && crop.temperatureRange.max != null) {
        const avgTemp = (crop.temperatureRange.min + crop.temperatureRange.max) / 2;
        diff += Math.abs(input.temperature - avgTemp);
        fieldsCompared++;
      } else if (cropTemp != null && !isNaN(cropTemp)) {
        diff += Math.abs(input.temperature - cropTemp);
        fieldsCompared++;
      }
      
      // Use humidity if available
      if (cropHumidity != null && !isNaN(cropHumidity)) {
        diff += Math.abs(input.humidity - cropHumidity);
        fieldsCompared++;
      }
      
      // Use pH - check for phRange first, then direct ph
      if (crop.phRange && crop.phRange.min != null && crop.phRange.max != null) {
        const avgPh = (crop.phRange.min + crop.phRange.max) / 2;
        diff += Math.abs(input.ph - avgPh);
        fieldsCompared++;
      } else if (cropPh != null && !isNaN(cropPh)) {
        diff += Math.abs(input.ph - cropPh);
        fieldsCompared++;
      }
      
      // Use rainfall if available
      if (cropRainfall != null && !isNaN(cropRainfall)) {
        diff += Math.abs(input.rainfall - cropRainfall);
        fieldsCompared++;
      }

      // Normalize diff by number of fields compared to avoid bias
      const normalizedDiff = fieldsCompared > 0 ? diff / fieldsCompared : Number.MAX_SAFE_INTEGER;

      if (normalizedDiff < minDiff) {
        minDiff = normalizedDiff;
        closestCrop = cropName;
        fieldCount = fieldsCompared;
      }
    }

    // If no crop was found (shouldn't happen, but safety check)
    if (!closestCrop) {
      // Fallback: return first crop if algorithm fails
      closestCrop = crops[0].name;
      console.log('Algorithm failed, returning first crop as fallback');
    }

    console.log(`Recommended crop: ${closestCrop}, minDiff: ${minDiff}, fields compared: ${fieldCount}`);

    res.json({ crop: closestCrop });
  } catch (error) {
    console.error('Error in crop recommendation:', error);
    res.status(500).json({ message: error.message, error: error.stack });
  }
});

// Search crops based on criteria
router.post('/search', async (req, res) => {
  try {
    const { soilType, climate, season, waterRequirement, temperature, ph } = req.body;
    
    const query = {};
    
    if (soilType) {
      query.soilType = { $in: Array.isArray(soilType) ? soilType : [soilType] };
    }
    
    if (climate) {
      query.climate = { $in: Array.isArray(climate) ? climate : [climate] };
    }
    
    if (season) {
      query.season = { $in: Array.isArray(season) ? season : [season] };
    }
    
    if (waterRequirement) {
      query.waterRequirement = waterRequirement;
    }
    
    if (temperature) {
      query['temperatureRange.min'] = { $lte: temperature };
      query['temperatureRange.max'] = { $gte: temperature };
    }
    
    if (ph) {
      query['phRange.min'] = { $lte: ph };
      query['phRange.max'] = { $gte: ph };
    }
    
    const crops = await Crop.find(query);
    res.json({
      count: crops.length,
      crops
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update crop
router.put('/:id', async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json({
      message: 'Crop updated successfully',
      crop
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete crop
router.delete('/:id', async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


