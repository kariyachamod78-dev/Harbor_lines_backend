// backend/controllers/manifestInvoiceController.js
import ManifestInvoice from '../models/ManifestInvoice.js';
import BLManifestJob from '../models/BLManifestJob.js';
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fetch manifest entry by booking number (across all jobs)
export const getManifestEntryByBookingNum = async (req, res) => {
  try {
    const { bookingNum } = req.params;
    
    // Find job that contains the entry with matching bookingNum
    const job = await BLManifestJob.findOne({ 'entries.bookingNum': bookingNum });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Booking not found in manifest entries' });
    }
    
    const entry = job.entries.find(e => e.bookingNum === bookingNum);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    
    // Enrich with job level info if needed (like createdAt)
    res.json({
      success: true,
      data: {
        ...entry.toObject(),
        createdAt: job.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching manifest entry by booking number:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Create a new Manifest Invoice
export const createManifestInvoice = async (req, res) => {
  try {
    const { bookingNumber, date, consignee, charges, bank } = req.body;
    
    if (!bookingNumber) {
      return res.status(400).json({ success: false, message: 'Booking number is required' });
    }
    if (!bank) {
      return res.status(400).json({ success: false, message: 'Bank selection is required' });
    }
    
    const newInvoice = new ManifestInvoice({
      bookingNumber,
      date: date || new Date(),
      consignee,
      charges,
      bank
    });
    
    const savedInvoice = await newInvoice.save();
    
    res.status(201).json({
      success: true,
      data: savedInvoice,
      message: 'Manifest Invoice saved successfully'
    });
  } catch (error) {
    console.error('Error creating Manifest Invoice:', error);
    res.status(500).json({ success: false, message: 'Error saving Manifest Invoice', error: error.message });
  }
};

// Generate Manifest Invoice PDF using pdf-lib and templates
export const generateManifestInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the saved invoice
    const invoice = await ManifestInvoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Manifest Invoice not found' });
    }
    
    // Select the correct template based on selected bank
    const isUnionBank = String(invoice.bank).toLowerCase().includes('union');
    const templateFileName = isUnionBank ? 'Union_bank.pdf' : 'NTB.pdf';
    
    const templatePath = path.join(__dirname, '../../public/reports/ManifestInvoice', templateFileName);
    
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ success: false, message: `PDF template not found at ${templatePath}` });
    }
    
    const existingPdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const pages = pdfDoc.getPages();
    const page = pages[0];
    const { width, height } = page.getSize();
    
    // Helper to draw text
    const drawText = (text, x, y, size = 10, isBold = false) => {
      if (!text) return;
      page.drawText(String(text), {
        x,
        y,
        size,
        font: isBold ? boldFont : font,
        color: rgb(0.1, 0.1, 0.1),
      });
    };
    
    // Helper to draw right-aligned text
    const drawTextRight = (text, rightX, y, size = 10, isBold = false) => {
      if (!text) return;
      const textString = String(text);
      const activeFont = isBold ? boldFont : font;
      const textWidth = activeFont.widthOfTextAtSize(textString, size);
      page.drawText(textString, {
        x: rightX - textWidth,
        y,
        size,
        font: activeFont,
        color: rgb(0.1, 0.1, 0.1),
      });
    };

    // Helper for wrapping lines
    const drawWrappedText = (text, x, startY, maxWidth, size = 9, lineHeight = 12) => {
      if (!text) return startY;
      const words = String(text).split(/\s+/);
      let lines = [];
      let currentLine = words[0] || '';
      
      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const testWidth = font.widthOfTextAtSize(testLine, size);
        if (testWidth < maxWidth) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = words[i];
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
      
      let currentY = startY;
      lines.forEach(line => {
        drawText(line, x, currentY, size);
        currentY -= lineHeight;
      });
      return currentY;
    };
    
    // Print Invoice Metadata (Top Right Area)
    const metadataY = 650;
    // drawText(`Invoice No: INV-${invoice.bookingNumber}`, 400, metadataY - 18, 9);
    drawText(`${invoice.bookingNumber}`, 503, metadataY - 10, 12);
    const invoiceDate = new Date(invoice.date).toLocaleDateString();
    drawText(`${invoiceDate}`, 483, metadataY + 28, 12);
    
    // Print Consignee Details (Top Left Area)
    const consigneeY = 690;
    drawText(invoice.consignee.name || 'N/A', 60, consigneeY - 18, 12);
    
    // Draw wrapped address in 2 lines
    let addressLines = [];
    const addressStr = invoice.consignee.address || 'N/A';
    const parts = addressStr.split(',').map(p => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      addressLines.push(parts[0]);
      addressLines.push(parts.slice(1).join(', '));
    } else {
      addressLines.push(addressStr);
    }
    
    let nextY = consigneeY - 32;
    addressLines.forEach(line => {
      drawText(line, 60, nextY, 10);
      nextY -= 13;
    });
    
    if (invoice.consignee.phone) {
      drawText(`${invoice.consignee.phone}`, 60, nextY - 3, 10);
    }
    
    // Draw Charges Table
    // Table Header starts at y = 480
    const tableHeaderY = 580;
    
    
    let currentY = tableHeaderY - 24;
    let totalLKR = 0;
    
    if (invoice.charges && invoice.charges.length > 0) {
      invoice.charges.forEach((charge, index) => {
        // const serial = String(index + 1);
        const name = charge.name || 'Custom Charge';
        const amountNum = parseFloat(charge.amount) || 0;
        totalLKR += amountNum;
        
        const amountStr = amountNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        // drawText(serial, 65, currentY, 9);
        drawText(name, 60, currentY, 11);
        drawText(charge.units || '', 342, currentY, 10);
        drawTextRight(amountStr, 450, currentY, 10);
        drawTextRight(amountStr, 530, currentY, 10);
        
        currentY -= 20;
      });
    } else {
      drawText('No charges added', 110, currentY, 9);
      currentY -= 20;
    }
    
    // // Draw a line under the table entries
    // page.drawLine({
    //   start: { x: 60, y: currentY + 10 },
    //   end: { x: 530, y: currentY + 10 },
    //   thickness: 1,
    //   color: rgb(0.7, 0.7, 0.7)
    // });
    
    // Draw Total Amount LKR
    const totalStr = totalLKR.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    drawTextRight(totalStr, 530, currentY - 125, 12, true);
    
    // // Draw a double line or bold line under the total
    // page.drawLine({
    //   start: { x: 60, y: currentY - 12 },
    //   end: { x: 530, y: currentY - 12 },
    //   thickness: 1.5,
    //   color: rgb(0.2, 0.2, 0.2)
    // });
    
    // Bank info display footer notes (in case the background doesn't clearly mention it)
    const footerY = 150;
    
    const pdfBytes = await pdfDoc.save();
    
    res.contentType("application/pdf");
    res.setHeader('Content-Disposition', `attachment; filename="ManifestInvoice_${invoice.bookingNumber}.pdf"`);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error generating Manifest Invoice PDF:', error);
    res.status(500).json({ success: false, message: 'Error generating PDF', error: error.message });
  }
};
