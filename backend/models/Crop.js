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
  },
  // Numerical fields for distance-based recommendation (optional)
  nitrogen: {
    type: Number,
    default: null
  },
  phosphorus: {
    type: Number,
    default: null
  },
  potassium: {
    type: Number,
    default: null
  },
  humidity: {
    type: Number,
    default: null
  },
  rainfall: {
    type: Number,
    default: null
  },
  temperature: {
    type: Number,
    default: null
  },
  ph: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

const Crop = mongoose.model('Crop', cropSchema);

export default Crop;

