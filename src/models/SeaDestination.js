import mongoose from 'mongoose';

const seaDestinationSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    unique: true,
    maxlength: 10
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('SeaDestination', seaDestinationSchema);
