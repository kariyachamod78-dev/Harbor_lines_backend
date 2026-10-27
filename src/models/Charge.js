import mongoose from 'mongoose';

const chargeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  rate: { type: Number, required: true },
  plGroup: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('Charge', chargeSchema);