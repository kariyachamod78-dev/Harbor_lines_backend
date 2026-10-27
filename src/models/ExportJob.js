// backend/models/ExportJob.js
import mongoose from 'mongoose';

const exportJobSchema = new mongoose.Schema({
  // Auto-generated or user-provided
  jobNum: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  blNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },

  // Parties (references to CustomerSupplier)
  shipperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerSupplier',
    required: true
  },
  consigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerSupplier',
    required: true
  },
  notifyPartyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerSupplier'
  },

  // B/L core dates & instructions
  onBoardDate: {
    type: Date,
    required: true
  },
  deliveryApplyTo: {
    type: String,
    required: true,
    trim: true
  },
  vesselId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vessel',
    required: true
  },
  voyage: {
    type: String,
    required: true,
    trim: true
  },
  portLoading: {
    type: String,
    required: true,
    trim: true
  },
  portDischarge: {
    type: String,
    required: true,
    trim: true
  },
  placeDelivery: {
    type: String,
    trim: true
  },

  // Payment & originals
  freightPayableAt: {
    type: String,
    trim: true
  },
  numOriginalBLs: {
    type: Number,
    min: 1,
    default: 3
  },

  // Cargo description
  marksNumbers: String,
  containerSealNumbers: String,
  numPackages: Number,
  uom: String,
  descriptionGoods: String,
  grossWeight: Number,
  measurementCBM: Number,

  // Status & audit
  status: {
    type: String,
    enum: ['Draft', 'Confirmed', 'Shipped', 'Cancelled'],
    default: 'Draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('ExportJob', exportJobSchema);