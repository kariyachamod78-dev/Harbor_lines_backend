import Tax from '../models/Tax.js'

// CREATE Tax
export const createTax = async (req, res) => {
  try {
    const { code, name, rate, priority } = req.body;

    if (!code || !name || rate === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Tax Code, Name and Rate are required'
      });
    }

    // Check duplicate code
    const existing = await Tax.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Tax code already exists'
      });
    }

    const tax = new Tax({
      ...req.body,
      code: code.toUpperCase(),
      priority: parseInt(priority) || 1
    });

    await tax.save();

    res.status(201).json({
      success: true,
      data: tax,
      message: 'Tax created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL Taxes
export const getAllTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find().sort({ priority: 1, createdAt: -1 });
    res.json({
      success: true,
      data: taxes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE Tax
export const updateTax = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.code) {
      updates.code = updates.code.toUpperCase();
      const existing = await Tax.findOne({
        code: updates.code,
        _id: { $ne: id }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Tax code already used by another tax'
        });
      }
    }

    if (updates.priority) {
      updates.priority = parseInt(updates.priority);
    }

    const tax = await Tax.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!tax) {
      return res.status(404).json({
        success: false,
        message: 'Tax not found'
      });
    }

    res.json({
      success: true,
      data: tax,
      message: 'Tax updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE Tax (optional)
export const deleteTax = async (req, res) => {
  try {
    const { id } = req.params;
    const tax = await Tax.findByIdAndDelete(id);
    if (!tax) {
      return res.status(404).json({ success: false, message: 'Tax not found' });
    }
    res.json({ success: true, message: 'Tax deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};