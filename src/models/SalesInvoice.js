// backend/models/SalesInvoice.js
import mongoose from 'mongoose';

const invoiceLineSchema = new mongoose.Schema({
  chargeCode: { type: String, required: true },
  chargeName: String,
  currency: String,
  amount: Number,
  uom: String,
  rate: Number,
  curValue: Number,
  exRate: Number,
  value: Number,
  tax1Code: String,
  tax1Rate: Number,
  tax1Value: Number,
  tax2Code: String,
  tax2Rate: Number,
  tax2Value: Number,
  narration: String,
  round: Number,
  curNetValue: Number,
  netValue: Number,
  serialNo: Number
});

const salesInvoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, unique: true, required: true },
  currency: String,
  payMode: { type: String, enum: ['Cash', 'Credit'], default: 'Credit' },
  userType: { type: String, enum: ['Shipper', 'Consignee', 'Other'], default: 'Consignee' },
  invoiceType: { type: String, enum: ['Invoice', 'Debit Note', 'Miscellaneous'], default: 'Invoice' },
  invoiceDate: { type: Date, required: true },

  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'SeaImportJob' },
  jobNum: String,
  doId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryOrder' },
  doNum: String,
  houseBl: String,

  // Customer
  customerCode: String,
  customerName: String,
  address: String,
  city: String,
  country: String,

  // Job Details
  containerInfo: String,
  vesselCode: String,
  vesselName: String,
  portOfLoadingCode: String,
  portOfLoadingName: String,
  voyage: String,
  noOfPackages: String,
  contactDetails: String,
  remarks: String,
  customerRefNo: String,

  // Invoice Lines
  invoiceLines: [invoiceLineSchema],

  // Bank Info
  bankCode: String,
  bankName: String,
  accountName: String,
  accountAddress: String,
  accountStreet: String,
  accountCity: String,
  accountNumber: String,

  paymentNotes: String,

  // Totals
  totalAmount: Number,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

// Auto-generate Invoice No
salesInvoiceSchema.pre('validate', async function(next) {
  if (!this.invoiceNo) {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await this.constructor.countDocuments({ invoiceNo: new RegExp(`^SFI/DNUFL/${year}/`) });
    const padded = String(count + 1).padStart(7, '0');
    this.invoiceNo = `SFI/DNUFL/${year}/${padded}`;
  }
  next();
});

export default mongoose.model('SalesInvoice', salesInvoiceSchema);