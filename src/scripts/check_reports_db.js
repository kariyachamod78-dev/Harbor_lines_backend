
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Report from '../models/Report.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const reports = await Report.find({});
    console.log('Reports in DB:', reports);
    
    // Check indexes
    const indexes = await Report.collection.indexes();
    console.log('Indexes:', indexes);

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
