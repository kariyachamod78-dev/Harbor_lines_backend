// backend/controllers/seaImportJobController.js
import SeaImportJob from '../models/SeaImportJob.js';

// 🔧 Helper: Remove empty string ObjectId fields
const sanitizeObjectIds = (data) => {
  const objectIdFields = [
    'vesselId',
    'portDepartureId',
    'portDischargeId',
    'portOfLoadingId',
    'originAgentId',
    'carrierId',
    'shipAgentId',
    'principleCustomerId',
    'localAgentId'
  ];

  const cleaned = { ...data };

  objectIdFields.forEach(field => {
    if (cleaned[field] === "") {
      delete cleaned[field]; // remove invalid ObjectId
    }
  });

  return cleaned;
};

// CREATE Job
export const createJob = async (req, res) => {
  try {
    // ✅ sanitize incoming data FIRST
    const cleanedData = sanitizeObjectIds(req.body);

    const { jobNum, mblNumber, containers } = cleanedData;

    // Required fields
    if (!jobNum) {
      return res.status(400).json({ success: false, message: 'Job Number is required' });
    }

    if (!mblNumber) {
      return res.status(400).json({ success: false, message: 'MBL Number is required' });
    }

    if (!containers || containers.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one container is required' });
    }

    if (cleanedData._id) {
      const existingById = await SeaImportJob.findById(cleanedData._id);
      if (existingById && existingById.jobNum === jobNum) {
        const updates = { ...cleanedData };
        delete updates._id;
        delete updates.jobNum;

        if (updates.mblNumber && updates.mblNumber !== existingById.mblNumber) {
          const mblInUse = await SeaImportJob.findOne({
            mblNumber: updates.mblNumber,
            _id: { $ne: existingById._id }
          });
          if (mblInUse) {
            return res.status(400).json({ success: false, message: 'MBL Number already exists' });
          }
        }

        const updatedJob = await SeaImportJob.findByIdAndUpdate(
          existingById._id,
          { $set: updates },
          { new: true, runValidators: true }
        ).populate([
          'vesselId',
          'portDepartureId',
          'portDischargeId',
          'portOfLoadingId',
          'originAgentId',
          'carrierId',
          'shipAgentId',
          'principleCustomerId',
          'localAgentId'
        ]);

        return res.status(200).json({
          success: true,
          data: updatedJob,
          message: 'Sea Import Job updated successfully'
        });
      }
    }

    delete cleanedData._id;

    // Check duplicate job number
    const existingJob = await SeaImportJob.findOne({ jobNum });
    if (existingJob) {
      return res.status(400).json({ success: false, message: 'Job Number already exists' });
    }

    // Check duplicate MBL
    const existingMBL = await SeaImportJob.findOne({ mblNumber });
    if (existingMBL) {
      return res.status(400).json({ success: false, message: 'MBL Number already exists' });
    }

    // Check duplicate container numbers, ignoring empty ones
    const containerList = containers || [];
    const containerNos = containerList.map(c => c.containerNo).filter(no => no && no.trim() !== '');
    const duplicates = containerNos.filter((item, index) => containerNos.indexOf(item) !== index);

    if (duplicates.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Duplicate container numbers: ${duplicates.join(', ')}`
      });
    }

    // Create job
    const job = new SeaImportJob(cleanedData);
    await job.save();

    // Populate references
    await job.populate([
      'vesselId',
      'portDepartureId',
      'portDischargeId',
      'portOfLoadingId',
      'originAgentId',
      'carrierId',
      'shipAgentId',
      'principleCustomerId',
      'localAgentId'
    ]);

    res.status(201).json({
      success: true,
      data: job,
      message: 'Sea Import Job created successfully with containers'
    });

  } catch (error) {
    console.error('Create Job Error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL Jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await SeaImportJob.find()
      .populate('vesselId', 'code name')
      .populate('portDepartureId portDischargeId portOfLoadingId', 'code name')
      .populate(
        'originAgentId carrierId shipAgentId principleCustomerId localAgentId',
        'code name type'
      )
      .sort({ createdAt: -1 });

    res.json({ success: true, data: jobs });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE Job
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ sanitize updates
    const updates = sanitizeObjectIds(req.body);

    // Prevent changing jobNum or immutable _id
    delete updates.jobNum;
    delete updates._id;

    // Handle empty mblNumber for sparse index
    if (updates.mblNumber !== undefined && (!updates.mblNumber || updates.mblNumber.trim() === '')) {
      updates.mblNumber = null; // or undef
      delete updates.mblNumber;
      updates.$unset = { mblNumber: 1 };
    }

    // Validate MBL if changed
    if (updates.mblNumber) {
      const existing = await SeaImportJob.findOne({
        mblNumber: updates.mblNumber,
        _id: { $ne: id }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'MBL Number already in use'
        });
      }
    }

    const job = await SeaImportJob.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate([
      'vesselId',
      'portDepartureId',
      'portDischargeId',
      'portOfLoadingId',
      'originAgentId',
      'carrierId',
      'shipAgentId',
      'principleCustomerId',
      'localAgentId'
    ]);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: job,
      message: 'Job updated successfully'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};