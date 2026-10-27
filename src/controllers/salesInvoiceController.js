// backend/controllers/salesInvoiceController.js
import SalesInvoice from '../models/SalesInvoice.js';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createSalesInvoice = async (req, res) => {
  try {
    const invoiceData = req.body;

    // Optional: calculate total
    const total = invoiceData.invoiceLines?.reduce((sum, line) => sum + Number(line.netValue || 0), 0) || 0;
    invoiceData.totalAmount = total;

    const invoice = await SalesInvoice.create(invoiceData);

    res.status(201).json({
      success: true,
      data: invoice,
      message: 'Sales Invoice created successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllSalesInvoices = async (req, res) => {
  try {
    const invoices = await SalesInvoice.find()
      .populate('jobId')
      .populate('doId')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalesInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await SalesInvoice.findById(id)
      .populate('jobId')
      .populate('doId');
    if (!invoice) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateInvoicePDF = async (req, res) => {
  let browser;
  try {
    const { id } = req.params;
    const invoice = await SalesInvoice.findById(id).populate('jobId').populate('doId');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const templatePath = path.join(__dirname, '../../public/reports/SalesInvoiceReport/SALES_INVOICE_FORMAT.html');
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ success: false, message: 'PDF template not found' });
    }

    let html = fs.readFileSync(templatePath, 'utf8');

    // Inject data and bypass client-side fetch
    const injectData = `
      <script>
        window.INVOICE_DATA = ${JSON.stringify(invoice)};
        window.isPDFExport = true;
      </script>
    `;
    html = html.replace('<head>', `<head>${injectData}`);
    
    // Force the 'id' to be present so the script doesn't return early
    html = html.replace(
      /const id = urlParams\.get\('id'\);/g,
      `const id = "${id}";`
    );

    // Redirect fetch to use injected data
    html = html.replace(
      /fetch\('\/api\/sales-invoices\/getInvoice\/' \+ id\)/g,
      'Promise.resolve({ json: () => ({ success: true, data: window.INVOICE_DATA }), ok: true })'
    );

    // Hide print button in PDF
    html = html.replace('</STYLE>', '.noprint-btn { display: none !important; } </STYLE>');

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.setViewport({ width: 800, height: 1100 });
    
    await page.setContent(html, { 
      waitUntil: ['load', 'networkidle0'],
      timeout: 30000 
    });

    await page.waitForSelector('#val-totalValue', { timeout: 5000 });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '5mm', bottom: '5mm', left: '5mm', right: '5mm' },
      preferCSSPageSize: true
    });

    await browser.close();

    res.contentType("application/pdf");
    res.setHeader('Content-Disposition', `attachment; filename="Invoice_${invoice.invoiceNo || id}.pdf"`);
    res.send(pdf);
  } catch (error) {
    if (browser) await browser.close();
    console.error('PDF Generation Error:', error);
    res.status(500).json({ success: false, message: 'PDF Generation failed: ' + error.message });
  }
};