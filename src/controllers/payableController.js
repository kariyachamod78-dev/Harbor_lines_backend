// backend/controllers/payableController.js
import Payable from '../models/Payable.js';

export const createPayable = async (req, res) => {
  try {
    const { masterBLId, masterBLNum, blModel, reason, charges, paidDate, sourceOfFunds } = req.body;

    // Basic Validation
    if (!masterBLId || !masterBLNum || !blModel || !reason || !paidDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!charges || charges.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one charge is required' });
    }

    const payable = new Payable({
      masterBLId,
      masterBLNum,
      blModel,
      reason,
      charges,
      paidDate,
      sourceOfFunds,
      createdBy: req.user._id // Set by protect middleware
    });

    await payable.save();

    res.status(201).json({
      success: true,
      data: payable,
      message: 'Payable record created successfully'
    });
  } catch (error) {
    console.error('Create Payable Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPayables = async (req, res) => {
  try {
    const payables = await Payable.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: payables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
