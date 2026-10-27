// backend/controllers/flightController.js
import Flight from '../models/Flight.js';

// CREATE Flight
export const createFlight = async (req, res) => {
  try {
    const { flightNo, airlineName } = req.body;

    if (!flightNo || !airlineName) {
      return res.status(400).json({
        success: false,
        message: 'Flight No and Airline Name are required'
      });
    }

    const existing = await Flight.findOne({ flightNo: flightNo.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Flight No already exists'
      });
    }

    const flight = new Flight({
      ...req.body,
      flightNo: flightNo.toUpperCase(),
      airlineCode: req.body.airlineCode ? req.body.airlineCode.toUpperCase() : undefined
    });

    await flight.save();

    res.status(201).json({
      success: true,
      data: flight,
      message: 'Flight created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL Flights
export const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: flights
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE Flight
export const updateFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.flightNo) {
      updates.flightNo = updates.flightNo.toUpperCase();
      const existing = await Flight.findOne({
        flightNo: updates.flightNo,
        _id: { $ne: id }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Flight No already used by another flight'
        });
      }
    }

    if (updates.airlineCode) {
      updates.airlineCode = updates.airlineCode.toUpperCase();
    }

    const flight = await Flight.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.json({
      success: true,
      data: flight,
      message: 'Flight updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE Flight (optional)
export const deleteFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const flight = await Flight.findByIdAndDelete(id);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }
    res.json({ success: true, message: 'Flight deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};