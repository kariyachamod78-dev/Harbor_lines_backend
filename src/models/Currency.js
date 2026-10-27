// backend/models/Currency.js
import mongoose from 'mongoose';

const currencySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    unique: true,
    minlength: 2,
    maxlength: 3
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  isLocal: {
    type: Boolean,
    default: false
  },
  buyRate: {
    type: Number,
    min: 0
  },
  sellRate: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

// Ensure only ONE currency can be local at a time
currencySchema.pre('save', async function (next) {
  if (this.isLocal) {
    await mongoose.model('Currency').updateMany(
      { _id: { $ne: this._id } },
      { $set: { isLocal: false } }
    );
  }
  next();
});

export default mongoose.model('Currency', currencySchema);