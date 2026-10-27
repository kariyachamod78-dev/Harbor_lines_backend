// backend/models/CanadaHBL.js
import mongoose from 'mongoose';

const referenceSchema = new mongoose.Schema({
  refNum: { type: String },
  hblNumber: { type: String },
  shipperName: { type: String },
  shipperAddress: { type: String },
  weight: { type: Number },
  cbm: { type: Number },
  noOfPackages: { type: Number },
  description: { type: String },
  consigneeName: { type: String },
  consigneeAddress: { type: String },
  consigneeNIC: { type: String },
  consigneePhone: { type: String },
  packageType: { type: String, default: 'CTN' },
  charges: [{
    label: { type: String },
    amount: { type: Number, default: 0 }
  }]
});

const hblSchema = new mongoose.Schema({
  jobNum: { type: String },
  bookingNum: { type: String },
  hblNumber: { type: String },
  vessel: { type: String },
  voyage: { type: String },
  voyage: { type: String },
  etd: { type: String },
  containerNum: { type: String },
  containerNum: { type: String },
  sealNum: { type: String },
  containerType: { type: String },
  mainLine: { type: String },
  pol: { type: String },
  pod: { type: String },
  references: [referenceSchema]
});

const manifestSchema = new mongoose.Schema({
  hbls: [hblSchema],
  totalWeight: { type: Number, default: 0 },
  totalCBM: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('HLManifest', manifestSchema);