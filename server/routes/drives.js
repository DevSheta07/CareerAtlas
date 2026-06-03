const express = require('express');
const router = express.Router();
const {
  getDrives,
  createDrive,
  updateDrive,
  deleteDrive,
} = require('../controllers/driveController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/drives
// @desc    Get all placement drives (with filters, search, pagination)
// @access  Private
router.get('/', auth, getDrives);

// @route   POST /api/drives
// @desc    Create a new placement drive
// @access  Private/Admin
router.post('/', auth, roleCheck('admin'), createDrive);

// @route   PUT /api/drives/:id
// @desc    Update a placement drive
// @access  Private/Admin
router.put('/:id', auth, roleCheck('admin'), updateDrive);

// @route   DELETE /api/drives/:id
// @desc    Delete a placement drive
// @access  Private/Admin
router.delete('/:id', auth, roleCheck('admin'), deleteDrive);

module.exports = router;
