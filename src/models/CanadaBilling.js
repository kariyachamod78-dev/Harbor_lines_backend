// backend/models/CanadaBilling.js
import mongoose from 'mongoose';

const canadaBillingSchema = new mongoose.Schema({
  manifestId: { type: mongoose.Schema.Types.ObjectId, ref: 'HLManifest', required: true },
  manifestNum: { type: String, required: true },
  cbmRate: { type: Number },
  containerRates: { type: Map, of: Number },
  perPackageCharge: { type: Number },
  taxPerPackage: { type: Number },
  exchangeRate: { type: Number },
  additionalCharges: { type: Map, of: Number },
  totals: {
    totalCBM: { type: Number },
    totalPackages: { type: Number },
    containerSummary: { type: Map, of: Number },
    subTotalLKR: { type: Number },
    seventyFivePercentLKR: { type: Number },
    taxBasePerPackageLKR: { type: Number },
    finalPerPackageLKR: { type: Number },
    taxTotalLKR: { type: Number },
    grandTotalLKR: { type: Number }
  },
  calculatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default canadaBillingSchema;
