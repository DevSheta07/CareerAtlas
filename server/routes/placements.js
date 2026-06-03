const express = require('express');
const router = express.Router();
const {
  getPlacements,
  createPlacement,
  updatePlacement,
  deletePlacement,
} = require('../controllers/placementController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/placements
// @desc    Get all placement records (with filters, search, pagination)
// @access  Private
router.get('/', auth, getPlacements);

// @route   POST /api/placements
// @desc    Create a new placement record
// @access  Private/Admin
router.post('/', auth, roleCheck('admin'), createPlacement);

// @route   PUT /api/placements/:id
// @desc    Update a placement record
// @access  Private/Admin
router.put('/:id', auth, roleCheck('admin'), updatePlacement);

// @route   DELETE /api/placements/:id
// @desc    Delete a placement record
// @access  Private/Admin
router.delete('/:id', auth, roleCheck('admin'), deletePlacement);

module.exports = router;
