// backend/controllers/receivableController.js
import Receipt from '../models/Receipt.js';

// Generate receipt number
const generateReceiptNo = async () => {
  const count = await Receipt.countDocuments();
  const num = String(count + 1).padStart(4, '0');
  return `REC-${new Date().getFullYear()}-${num}`;
};

export const createReceipt = async (req, res) => {
  try {
    const { invoiceId, invoiceType, itemModel, paidAmount, pendingAmount, date, notes } = req.body;

    // Basic Validation
    if (!invoiceId || !invoiceType || !paidAmount || !date) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const receiptNo = await generateReceiptNo();

    const newReceipt = await Receipt.create({
      invoiceId,
      invoiceType,
      itemModel: itemModel || 'SalesInvoice',
      receiptNo,
      paidAmount: Number(paidAmount),
      pendingAmount: Number(pendingAmount) || 0,
      date: new Date(date),
      notes,
      createdBy: req.user?._id
    });

    res.status(201).json({ success: true, data: newReceipt });
  } catch (err) {
    console.error('createReceipt error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};