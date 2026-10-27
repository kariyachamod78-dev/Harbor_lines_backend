// backend/controllers/airWaybillController.js
import AirWaybill from '../models/AirWaybill.js';

// Create new Air Waybill
export const createAirWaybill = async (req, res) => {
  try {
    const {
      jobId,
      jobNum,
      mawbNo,
      awbNo,
      awbDate,
      portDepartureCode,
      portDepartureName,
      airportDestinationCode,
      airportDestinationName,
      deliveryAgentCode,
      deliveryAgentName,
      shipperId,
      shipperName,
      consigneeId,
      consigneeName,
      issuingCarrierAgentId,
      issuingCarrierAgentName,
      revenueType,
      amountOfInsurance,
      flightNo,
      flightDate,
      salesmanId,
      salesmanName,
      noOfPieces,
      grossWeight,
      rateClass,
      commodityItemNo,
      chargeableWeight,
      rateOrCharge,
      total,
      totalNoOfPackages
    } = req.body;

    // Basic required fields validation
    if (!jobId || !awbNo || !awbDate || !noOfPieces || !grossWeight || !chargeableWeight || !total) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields (job, AWB No., AWB Date, pieces, weights, total)'
      });
    }

    const newAWB = await AirWaybill.create({
      jobId,
      jobNum,
      mawbNo,
      awbNo,
      awbDate,
      portDepartureCode,
      portDepartureName,
      airportDestinationCode,
      airportDestinationName,
      deliveryAgentCode,
      deliveryAgentName,
      shipperId,
      shipperName,
      consigneeId,
      consigneeName,
      issuingCarrierAgentId,
      issuingCarrierAgentName,
      revenueType,
      amountOfInsurance,
      flightNo,
      flightDate,
      salesmanId,
      salesmanName,
      noOfPieces,
      grossWeight,
      rateClass,
      commodityItemNo,
      chargeableWeight,
      rateOrCharge,
      total,
      totalNoOfPackages,
      createdBy: req.user?._id // if you have auth middleware
    });

    res.status(201).json({ success: true, data: newAWB });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Optional: Get all AWBs (useful for list/edit later)
export const getAllAirWaybills = async (req, res) => {
  try {
    const awbs = await AirWaybill.find()
      .populate('jobId', 'jobNum mawbNo')
      .populate('shipperId', 'name code')
      .populate('consigneeId', 'name code')
      .populate('issuingCarrierAgentId', 'name code')
      .populate('salesmanId', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: awbs.length, data: awbs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};