// backend/models/ManifestInvoice.js
import mongoose from 'mongoose';

const manifestInvoiceSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true },
  date: { type: Date, default: Date.now },
  consignee: {
    name: { type: String },
    address: { type: String },
    phone: { type: String }
  },
  charges: [{
    name: { type: String },
    amount: { type: Number },
    units: { type: Number, default: 0 }
  }],
  bank: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('ManifestInvoice', manifestInvoiceSchema);
