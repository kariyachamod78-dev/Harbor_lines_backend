// backend/controllers/airImportJobController.js
import AirImportJob from '../models/AirImportJob.js';

// Create new Air Import Job
export const createAirImportJob = async (req, res) => {
  try {
    const {
      jobNum,
      jobCategory,
      mawbNo,
      portDepartureId,
      portDepartureName,
      airportDestinationId,
      airportDestinationName,
      originAgentId,
      originAgentName,
      principleCustomerId,
      principleCustomerName,
      currency,
      exchangeRate,
      impNo,
      flights
    } = req.body;

    if (!jobNum || !jobCategory || !mawbNo || !portDepartureId || !airportDestinationId || !currency || !exchangeRate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (!flights || flights.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one flight is required'
      });
    }

    const newJob = await AirImportJob.create({
      jobNum,
      jobCategory,
      mawbNo,
      portDepartureId,
      portDepartureName,
      airportDestinationId,
      airportDestinationName,
      originAgentId,
      originAgentName,
      principleCustomerId,
      principleCustomerName,
      currency,
      exchangeRate,
      impNo,
      flights,
      createdBy: req.user?._id // if you have auth middleware
    });

    res.status(201).json({ success: true, data: newJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Optional: Get all air import jobs
export const getAllAirImportJobs = async (req, res) => {
  try {
    const jobs = await AirImportJob.find()
      .populate('portDepartureId', 'name code')
      .populate('airportDestinationId', 'name code')
      .populate('originAgentId', 'name code')
      .populate('principleCustomerId', 'name code')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// Update existing job
export const updateAirImportJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await AirImportJob.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedJob) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, data: updatedJob });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};