const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Placement = require('../models/Placement');
const HigherStudy = require('../models/HigherStudy');

// Helper: generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user (admin only — auto-approved)
// @route   POST /api/auth/register
// @access  Private/Admin (enforced at route level)
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Admin-created users are auto-approved
    const user = await User.create({ name, email, password, role, isApproved: true });

    // Generate token
    const token = generateToken(user);

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json({
      success: true,
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

// @desc    Public signup — creates an unapproved account
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, password, phone, enrollmentNo } = req.body;

    if (!name || !email || !password || !phone || !enrollmentNo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, phone number, and enrollment number',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Check if enrollment number is already in use in User or Student
    const existingUserEnroll = await User.findOne({ enrollmentNo });
    const existingStudentEnroll = await Student.findOne({ enrollmentNo });
    if (existingUserEnroll || existingStudentEnroll) {
      return res.status(400).json({
        success: false,
        message: 'A user or student with this enrollment number already exists',
      });
    }

    // Create user — isApproved defaults to false
    const user = await User.create({ name, email, password, phone, enrollmentNo, role: 'student' });

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please wait for admin approval before logging in.',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          enrollmentNo: user.enrollmentNo,
          role: user.role,
          isApproved: user.isApproved,
        },
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: error.message,
    });
  }
};

// @desc    Login user & return token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Compare password using model method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if account is approved
    if (!user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. Please try again later.',
      });
    }

    // Generate token
    const token = generateToken(user);

    // Return user info without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile',
      error: error.message,
    });
  }
};

// @desc    Get all pending (unapproved) users (admin only)
// @route   GET /api/auth/pending-users
// @access  Private/Admin
const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false }).select('-password').sort('-createdAt');
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching pending users',
      error: error.message,
    });
  }
};

// @desc    Approve a pending user (admin only)
// @route   PUT /api/auth/approve-user/:id
// @access  Private/Admin
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isApproved = true;
    await user.save();

    // If role is student, auto-create Student record if it doesn't exist
    if (user.role === 'student') {
      const existingStudent = await Student.findOne({ email: user.email });
      if (!existingStudent) {
        const targetEnrollmentNo = user.enrollmentNo || `TEMP-${Date.now()}`;
        await Student.create({
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          enrollmentNo: targetEnrollmentNo,
          branch: 'CSE', // Default branch
          batch: new Date().getFullYear().toString(), // Default batch
          status: 'unplaced',
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'User approved successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error approving user',
      error: error.message,
    });
  }
};

// @desc    Reject/Delete a pending user request (admin only)
// @route   DELETE /api/auth/reject-user/:id
// @access  Private/Admin
const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reject an already approved user account',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User request rejected and account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error rejecting user request',
      error: error.message,
    });
  }
};

// @desc    Get all approved students (admin only)
// @route   GET /api/auth/approved-students
// @access  Private/Admin
const getApprovedStudents = async (req, res) => {
  try {
    const users = await User.find({ isApproved: true, role: 'student' }).select('-password').sort('-createdAt');
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching approved students',
      error: error.message,
    });
  }
};

// @desc    Admin reset user password (admin only)
// @route   PUT /api/auth/reset-password/:id
// @access  Private/Admin
const adminResetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a password of at least 6 characters',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Set new password (which gets hashed by userSchema pre-save hook)
    user.password = password;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error resetting password',
      error: error.message,
    });
  }
};

// @desc    Delete/Revoke user account (admin only)
// @route   DELETE /api/auth/delete-user/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Don't let an admin delete themselves (optional precaution)
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot delete their own account',
      });
    }

    // Cascade delete associated Student and related records if role is student
    if (user.role === 'student') {
      const student = await Student.findOne({ email: user.email });
      if (student) {
        // Delete related placement and higher study records
        await Placement.deleteMany({ studentId: student._id });
        await HigherStudy.deleteMany({ studentId: student._id });

        // Delete the student document
        await Student.findByIdAndDelete(student._id);
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting user account',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  signup,
  login,
  getMe,
  getPendingUsers,
  approveUser,
  rejectUser,
  getApprovedStudents,
  adminResetPassword,
  deleteUser,
};
