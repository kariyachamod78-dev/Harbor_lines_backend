// backend/models/Tax.js
import mongoose from 'mongoose';

const taxSchema = new mongoose.Schema({
  // Tax Information
  code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    unique: true,
    maxlength: 10
  },
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Rate Information
  rate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  registrationNo: String,
  operator: {
    type: String,
    enum: ['multiply', 'divide'],
    default: 'multiply'
  },
  divideBy: {
    type: Number,
    min: 0
  },
  invoiceHeader: String,
  displayOnly: {
    type: Boolean,
    default: false
  },

  // Single Priority (1 = highest, 10 = lowest)
  priority: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 1
  },

  // Revenue GL Mapping
  revenueAccountStatus: {
    type: String,
    enum: ['Payable', 'Income', 'Receivable', 'Expense'],
    default: 'Income'
  },
  revenuePayableCode: String,

  // Cost GL Mapping
  costAccountStatus: {
    type: String,
    enum: ['Payable', 'Income', 'Receivable', 'Expense'],
    default: 'Expense'
  },
  costPayableCode: String
}, {
  timestamps: true
});

export default mongoose.model('Tax', taxSchema);
