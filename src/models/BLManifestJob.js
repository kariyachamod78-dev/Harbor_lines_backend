// backend/models/BLManifestExport.js
import mongoose from 'mongoose';

const blEntrySchema = new mongoose.Schema({
  bookingNum: { type: String },
  shipperName: { type: String },
  shipperAddress: { type: String },
  shipperCity: { type: String },
  shipperContact: { type: String },
  consigneeName: { type: String },
  consigneeAddress: { type: String },
  consigneeCity: { type: String },
  consigneeDistrict: { type: String },
  consigneeTel: { type: String },
  consigneeNIC: { type: String },
  cargoType: { type: String },
  cargoQuantity: { type: String },
  cuFeet: { type: String },
  cbm: { type: String },
  status: { 
    type: String, 
    default: 'Non-checked',
    enum: ['Non-checked', 'Checked', 'Pending Payment', 'Paid', 'Delivered']
  },
  remark: { type: String, default: '' }
});

const blManifestJobSchema = new mongoose.Schema({
  jobId: { type: String, unique: true },
  mainLine: { type: String },
  vessel: { type: String },
  containerNum: { type: String },
  sealNum: { type: String },
  entries: [blEntrySchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('BLManifestJob', blManifestJobSchema);
