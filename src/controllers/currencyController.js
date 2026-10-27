// backend/controllers/currencyController.js
import Currency from '../models/Currency.js';

// CREATE Currency
export const createCurrency = async (req, res) => {
  try {
    const { code, name, isLocal, buyRate, sellRate } = req.body;

    // Prevent duplicate code
    const existing = await Currency.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Currency code already exists'
      });
    }

    const currency = new Currency({
      code: code.toUpperCase(),
      name,
      isLocal: isLocal || false,
      buyRate: buyRate || null,
      sellRate: sellRate || null
    });

    await currency.save();

    res.status(201).json({
      success: true,
      data: currency,
      message: 'Currency created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL Currencies
export const getAllCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: currencies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE Currency (future use)
export const updateCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.code) updates.code = updates.code.toUpperCase();

    const currency = await Currency.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!currency) {
      return res.status(404).json({ success: false, message: 'Currency not found' });
    }

    res.json({
      success: true,
      data: currency,
      message: 'Currency updated'
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE Currency (future use)
export const deleteCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const currency = await Currency.findByIdAndDelete(id);
    if (!currency) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.json({ success: true, message: 'Currency deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};