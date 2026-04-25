const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); 
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users..',
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required!',
      });
    }

    const user = await User.create({ name, email });

    res.status(201).json({
      success: true,
      message: 'User created successfully!',
      data: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists!',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating user..',
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully!',
      data: user,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format!',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting user..',
      error: error.message,
    });
  }
};

module.exports = { getAllUsers, createUser, deleteUser };