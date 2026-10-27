// backend/controllers/vesselController.js
import Vessel from '../models/Vessel.js';

export const createVessel = async (req, res) => {
  try {
    const { code, name } = req.body;

    if (!code || !name) {
      return res.status(400).json({
        success: false,
        message: 'Vessel Code and Name are required'
      });
    }

    const existing = await Vessel.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Vessel Code already exists'
      });
    }

    const vessel = new Vessel({
      ...req.body,
      code: code.toUpperCase()
    });

    await vessel.save();

    res.status(201).json({
      success: true,
      data: vessel,
      message: 'Vessel created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL Vessels
export const getAllVessels = async (req, res) => {
  try {
    const vessels = await Vessel.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: vessels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE Vessel
export const updateVessel = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.code) {
      updates.code = updates.code.toUpperCase();
      const existing = await Vessel.findOne({
        code: updates.code,
        _id: { $ne: id }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Vessel Code already used by another vessel'
        });
      }
    }

    const vessel = await Vessel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!vessel) {
      return res.status(404).json({
        success: false,
        message: 'Vessel not found'
      });
    }

    res.json({
      success: true,
      data: vessel,
      message: 'Vessel updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE Vessel (optional future use)
export const deleteVessel = async (req, res) => {
  try {
    const { id } = req.params;
    const vessel = await Vessel.findByIdAndDelete(id);
    if (!vessel) {
      return res.status(404).json({ success: false, message: 'Vessel not found' });
    }
    res.json({ success: true, message: 'Vessel deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};