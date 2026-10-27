import DeliveryOrder from '../models/DeliveryOrder.js';
import puppeteer from 'puppeteer';

// 🔧 Generate DO Number (Option 2)
const generateDONumber = async () => {
  const year = new Date().getFullYear();

  const lastDO = await DeliveryOrder.findOne({
    doNum: { $regex: `^DO-${year}-` }
  }).sort({ doNum: -1 });

  let nextNumber = 1;

  if (lastDO) {
    const lastNum = parseInt(lastDO.doNum.split('-')[2]);
    nextNumber = lastNum + 1;
  }

  return `DO-${year}-${String(nextNumber).padStart(6, '0')}`;
};

// CREATE
export const createDeliveryOrder = async (req, res) => {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const doData = { ...req.body };

      // ❌ Prevent frontend from sending doNum
      delete doData.doNum;

      // ✅ Generate DO number
      const newDONum = await generateDONumber();
      doData.doNum = newDONum;

      const deliveryOrder = await DeliveryOrder.create(doData);

      return res.status(201).json({
        success: true,
        data: deliveryOrder,
        message: 'Delivery Order created successfully'
      });

    } catch (error) {
      // Handle MongoDB Duplicate Key Error (Code 11000) for doNum
      if (error.code === 11000 && error.keyPattern && error.keyPattern.doNum) {
        attempts++;
        console.warn(`Duplicate doNum detected. Retrying... (Attempt ${attempts}/${maxAttempts})`);
        if (attempts < maxAttempts) {
          continue; // Retry with a new number
        }
      }

      console.error('Create DO Error:', error);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

// GET ONE
export const getDeliveryOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryOrder = await DeliveryOrder.findById(id)
      .populate('jobId')
      .populate('portOfLoadingId')
      .populate('originAgentId')
      .populate('carrierId')
      .populate('consigneeId')
      .populate('shipperId')
      .populate('notifyPartyId')
      .populate('salesmanId');

    if (!deliveryOrder) {
      return res.status(404).json({
        success: false,
        message: 'Not found'
      });
    }

    res.json({ success: true, data: deliveryOrder });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadDeliveryOrder = async (req, res) => {
  const { id } = req.params;
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const reportUrl = `${protocol}://${host}/reports/format/index.html?id=${id}&printAll=true`;

    console.log(`Generating PDF from: ${reportUrl}`);

    await page.goto(reportUrl, { waitUntil: 'networkidle0', timeout: 60000 });

    await page.waitForSelector('#app', { timeout: 10000 });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    await browser.close();

    // Get doNum for filename if possible
    const doItem = await DeliveryOrder.findById(id);
    const filename = doItem ? `${doItem.doNum}.pdf` : `DO-${id}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    if (browser) await browser.close();
    res.status(500).json({ success: false, message: 'Failed to generate PDF: ' + error.message });
  }
};

// GET ALL
export const getAllDeliveryOrders = async (req, res) => {
  try {
    const dos = await DeliveryOrder.find()
      .populate('jobId', 'vesselName')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: dos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
export const updateDeliveryOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.doNum;
    delete updateData.agentDoNo;
    const updatedDO = await DeliveryOrder.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedDO) {
      return res.status(404).json({ success: false, message: 'Delivery Order not found' });
    }
    res.json({ success: true, data: updatedDO, message: 'Delivery Order updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE
export const deleteDeliveryOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDO = await DeliveryOrder.findByIdAndDelete(id);
    if (!deletedDO) {
      return res.status(404).json({ success: false, message: 'Delivery Order not found' });
    }
    res.json({ success: true, message: 'Delivery Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
