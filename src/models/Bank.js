// backend/models/Bank.js
import mongoose from 'mongoose';

const bankSchema = new mongoose.Schema({
  // Tab 1: Bank & Company Info
  bankCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    unique: true,
    maxlength: 10
  },
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  accountName: {
    type: String,
    required: true,
    trim: true
  },
  accountAddress: String,
  accountStreet: String,
  accountCity: String,
  accountNumber: {
    type: String,
    required: true,
    trim: true
  },

  // Tab 2: Bank Details
  bankAddress: String,
  bankStreet: String,
  bankCity: String,
  telephone: String,
  swiftCode: {
    type: String,
    uppercase: true,
    trim: true
  },
  isCompanyAccount: {
    type: Boolean,
    default: false
  },
  chequeNo: String, // prefix

  // GL Accounts
  bankChargesCode: String,
  bankChargesName: String,
  glAccountCode: String,
  glAccountName: String
}, {
  timestamps: true
});

export default mongoose.model('Bank', bankSchema);
