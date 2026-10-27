// backend/models/Receipt.js
import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'itemModel',
    required: [true, 'Reference is required'],
    index: true
  },
  itemModel: {
    type: String,
    required: true,
    enum: ['SalesInvoice', 'Payable'],
    default: 'SalesInvoice'
  },
  invoiceType: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['Invoice', 'Debit Note', 'Credit Note', 'Payable', 'Other'],
    trim: true
  },

  receiptNo: {
    type: String,
    required: [true, 'Receipt number is required'],
    unique: true,
    uppercase: true,
    trim: true,
    index: true // For fast searches by receipt number
  },

  paidAmount: {
    type: Number,
    required: [true, 'Paid amount is required'],
    min: [0, 'Paid amount cannot be negative']
  },

  pendingAmount: {
    type: Number,
    required: [true, 'Pending amount is required'],
    min: [0, 'Pending amount cannot be negative']
  },

  date: {
    type: Date,
    required: [true, 'Payment date is required'],
    index: true // Useful for date-range queries / reports
  },

  // Removed: documentUrl (no longer needed since we dropped file upload)

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ← Optional: track who created the receipt
    default: null
  },

  notes: {
    type: String,
    trim: true,
    maxlength: 500 // Optional field for payment remarks
  },

  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Reversed', 'Cancelled'],
    default: 'Confirmed'
  }
}, {
  timestamps: true, // auto adds createdAt & updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for convenience: full receipt reference
receiptSchema.virtual('receiptReference').get(function () {
  return `${this.receiptNo} (${this.date.toISOString().split('T')[0]})`;
});

// Optional index for faster queries by invoice + date
receiptSchema.index({ invoiceId: 1, date: -1 });

export default mongoose.model('Receipt', receiptSchema);