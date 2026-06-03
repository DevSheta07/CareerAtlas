const Drive = require('../models/PlacementDrive');

// @desc    Get all drives with filters and pagination
// @route   GET /api/drives
// @access  Private
const getDrives = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const totalDrives = await Drive.countDocuments(filter);
    const totalPages = Math.ceil(totalDrives / limit);

    const drives = await Drive.find(filter)
      .sort({ deadline: 1 }) // Sort by deadline ascending (nearest first)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        drives,
        page,
        totalPages,
        totalDrives,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching drives',
      error: error.message,
    });
  }
};

// @desc    Create a new drive
// @route   POST /api/drives
// @access  Private
const createDrive = async (req, res) => {
  try {
    const drive = await Drive.create(req.body);

    res.status(201).json({
      success: true,
      data: drive,
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
      message: 'Server error creating drive',
      error: error.message,
    });
  }
};

// @desc    Update a drive by ID
// @route   PUT /api/drives/:id
// @access  Private
const updateDrive = async (req, res) => {
  try {
    const drive = await Drive.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Drive not found',
      });
    }

    res.status(200).json({
      success: true,
      data: drive,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Drive not found (invalid ID format)',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating drive',
      error: error.message,
    });
  }
};

// @desc    Delete a drive by ID
// @route   DELETE /api/drives/:id
// @access  Private
const deleteDrive = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Drive not found',
      });
    }

    await Drive.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Drive deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Drive not found (invalid ID format)',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error deleting drive',
      error: error.message,
    });
  }
};

module.exports = {
  getDrives,
  createDrive,
  updateDrive,
  deleteDrive,
};
