
import Report from '../models/Report.js';
import path from 'path';

// Get report URL by code
export const getReportUrl = async (req, res) => {
  try {
    const { code } = req.params;
    
    // Find report by code
    const report = await Report.findOne({ code });
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    
    // Construct URL
    // Assumes reports are served from /reports static route
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const reportUrl = `${baseUrl}/reports/${report.filename}`;
    
    res.status(200).json({
      success: true,
      data: {
        url: reportUrl,
        name: report.name,
        filename: report.filename
      }
    });
    
  } catch (error) {
    console.error('Error fetching report URL:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching report URL'
    });
  }
};

// List all reports (optional helper)
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({});
    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching reports'
    });
  }
};
