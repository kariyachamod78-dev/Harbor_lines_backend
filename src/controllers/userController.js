// backend/controllers/userController.js
import User from '../models/User.js';

export const createUser = async (req, res) => {
  try {
    const { code, username, password, role } = req.body;

    const trimmedCode = code?.trim().toUpperCase();
    const trimmedUsername = username?.trim();
    const trimmedPassword = password?.trim();

    if (!trimmedCode || !trimmedUsername || !trimmedPassword) {
      return res.status(400).json({ success: false, message: 'Code, Username, and Password are required' });
    }

    // Check duplicate code
    const codeExists = await User.findOne({ code: trimmedCode });
    if (codeExists) {
      return res.status(400).json({ success: false, message: 'User Code already exists' });
    }

    // Check duplicate username
    const usernameExists = await User.findOne({ username: trimmedUsername });
    if (usernameExists) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const user = await User.create({
      code: trimmedCode,
      username: trimmedUsername,
      password: trimmedPassword,
      role: role || 'Admin'
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        code: user.code,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      },
      message: 'User created successfully as Admin'
    });
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to create user' });
  }
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, isActive, role } = req.body;

    const trimmedUsername = username?.trim();

    if (!trimmedUsername) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }

    const usernameExists = await User.findOne({ 
      username: trimmedUsername, 
      _id: { $ne: id } 
    });
    if (usernameExists) {
      return res.status(400).json({ success: false, message: 'Username already in use by another user' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { username: trimmedUsername, isActive, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to update user' });
  }
};