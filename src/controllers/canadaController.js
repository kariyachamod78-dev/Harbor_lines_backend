// backend/controllers/canadaController.js
import mongoose from 'mongoose';
import CanadaHBL from '../models/CanadaHBL.js';
import CanadaVesselSchema from '../models/CanadaVessel.js';
import CanadaPortSchema from '../models/CanadaPort.js';

// Connect to different DB
const canadaDB = mongoose.connection.useDb('canada_client'); // New DB name in same instance

const HLManifest = canadaDB.model('HLManifest', CanadaHBL.schema); // Use model on new DB
const CanadaVessel = canadaDB.model('CanadaVessel', CanadaVesselSchema); // New Vessel model for Canada
const CanadaPort = canadaDB.model('CanadaPort', CanadaPortSchema); // New Port model for Canada

// Vessel Management
export const searchVessels = async (req, res) => {
  try {
    const { query } = req.query;
    const vessels = await CanadaVessel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);
    res.json({ success: true, data: vessels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createVessel = async (req, res) => {
  try {
    const { name, code } = req.body;
    const newVessel = await CanadaVessel.create({ name, code });
    res.status(201).json({ success: true, data: newVessel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Port Management
export const searchPorts = async (req, res) => {
  try {
    const { query } = req.query;
    const ports = await CanadaPort.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);
    res.json({ success: true, data: ports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createPort = async (req, res) => {
  try {
    const { name, code } = req.body;
    const newPort = await CanadaPort.create({ name, code });
    res.status(201).json({ success: true, data: newPort });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create new manifest
export const createManifest = async (req, res) => {
  try {
    const { hbls } = req.body;

    if (!hbls || !Array.isArray(hbls)) {
      return res.status(400).json({ success: false, message: 'Invalid manifest data: hbls array is required' });
    }

    // Calculate totals
    let totalWeight = 0;
    let totalCBM = 0;

    hbls.forEach(hbl => {
      if (hbl.references && Array.isArray(hbl.references)) {
        hbl.references.forEach(ref => {
          totalWeight += Number(ref.weight) || 0;
          totalCBM += Number(ref.cbm) || 0;
        });
      }
    });

    const newManifest = await HLManifest.create({
      hbls,
      totalWeight,
      totalCBM
    });

    res.status(201).json({ success: true, data: newManifest });
  } catch (err) {
    console.error('Create Manifest Error:', err);
    res.status(500).json({ success: false, message: 'Backend Error: ' + err.message });
  }
};

// Get all manifests (optional for list/view)
export const getAllManifests = async (req, res) => {
  try {
    const manifests = await HLManifest.find().sort({ createdAt: -1 });
    res.json({ success: true, data: manifests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update charges for a specific HBL in a manifest
export const updateHBLCharges = async (req, res) => {
  try {
    const { manifestId, hblNumber } = req.params;
    const { references } = req.body; // Array of references with charges

    const manifest = await HLManifest.findById(manifestId);
    if (!manifest) {
      return res.status(404).json({ success: false, message: 'Manifest not found' });
    }

    // Find the HBL in the manifest
    const hbl = manifest.hbls.find(h => h.hblNumber === hblNumber);
    if (!hbl) {
      return res.status(404).json({ success: false, message: 'HBL not found in manifest' });
    }

    // Update charges for each reference
    references.forEach(updatedRef => {
      const ref = hbl.references.find(r => r.refNum === updatedRef.refNum);
      if (ref && updatedRef.charges) {
        ref.charges = updatedRef.charges;
      }
    });

    await manifest.save();

    res.json({ success: true, message: 'HBL charges updated successfully', data: manifest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update a full HBL in a manifest (including references and all fields)
export const updateHBL = async (req, res) => {
  try {
    const { manifestId, hblId } = req.params;
    const updatedHBLData = req.body; // Full HBL object

    const manifest = await HLManifest.findById(manifestId);
    if (!manifest) {
      return res.status(404).json({ success: false, message: 'Manifest not found' });
    }

    // Find and update the specific HBL
    const hblIndex = manifest.hbls.findIndex(h => h._id.toString() === hblId);
    if (hblIndex === -1) {
      return res.status(404).json({ success: false, message: 'HBL not found in manifest' });
    }

    // Merge/Replace the HBL data
    manifest.hbls[hblIndex] = { ...manifest.hbls[hblIndex].toObject(), ...updatedHBLData };

    // Recalculate manifest totals
    let totalWeight = 0;
    let totalCBM = 0;
    manifest.hbls.forEach(h => {
      h.references.forEach(ref => {
        totalWeight += ref.weight || 0;
        totalCBM += ref.cbm || 0;
      });
    });
    manifest.totalWeight = totalWeight;
    manifest.totalCBM = totalCBM;

    await manifest.save();

    res.json({ success: true, message: 'HBL updated and totals recalculated', data: manifest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};