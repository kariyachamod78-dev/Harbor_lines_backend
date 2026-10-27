// backend/controllers/airDestinationController.js
import AirDestination from '../models/AirDestination.js';

// CREATE Air Destination
export const createDestination = async (req, res) => {
  try {
    const { code, name, country } = req.body;

    if (!code || !name || !country) {
      return res.status(400).json({
        success: false,
        message: 'Airport Code, Name and Country are required'
      });
    }

    const existing = await AirDestination.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Airport Code already exists'
      });
    }

    const destination = new AirDestination({
      code: code.toUpperCase(),
      name: name.trim(),
      country: country.trim()
    });

    await destination.save();

    res.status(201).json({
      success: true,
      data: destination,
      message: 'Air destination created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL Air Destinations
export const getAllDestinations = async (req, res) => {
  try {
    const destinations = await AirDestination.find().sort({ createdAt: -1 });
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

// UPDATE Air Destination
export const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, country } = req.body;

    if (!code || !name || !country) {
      return res.status(400).json({
        success: false,
        message: 'Airport Code, Name and Country are required'
      });
    }

    // Prevent duplicate code on update
    if (code) {
      const existing = await AirDestination.findOne({
        code: code.toUpperCase(),
        _id: { $ne: id }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Airport Code already used by another destination'
        });
      }
    }

    const destination = await AirDestination.findByIdAndUpdate(
      id,
      {
        $set: {
          code: code.toUpperCase(),
          name: name.trim(),
          country: country.trim()
        }
      },
      { new: true, runValidators: true }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Air destination not found'
      });
    }

    res.json({
      success: true,
      data: destination,
      message: 'Air destination updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE Air Destination (optional)
export const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await AirDestination.findByIdAndDelete(id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Air destination not found' });
    }
    res.json({ success: true, message: 'Air destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};