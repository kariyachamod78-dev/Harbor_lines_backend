import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  if (req.originalUrl.includes('/api/sales-invoices/createInvoice') || 
      req.originalUrl.includes('/api/customersuppliers/getAllCustomerSuppliers') ||
      req.originalUrl.includes('/api/vessels/getAllVessels') ||
      req.originalUrl.includes('/api/sales-invoices/generatePDF')) {
    return next();
  }

  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};