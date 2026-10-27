// backend/models/CanadaPort.js
import mongoose from 'mongoose';

const canadaPortSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    unique: true,
    maxlength: 15
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export default canadaPortSchema;
