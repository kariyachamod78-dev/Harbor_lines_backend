import mongoose from 'mongoose';
import canadaBillingSchema from '../models/CanadaBilling.js';
import CanadaHBL from '../models/CanadaHBL.js';
import refBillingSchema from '../models/RefBilling.js';

// Connect to different DB for Canada client to get Manifest details
const canadaDB = mongoose.connection.useDb('canada_client');
const HLManifest = canadaDB.model('HLManifest', CanadaHBL.schema);

// Use default connection (HarborLines DB)
const CanadaBilling = mongoose.model('CanadaBilling', canadaBillingSchema);
const CanadaRefBilling = mongoose.model('CanadaRefBilling', refBillingSchema);

export const createCanadaBilling = async (req, res) => {
  try {
    const payload = req.body;
    
    if (!payload.manifestId || !payload.totals) {
      return res.status(400).json({ success: false, message: 'Invalid billing data' });
    }

    // Check for existing record
    const existing = await CanadaBilling.findOne({ manifestId: payload.manifestId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A billing record already exists for this manifest' });
    }

    const newBilling = await CanadaBilling.create(payload);

    res.status(201).json({ success: true, data: newBilling });
  } catch (err) {
    console.error('Create Canada Billing Error:', err);
    res.status(500).json({ success: false, message: 'Backend Error: ' + err.message });
  }
};

export const getCanadaBillings = async (req, res) => {
  try {
    const billings = await CanadaBilling.find().sort({ calculatedAt: -1 });
    res.json({ success: true, data: billings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCanadaBillingById = async (req, res) => {
  try {
    const { id } = req.params;
    const billing = await CanadaBilling.findById(id);
    
    if (!billing) {
      return res.status(404).json({ success: false, message: 'Billing record not found' });
    }

    // Fetch associated manifest from canada_client DB
    const manifest = await HLManifest.findById(billing.manifestId);

    // Fetch saved reference-level details (if any)
    const savedDetails = await CanadaRefBilling.findOne({ jobNum: billing.manifestNum });

    res.json({ success: true, billing, manifest, savedDetails });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveConsigneeBillings = async (req, res) => {
  try {
    const { billingId, manifestId, jobNum, references } = req.body;

    if (!jobNum || !Array.isArray(references)) {
      return res.status(400).json({ success: false, message: 'Invalid payload: jobNum and references are required' });
    }

    // Save as a single document per JobNum with references array
    await CanadaRefBilling.findOneAndUpdate(
      { jobNum },
      { 
        billingId,
        manifestId,
        references 
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Detailed records saved successfully' });
  } catch (err) {
    console.error('Save Consignee Billings Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
