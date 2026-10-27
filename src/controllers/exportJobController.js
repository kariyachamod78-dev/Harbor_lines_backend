// backend/controllers/exportJobController.js
import ExportJob from '../models/ExportJob.js';

// Get all export jobs
export const getAllExportJobs = async (req, res) => {
  try {
    const jobs = await ExportJob.find()
      .populate('shipperId', 'name code address telNo')
      .populate('consigneeId', 'name code address telNo')
      .populate('notifyPartyId', 'name code address telNo')
      .populate('vesselId', 'name code')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create new Export B/L
export const createExportJob = async (req, res) => {
  try {
    const {
      jobNum,
      blNumber,
      onBoardDate,
      deliveryApplyTo,
      shipperId,
      consigneeId,
      notifyPartyId,
      vesselId,
      voyage,
      portLoading,
      portDischarge,
      placeDelivery,
      freightPayableAt,
      numOriginalBLs,
      marksNumbers,
      containerSealNumbers,
      numPackages,
      uom,
      descriptionGoods,
      grossWeight,
      measurementCBM
    } = req.body;

    // Required fields validation
    if (!blNumber || !onBoardDate || !shipperId || !consigneeId || !vesselId || !voyage || !portLoading || !portDischarge) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: blNumber, onBoardDate, shipperId, consigneeId, vesselId, voyage, portLoading, portDischarge'
      });
    }

    // Auto-generate jobNum if not provided
    let finalJobNum = jobNum;
    if (!finalJobNum) {
      const count = await ExportJob.countDocuments();
      const year = new Date().getFullYear();
      finalJobNum = `EXP-${year}-${String(count + 1).padStart(4, '0')}`;
    }

    const newJob = await ExportJob.create({
      jobNum: finalJobNum,
      blNumber,
      onBoardDate,
      deliveryApplyTo,
      shipperId,
      consigneeId,
      notifyPartyId,
      vesselId,
      voyage,
      portLoading,
      portDischarge,
      placeDelivery,
      freightPayableAt,
      numOriginalBLs: numOriginalBLs || 3,
      marksNumbers,
      containerSealNumbers,
      numPackages,
      uom,
      descriptionGoods,
      grossWeight,
      measurementCBM,
      createdBy: req.user?._id || null   // if you have auth middleware
    });

    res.status(201).json({ success: true, data: newJob });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update Export B/L
export const updateExportJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.jobNum;

    const updatedJob = await ExportJob.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ success: false, message: 'Export Job not found' });
    }

    res.json({ success: true, data: updatedJob, message: 'Export B/L updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};