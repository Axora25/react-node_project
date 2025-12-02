import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  soilType: {
    type: [String], // Array of soil types (e.g., ["clay", "sandy", "loamy"])
    required: true
  },
  climate: {
    type: [String], // Array of climate conditions (e.g., ["tropical", "temperate"])
    required: true
  },
  season: {
    type: [String], // Array of seasons (e.g., ["summer", "winter", "monsoon"])
    required: true
  },
  waterRequirement: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  temperatureRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  phRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  yield: {
    type: String,
    required: true
  },
  image: {
    type: String, // URL or path to image
    default: ''
  }
}, {
  timestamps: true
});

const Crop = mongoose.model('Crop', cropSchema);

export default Crop;

