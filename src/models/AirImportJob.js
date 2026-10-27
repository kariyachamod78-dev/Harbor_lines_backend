// backend/models/AirImportJob.js
import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  flightNo: {
    type: String,
    required: true,
    trim: true
  },
  portDepartureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AirDestination',
    required: true
  },
  portDepartureName: {
    type: String,
    required: true
  },
  etdDate: {
    type: Date
  },
  airportDestinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AirDestination',
    required: true
  },
  airportDestinationName: {
    type: String,
    required: true
  },
  etaDate: {
    type: Date
  },
  airline: {
    type: String,
    trim: true
  }
}, { _id: false });

const airImportJobSchema = new mongoose.Schema({
  jobNum: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  jobCategory: {
    type: String,
    enum: ['Freight Forwarding', 'FF + Cleaning'],
    required: true
  },
  mawbNo: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },

  // References
  portDepartureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AirDestination',
    required: true
  },
  portDepartureName: {
    type: String,
    required: true
  },
  airportDestinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AirDestination',
    required: true
  },
  airportDestinationName: {
    type: String,
    required: true
  },

  originAgentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerSupplier'
  },
  originAgentName: String,

  principleCustomerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerSupplier'
  },
  principleCustomerName: String,

  currency: {
    type: String,
    required: true
  },
  exchangeRate: {
    type: Number,
    required: true,
    min: 0
  },
  impNo: {
    type: String,
    trim: true
  },

  flights: [flightSchema],

  status: {
    type: String,
    enum: ['Draft', 'Confirmed', 'In Transit', 'Completed', 'Cancelled'],
    default: 'Draft'
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('AirImportJob', airImportJobSchema);