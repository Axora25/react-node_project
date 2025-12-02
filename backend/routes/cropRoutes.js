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

