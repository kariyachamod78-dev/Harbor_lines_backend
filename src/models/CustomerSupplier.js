// backend/models/CustomerSupplier.js
import mongoose from 'mongoose';

const customerSupplierSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['customer', 'supplier'],
    required: true
  },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: String,
  street: String,
  city: String,
  country: String,
  telNo: String,
  email: String,
  customerType: String,
  category: {
    type: String,
    enum: ['Normal', 'Bad Outstanding'],
    default: 'Normal'
  },
  isConsignee: { type: Boolean, default: false },
  isNotifyParty: { type: Boolean, default: false },
  isSupplier: { type: Boolean, default: false },
  isAgent: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('CustomerSupplier', customerSupplierSchema);