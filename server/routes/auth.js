const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/authController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   POST /api/auth/signup
// @desc    Public signup (account needs admin approval)
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/register
// @desc    Register a new user (admin only, auto-approved)
// @access  Private/Admin
router.post('/register', auth, roleCheck('admin'), register);

// @route   POST /api/auth/login
// @desc    Login user & return JWT token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
router.get('/me', auth, getMe);

// @route   GET /api/auth/pending-users
// @desc    Get all pending (unapproved) users (admin only)
// @access  Private/Admin
router.get('/pending-users', auth, roleCheck('admin'), getPendingUsers);

// @route   PUT /api/auth/approve-user/:id
// @desc    Approve a pending user (admin only)
// @access  Private/Admin
router.put('/approve-user/:id', auth, roleCheck('admin'), approveUser);

// @route   DELETE /api/auth/reject-user/:id
// @desc    Reject/delete a pending user request (admin only)
// @access  Private/Admin
router.delete('/reject-user/:id', auth, roleCheck('admin'), rejectUser);

// @route   GET /api/auth/approved-students
// @desc    Get all approved students (admin only)
// @access  Private/Admin
router.get('/approved-students', auth, roleCheck('admin'), getApprovedStudents);

// @route   PUT /api/auth/reset-password/:id
// @desc    Reset student password (admin only)
// @access  Private/Admin
router.put('/reset-password/:id', auth, roleCheck('admin'), adminResetPassword);

// @route   DELETE /api/auth/delete-user/:id
// @desc    Delete approved/registered student account (admin only)
// @access  Private/Admin
router.delete('/delete-user/:id', auth, roleCheck('admin'), deleteUser);

module.exports = router;
