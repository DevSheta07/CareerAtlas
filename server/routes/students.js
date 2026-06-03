const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  updateStudentProfile,
} = require('../controllers/studentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/students
// @desc    Get all students (with filters, search, pagination)
// @access  Private
router.get('/', auth, getStudents);

// @route   GET /api/students/profile/me
// @desc    Get current student profile
// @access  Private
router.get('/profile/me', auth, getStudentProfile);

// @route   PUT /api/students/profile/me
// @desc    Update current student profile
// @access  Private
router.put('/profile/me', auth, updateStudentProfile);

// @route   GET /api/students/:id
// @desc    Get single student by ID
// @access  Private
router.get('/:id', auth, getStudent);


// @route   POST /api/students
// @desc    Create a new student
// @access  Private/Admin
router.post('/', auth, roleCheck('admin'), createStudent);

// @route   PUT /api/students/:id
// @desc    Update a student
// @access  Private/Admin
router.put('/:id', auth, roleCheck('admin'), updateStudent);

// @route   DELETE /api/students/:id
// @desc    Delete a student
// @access  Private/Admin
router.delete('/:id', auth, roleCheck('admin'), deleteStudent);

module.exports = router;
