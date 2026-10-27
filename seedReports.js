
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Report from './src/models/Report.js';

dotenv.config();

const reports = [
  {
    name: 'Manifest Report',
    code: 'MANIFEST_REPORT',
    filename: 'ManifestReport/MANIFEST_REPORT.html',
    description: 'Sea Import Manifest Report'
  },
  {
    name: 'Canada Manifest',
    code: 'CANADA_MANIFEST',
    filename: 'CanadaInvoice/CanadaManifest.html',
    description: 'Canada Manifest Report'
  },
  {
    name: 'Sales Invoice',
    code: 'SALES_INVOICE',
    filename: 'SalesInvoiceReport/SALES_INVOICE_FORMAT.html',
    description: 'Sales Invoice Format'
  },
  {
    name: 'Export Report',
    code: 'EXPORT_REPORT',
    filename: 'Export/Export_Report.pdf',
    description: 'Export Report PDF'
  },
  {
    name: 'Delivery Order Format',
    code: 'DELIVERY_ORDER_FORMAT',
    filename: 'format/index.html', 
    description: 'Delivery Order Format Base'
  }
];

const seedReports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        for (const report of reports) {
            await Report.updateOne(
                { code: report.code },
                { $set: report },
                { upsert: true }
            );
            console.log(`Seeded report ${report.code}`);
        }

        console.log('Reports seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding reports:', error);
        process.exit(1);
    }
};

seedReports();
