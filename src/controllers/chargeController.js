import Charge from '../models/Charge.js';

export const createCharge = async (req, res) => {
  try {
    const { code, name, rate, plGroup } = req.body;
    const chargeExists = await Charge.findOne({ code });
    if (chargeExists) return res.status(400).json({ success: false, message: 'Charge code already exists' });

    const charge = await Charge.create({ code, name, rate, plGroup });
    res.status(201).json({ success: true, data: charge });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllCharges = async (req, res) => {
  try {
    const charges = await Charge.find().sort({ code: 1 });
    res.json({ success: true, data: charges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const charge = await Charge.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!charge) return res.status(404).json({ success: false, message: 'Charge not found' });

    res.json({ success: true, data: charge });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};