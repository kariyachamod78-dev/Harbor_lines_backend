// backend/models/RefBilling.js
import mongoose from 'mongoose';

const referenceDetailSchema = new mongoose.Schema({
  refNum: { type: String, required: true },
  consigneeName: { type: String },
  packages: { type: Number },
  chargesPerBox: { type: Number },
  additionalTax: { type: Number, default: 0 },
  description: { type: String },
  totalLKR: { type: Number, required: true },
});

const refBillingSchema = new mongoose.Schema({
  jobNum: { type: String, required: true, unique: true },
  billingId: { type: mongoose.Schema.Types.ObjectId, ref: 'CanadaBilling' },
  manifestId: { type: mongoose.Schema.Types.ObjectId, ref: 'HLManifest' },
  references: [referenceDetailSchema]
}, { timestamps: true });

export default refBillingSchema;
