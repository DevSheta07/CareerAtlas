const express = require('express');
const router = express.Router();
const {
  getStats,
  getCompanyStats,
  getBranchStats,
} = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get overall placement statistics
// @access  Private
router.get('/stats', auth, getStats);

// @route   GET /api/dashboard/company-stats
// @desc    Get company-wise placement statistics
// @access  Private
router.get('/company-stats', auth, getCompanyStats);

// @route   GET /api/dashboard/branch-stats
// @desc    Get branch-wise placement statistics
// @access  Private
router.get('/branch-stats', auth, getBranchStats);

module.exports = router;
