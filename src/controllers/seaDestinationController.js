// backend/controllers/seaDestinationController.js
import SeaDestination from '../models/SeaDestination.js';

// CREATE Destination
export const createDestination = async (req, res) => {
  try {
    const { code, name } = req.body;

    if (!code || !name) {
      return res.status(400).json({
        success: false,
        message: 'Destination Code and Name are required'
      });
    }

    const existing = await SeaDestination.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Destination Code already exists'
      });
    }

    const destination = new SeaDestination({
      code: code.toUpperCase(),
      name: name.trim()
    });

    await destination.save();

    res.status(201).json({
      success: true,
      data: destination,
      message: 'Sea destination created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL Destinations
export const getAllDestinations = async (req, res) => {
  try {
    const destinations = await SeaDestination.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: destinations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE Destination
export const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name } = req.body;

    if (!code || !name) {
      return res.status(400).json({
        success: false,
        message: 'Destination Code and Name are required'
      });
    }

    // Prevent duplicate code on update
    if (code) {
      const existing = await SeaDestination.findOne({
        code: code.toUpperCase(),
        _id: { $ne: id }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Destination Code already used by another record'
        });
      }
    }

    const destination = await SeaDestination.findByIdAndUpdate(
      id,
      {
        $set: {
          code: code.toUpperCase(),
          name: name.trim()
        }
      },
      { new: true, runValidators: true }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Sea destination not found'
      });
    }

    res.json({
      success: true,
      data: destination,
      message: 'Sea destination updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE Destination (optional - safe for future)
export const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await SeaDestination.findByIdAndDelete(id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};