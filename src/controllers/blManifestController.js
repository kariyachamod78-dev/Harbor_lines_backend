// backend/controllers/blManifestController.js
import BLManifestJob from '../models/BLManifestJob.js';
import Vessel from '../models/Vessel.js';

// Create a new BL Manifest Job
export const createBLManifestJob = async (req, res) => {
  try {
    const { mainLine, vessel, containerNum, sealNum } = req.body;
    
    // Generate a unique Job ID
    const jobId = `BLM-${Date.now()}`;
    
    const newJob = await BLManifestJob.create({
      jobId,
      mainLine,
      vessel,
      containerNum,
      sealNum,
      entries: []
    });
    
    res.status(201).json({ success: true, data: newJob });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Upload entries to an existing job
export const uploadBLManifestEntries = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { entries } = req.body;
    
    const job = await BLManifestJob.findOneAndUpdate(
      { jobId },
      { entries },
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all BL Manifest Jobs
export const getAllBLManifestJobs = async (req, res) => {
  try {
    const jobs = await BLManifestJob.find().sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Fetch vessels for the dropdown
export const getVesselsForBL = async (req, res) => {
  try {
    const vessels = await Vessel.find({}, 'name code');
    res.json({ success: true, data: vessels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBLManifestJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updateData = req.body;
    
    const job = await BLManifestJob.findOneAndUpdate(
      { jobId },
      updateData,
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
