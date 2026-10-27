
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Report from '../models/Report.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      await Report.collection.dropIndex('reportId_1');
      console.log('Dropped index reportId_1');
    } catch (error) {
      console.log('Index reportId_1 might not exist or error dropping:', error.message);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
