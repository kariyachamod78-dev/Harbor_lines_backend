// backend/controllers/bankController.js
import Bank from '../models/Bank.js';

// CREATE Bank
export const createBank = async (req, res) => {
  try {
    const { bankCode, bankName, accountName, accountNumber } = req.body;

    // Required fields check
    if (!bankCode || !bankName || !accountName || !accountNumber) {
      return res.status(400).json({
        success: false,
        message: 'Bank Code, Bank Name, Account Name and Account Number are required'
      });
    }

    // Check duplicate bankCode
    const existing = await Bank.findOne({ bankCode: bankCode.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Bank Code already exists'
      });
    }

    const bank = new Bank({
      ...req.body,
      bankCode: bankCode.toUpperCase(),
      swiftCode: req.body.swiftCode ? req.body.swiftCode.toUpperCase() : undefined
    });

    await bank.save();

    res.status(201).json({
      success: true,
      data: bank,
      message: 'Bank created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL Banks
export const getAllBanks = async (req, res) => {
  try {
    const banks = await Bank.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: banks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE Bank
export const updateBank = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent changing bankCode to an existing one
    if (updates.bankCode) {
      updates.bankCode = updates.bankCode.toUpperCase();
      const existing = await Bank.findOne({
        bankCode: updates.bankCode,
        _id: { $ne: id }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Bank Code already used by another bank'
        });
      }
    }

    if (updates.swiftCode) {
      updates.swiftCode = updates.swiftCode.toUpperCase();
    }

    const bank = await Bank.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!bank) {
      return res.status(404).json({
        success: false,
        message: 'Bank not found'
      });
    }

    res.json({
      success: true,
      data: bank,
      message: 'Bank updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE Bank (optional)
export const deleteBank = async (req, res) => {
  try {
    const { id } = req.params;
    const bank = await Bank.findByIdAndDelete(id);
    if (!bank) {
      return res.status(404).json({ success: false, message: 'Bank not found' });
    }
    res.json({ success: true, message: 'Bank deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};