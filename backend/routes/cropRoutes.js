import express from 'express';
import Crop from '../models/Crop.js';

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
    
    // Fetch all crops
    const crops = await Crop.find();
    
    if (crops.length === 0) {
      return res.json({ crop: 'No crop found' });
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
    let closestCrop = 'No crop found';

    // Calculate distance for each crop
    for (const crop of crops) {
      let diff = 0;
      
      // Calculate difference for each field
      // Use crop.nitrogen if available, otherwise use temperature/ph as approximation
      if (crop.nitrogen !== undefined) {
        diff += Math.abs(input.nitrogen - (crop.nitrogen || 0));
      }
      if (crop.phosphorus !== undefined) {
        diff += Math.abs(input.phosphorus - (crop.phosphorus || 0));
      }
      if (crop.potassium !== undefined) {
        diff += Math.abs(input.potassium - (crop.potassium || 0));
      }
      
      // Use temperature from temperatureRange if available
      if (crop.temperatureRange) {
        const avgTemp = (crop.temperatureRange.min + crop.temperatureRange.max) / 2;
        diff += Math.abs(input.temperature - avgTemp);
      } else if (crop.temperature !== undefined) {
        diff += Math.abs(input.temperature - (crop.temperature || 0));
      }
      
      // Use humidity if available
      if (crop.humidity !== undefined) {
        diff += Math.abs(input.humidity - (crop.humidity || 0));
      }
      
      // Use pH from phRange if available
      if (crop.phRange) {
        const avgPh = (crop.phRange.min + crop.phRange.max) / 2;
        diff += Math.abs(input.ph - avgPh);
      } else if (crop.ph !== undefined) {
        diff += Math.abs(input.ph - (crop.ph || 0));
      }
      
      // Use rainfall if available
      if (crop.rainfall !== undefined) {
        diff += Math.abs(input.rainfall - (crop.rainfall || 0));
      }

      if (diff < minDiff) {
        minDiff = diff;
        closestCrop = crop.name;
      }
    }

    res.json({ crop: closestCrop });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

