import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register new admin (use once or protect later)
// @route   POST /api/auth/register
export const registerAdmin = async (req, res) => {
  const { username, password, role } = req.body;

  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    username,
    password,
    role: role || 'Admin'
  });

  if (user) {
    const token = generateToken(user._id);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'Admin created successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    user: {
      id: user._id,
      username: user.username,
      role: user.role
    }
  });
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user });
};