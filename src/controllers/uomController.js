// backend/controllers/uomController.js
import UOM from '../models/UOM.js';

// CREATE UOM
export const createUOM = async (req, res) => {
  try {
    const { code, name, type } = req.body;

    const existing = await UOM.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'UOM code already exists'
      });
    }

    const uom = new UOM({
      code: code.toUpperCase(),
      name,
      type: type || 'inventory'
    });

    await uom.save();

    res.status(201).json({
      success: true,
      data: uom,
      message: 'UOM created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL UOMs
export const getAllUOMs = async (req, res) => {
  try {
    const uoms = await UOM.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: uoms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE UOM
export const updateUOM = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.code) {
      updates.code = updates.code.toUpperCase();
      const existing = await UOM.findOne({ code: updates.code, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'UOM code already used by another entry'
        });
      }
    }

    const uom = await UOM.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!uom) {
      return res.status(404).json({ success: false, message: 'UOM not found' });
    }

    res.json({
      success: true,
      data: uom,
      message: 'UOM updated successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE UOM (optional future use)
export const deleteUOM = async (req, res) => {
  try {
    const { id } = req.params;
    const uom = await UOM.findByIdAndDelete(id);
    if (!uom) {
      return res.status(404).json({ success: false, message: 'UOM not found' });
    }
    res.json({ success: true, message: 'UOM deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};