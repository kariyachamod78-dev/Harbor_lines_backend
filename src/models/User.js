// backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    minlength: 3,
    maxlength: 20
  },
  username: {  
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  role: {
    type: String,
    enum: ['Admin', 'Supervisor', 'Power User', 'Import Manager', 'Operations Executive', 'Operations Manager', 'Client'],
    default: 'Admin'  
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);