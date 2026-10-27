import mongoose from 'mongoose';

const airWaybillInstructionSchema = new mongoose.Schema({
  shipper: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String }
  },
  consignee: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactName: { type: String },
    telNo: { type: String }
  },
  shipmentDetails: [{
    marksAndNumbers: { type: String },
    noOfPackages: { type: String, required: true },
    natureAndQuantity: { type: String, required: true },
    grossWeight: { type: String, required: true }
  }],
  dimensions: [String],
  notifyParty: {
    name: { type: String },
    address: { type: String },
    contactPersonName: { type: String },
    tel: { type: String },
    email: { type: String }
  }
}, { timestamps: true });

export default mongoose.model('AirWaybillInstruction', airWaybillInstructionSchema);
