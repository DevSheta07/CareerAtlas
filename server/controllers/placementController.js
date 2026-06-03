const Placement = require('../models/Placement');
const Student = require('../models/Student');

// @desc    Get all placements with filters and pagination
// @route   GET /api/placements
// @access  Private
const getPlacements = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Filter by company (regex search)
    if (req.query.company) {
      filter.company = new RegExp(req.query.company, 'i');
    }

    // Filter by placement type
    if (req.query.placementType) {
      filter.placementType = req.query.placementType;
    }

    // Filter by package range
    if (req.query.minPackage || req.query.maxPackage) {
      filter.package = {};
      if (req.query.minPackage) {
        filter.package.$gte = parseFloat(req.query.minPackage);
      }
      if (req.query.maxPackage) {
        filter.package.$lte = parseFloat(req.query.maxPackage);
      }
    }

    // Filter by branch or batch (cross-collection filter via student IDs)
    if (req.query.branch || req.query.batch) {
      const studentFilter = {};
      if (req.query.branch) {
        studentFilter.branch = req.query.branch;
      }
      if (req.query.batch) {
        studentFilter.batch = req.query.batch;
      }

      const matchingStudents = await Student.find(studentFilter).select('_id');
      const studentIds = matchingStudents.map((s) => s._id);
      filter.studentId = { $in: studentIds };
    }

    const totalPlacements = await Placement.countDocuments(filter);
    const totalPages = Math.ceil(totalPlacements / limit);

    const placements = await Placement.find(filter)
      .populate('studentId', 'name enrollmentNo branch batch')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        placements,
        page,
        totalPages,
        totalPlacements,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching placements',
      error: error.message,
    });
  }
};

// @desc    Create a new placement record
// @route   POST /api/placements
// @access  Private
const createPlacement = async (req, res) => {
  try {
    const placement = await Placement.create(req.body);

    // Update the student's status to 'placed'
    await Student.findByIdAndUpdate(
      placement.studentId,
      { status: 'placed' },
      { new: true }
    );

    // Populate student info before returning
    const populatedPlacement = await Placement.findById(placement._id).populate(
      'studentId',
      'name enrollmentNo branch batch'
    );

    res.status(201).json({
      success: true,
      data: populatedPlacement,
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
      message: 'Server error creating placement',
      error: error.message,
    });
  }
};

// @desc    Update a placement by ID
// @route   PUT /api/placements/:id
// @access  Private
const updatePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('studentId', 'name enrollmentNo branch batch');

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: placement,
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
        message: 'Placement record not found (invalid ID format)',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating placement',
      error: error.message,
    });
  }
};

// @desc    Delete a placement by ID
// @route   DELETE /api/placements/:id
// @access  Private
const deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement record not found',
      });
    }

    await Placement.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Placement record deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Placement record not found (invalid ID format)',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error deleting placement',
      error: error.message,
    });
  }
};

module.exports = {
  getPlacements,
  createPlacement,
  updatePlacement,
  deletePlacement,
};
