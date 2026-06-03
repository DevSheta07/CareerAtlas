const express = require('express');
const router = express.Router();
const {
  getHigherStudies,
  createHigherStudy,
  updateHigherStudy,
  deleteHigherStudy,
} = require('../controllers/higherStudyController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/higher-studies
// @desc    Get all higher studies records (with filters, search, pagination)
// @access  Private
router.get('/', auth, getHigherStudies);

// @route   POST /api/higher-studies
// @desc    Create a new higher studies record
// @access  Private/Admin
router.post('/', auth, roleCheck('admin'), createHigherStudy);

// @route   PUT /api/higher-studies/:id
// @desc    Update a higher studies record
// @access  Private/Admin
router.put('/:id', auth, roleCheck('admin'), updateHigherStudy);

// @route   DELETE /api/higher-studies/:id
// @desc    Delete a higher studies record
// @access  Private/Admin
router.delete('/:id', auth, roleCheck('admin'), deleteHigherStudy);

module.exports = router;
