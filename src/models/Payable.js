// backend/models/Payable.js
import mongoose from 'mongoose';

const chargeSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  units: { type: Number, default: 1 },
  currency: { type: String, required: true }
}, { _id: false });

const payableSchema = new mongoose.Schema({
  masterBLId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'blModel'
  },
  masterBLNum: {
    type: String,
    required: true,
    trim: true
  },
  blModel: {
    type: String,
    required: true,
    enum: ['SeaImportJob', 'AirImportJob'],
    default: 'SeaImportJob'
  },
  reason: {
    type: String,
    required: true,
    enum: ['Agent Fee', 'Penalty', 'Demurrage', 'Detention', 'Other']
  },
  charges: [chargeSchema],
  paidDate: {
    type: Date,
    required: true
  },
  sourceOfFunds: {
    type: String,
    required: true,
    enum: ['Bank Transfer', 'Cash', 'Cheque', 'Other'],
    default: 'Bank Transfer'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Payable', payableSchema);
