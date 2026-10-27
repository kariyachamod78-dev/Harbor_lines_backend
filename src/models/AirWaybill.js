// backend/models/AirWaybill.js
import mongoose from 'mongoose';

const airWaybillSchema = new mongoose.Schema({
  // Step 1 - Job & Main Details
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AirImportJob',
    required: true
  },
  jobNum: {
    type: String,
    required: true,
    trim: true
  },
  mawbNo: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  awbNo: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  awbDate: {
    type: Date,
    required: true
  },

  // Auto-filled / selected from job
  portDepartureCode: String,
  portDepartureName: String,
  airportDestinationCode: String,
  airportDestinationName: String,
  deliveryAgentCode: String,
  deliveryAgentName: String,

  // Manual selections
  shipperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerSupplier'
  },
  shipperName: String,

  consigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerSupplier'
  },
  consigneeName: String,

  issuingCarrierAgentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerSupplier'
  },
  issuingCarrierAgentName: String,

  revenueType: {
    type: String,
    enum: ['Nomination', 'Free Hand', 'Other'],
    default: 'Nomination'
  },

  amountOfInsurance: {
    type: Number,
    default: 0,
    min: 0
  },

  flightNo: String,
  flightDate: Date,

  salesmanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // or CustomerSupplier - depending on how you track salesmen
  },
  salesmanName: String,

  // Step 2 - Sub Details (charge line)
  noOfPieces: {
    type: Number,
    required: true,
    min: 0
  },
  grossWeight: {
    type: Number,
    required: true,
    min: 0
  },
  rateClass: String,
  commodityItemNo: String,
  chargeableWeight: {
    type: Number,
    required: true,
    min: 0
  },
  rateOrCharge: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  totalNoOfPackages: {
    type: Number,
    required: true,
    min: 0
  },

  // System fields
  status: {
    type: String,
    enum: ['Draft', 'Issued', 'Used', 'Cancelled'],
    default: 'Draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('AirWaybill', airWaybillSchema);