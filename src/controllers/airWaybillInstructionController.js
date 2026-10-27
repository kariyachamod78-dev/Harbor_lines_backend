import AirWaybillInstruction from '../models/AirWaybillInstruction.js';
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create or update Air Waybill Instruction
export const createInstruction = async (req, res) => {
  try {
    const instruction = new AirWaybillInstruction(req.body);
    const savedInstruction = await instruction.save();
    res.status(201).json(savedInstruction);
  } catch (error) {
    console.error('Error creating Air Waybill Instruction:', error);
    res.status(500).json({ message: 'Error creating Air Waybill Instruction', error: error.message });
  }
};

// Get Instruction by ID
export const getInstructionById = async (req, res) => {
  try {
    const instruction = await AirWaybillInstruction.findById(req.params.id);
    if (!instruction) {
      return res.status(404).json({ message: 'Instruction not found' });
    }
    res.status(200).json(instruction);
  } catch (error) {
    console.error('Error fetching Air Waybill Instruction:', error);
    res.status(500).json({ message: 'Error fetching Air Waybill Instruction', error: error.message });
  }
};

// Get All Instructions
export const getAllInstructions = async (req, res) => {
  try {
    const instructions = await AirWaybillInstruction.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: instructions });
  } catch (error) {
    console.error('Error fetching Air Waybill Instructions:', error);
    res.status(500).json({ success: false, message: 'Error fetching Air Waybill Instructions', error: error.message });
  }
};

// Generate Air Waybill PDF
export const generateAWBPDF = async (req, res) => {
  try {
    const instruction = await AirWaybillInstruction.findById(req.params.id);
    if (!instruction) {
      return res.status(404).json({ message: 'Instruction not found' });
    }

    const templatePath = path.join(__dirname, '../../public/reports/AirWayBill/AirWayBill.pdf');
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ message: 'PDF template not found' });
    }

    const existingPdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // Helper to draw text
    const drawText = (text, xEm, yEm, size = 10, isBold = false) => {
      if (!text) return;
      const x = xEm * (width / 51);
      const y = height - (yEm * (height / 66));
      firstPage.drawText(String(text), {
        x,
        y,
        size,
        font: isBold ? boldFont : font,
        color: rgb(0, 0, 0),
      });
    };

    // Helper for multi-line text (explicit line breaks)
    const drawLines = (text, xEm, yEm, lineHeightEm = 1.2, size = 10, isBold = false) => {
      if (!text) return 0;
      const lines = String(text).split('\n');
      lines.forEach((line, i) => {
        drawText(line, xEm, yEm + (i * lineHeightEm), size, isBold);
      });
      return lines.length;
    };

    // Helper for wrapped multi-line text (automatic wrapping)
    const drawWrappedLines = (text, xEm, yEm, maxWidthEm, lineHeightEm = 1.2, size = 10, isBold = false) => {
      if (!text) return;
      const words = String(text).split(/\s+/);
      let lines = [];
      let currentLine = words[0];

      // Crude approximation: avg char width is ~half of font size
      const maxChars = (maxWidthEm * (width / 51)) / (size * 0.5);

      for (let i = 1; i < words.length; i++) {
        if ((currentLine + " " + words[i]).length < maxChars) {
          currentLine += " " + words[i];
        } else {
          lines.push(currentLine);
          currentLine = words[i];
        }
      }
      lines.push(currentLine);

      lines.forEach((line, i) => {
        drawText(line, xEm, yEm + (i * lineHeightEm), size, isBold);
      });
      return lines.length; // Return number of lines drawn
    };

    // Drawing fields (coordinates roughly based on HTML em values)
    
    // Shipper
    drawText(instruction.shipper.name, 5.7, 11.5, 10, true);
    const shipperAddrLines = drawWrappedLines(instruction.shipper.address, 5.7, 12.5, 15, 1.2, 9);
    if (instruction.shipper.contact) {
      drawText(`Contact: ${instruction.shipper.contact}`, 5.7, 12.5 + (shipperAddrLines * 1.2), 9);
    }

    // Consignee
    drawText(instruction.consignee.name, 26.8, 11.5, 10, true);
    const consigneeAddrLines = drawWrappedLines(instruction.consignee.address, 26.8, 12.5, 15, 1.2, 9);
    if (instruction.consignee.contactName) {
      drawText(`Contact: ${instruction.consignee.contactName}`, 26.8, 12.5 + (consigneeAddrLines * 1.2), 9);
    } 
    if (instruction.consignee.telNo) {
      drawText(`Tel: ${instruction.consignee.telNo}`, 26.8, 12.5 + (consigneeAddrLines * 1.2) + 1.2, 9);
    }

    // Notify Party (If exists)
    if (instruction.notifyParty && (instruction.notifyParty.name || instruction.notifyParty.address)) {
      drawText(instruction.notifyParty.name, 5.7, 23.5, 10, true);
      const notifyAddrLines = drawWrappedLines(instruction.notifyParty.address, 5.7, 24.5, 15, 1.2, 9);
      if (instruction.notifyParty.contactPersonName) {
        drawText(`Contact: ${instruction.notifyParty.contactPersonName}`, 5.7, 24.5 + (notifyAddrLines * 1.2), 9);
      }
      if (instruction.notifyParty.tel) {
        drawText(`Tel: ${instruction.notifyParty.tel}`, 5.7, 24.5 + (notifyAddrLines * 1.2) + 1.2, 9);
      }
    }

    // Dimensions (Section under Shipper)
    if (instruction.dimensions && instruction.dimensions.length > 0) {
      let dimY = 23.5;
      for (let i = 0; i < instruction.dimensions.length; i += 2) {
        const dim1 = instruction.dimensions[i];
        const dim2 = instruction.dimensions[i + 1] ? instruction.dimensions[i + 1] : '';
        const lineText = dim2 ? `${dim1}    ${dim2}` : dim1;
        drawText(lineText, 26.8, dimY, 10, false);
        dimY += 1.2;
      }
    }

    // Shipment Details (Table)
    if (instruction.shipmentDetails && instruction.shipmentDetails.length > 0) {
      let currentY = 40;
      instruction.shipmentDetails.forEach((detail) => {
        const marksLines = drawWrappedLines(detail.marksAndNumbers, 5.8, currentY, 10, 1.2, 9) || 1;
        drawText(detail.noOfPackages, 17, currentY, 10);
        const natureLines = drawLines(detail.natureAndQuantity, 22, currentY, 1.2, 8) || 1;
        drawText(detail.grossWeight ? `${detail.grossWeight} KGS` : "", 41.3, currentY, 9);

        const maxLines = Math.max(marksLines, natureLines);
        currentY += (maxLines * 1.2) + 0.5;
      });
    }

    const pdfBytes = await pdfDoc.save();

    res.contentType("application/pdf");
    if (req.query.download === 'true') {
      res.setHeader('Content-Disposition', `attachment; filename="AirWayBill_${instruction._id}.pdf"`);
    }
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error generating Air Waybill PDF:', error);
    res.status(500).json({ message: 'Error generating Air Waybill PDF', error: error.message });
  }
};
