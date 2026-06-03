const HigherStudy = require('../models/HigherStudy');
const Student = require('../models/Student');

// @desc    Get all higher study records with filters and pagination
// @route   GET /api/higher-studies
// @access  Private
const getHigherStudies = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Filter by country
    if (req.query.country) {
      filter.country = req.query.country;
    }

    // Filter by program
    if (req.query.program) {
      filter.program = req.query.program;
    }

    // Handle search query (university name, student name, or enrollment number)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');

      // Find matching student IDs
      const matchingStudents = await Student.find({
        $or: [
          { name: searchRegex },
          { enrollmentNo: searchRegex },
        ],
      }).select('_id');
      const studentIds = matchingStudents.map((s) => s._id);

      // Search matches EITHER university name OR matched student IDs
      filter.$or = [
        { university: searchRegex },
        { studentId: { $in: studentIds } },
      ];
    }

    const totalRecords = await HigherStudy.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit);

    const higherStudies = await HigherStudy.find(filter)
      .populate('studentId', 'name enrollmentNo branch batch')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        higherStudies,
        page,
        totalPages,
        totalRecords,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching higher study records',
      error: error.message,
    });
  }
};

// @desc    Create a new higher study record
// @route   POST /api/higher-studies
// @access  Private
const createHigherStudy = async (req, res) => {
  try {
    const higherStudy = await HigherStudy.create(req.body);

    // Update the student's status to 'higher_studies'
    await Student.findByIdAndUpdate(
      higherStudy.studentId,
      { status: 'higher_studies' },
      { new: true }
    );

    // Populate student info before returning
    const populatedRecord = await HigherStudy.findById(higherStudy._id).populate(
      'studentId',
      'name enrollmentNo branch batch'
    );

    res.status(201).json({
      success: true,
      data: populatedRecord,
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
      message: 'Server error creating higher study record',
      error: error.message,
    });
  }
};

// @desc    Update a higher study record by ID
// @route   PUT /api/higher-studies/:id
// @access  Private
const updateHigherStudy = async (req, res) => {
  try {
    const higherStudy = await HigherStudy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('studentId', 'name enrollmentNo branch batch');

    if (!higherStudy) {
      return res.status(404).json({
        success: false,
        message: 'Higher study record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: higherStudy,
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
        message: 'Higher study record not found (invalid ID format)',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating higher study record',
      error: error.message,
    });
  }
};

// @desc    Delete a higher study record by ID
// @route   DELETE /api/higher-studies/:id
// @access  Private
const deleteHigherStudy = async (req, res) => {
  try {
    const higherStudy = await HigherStudy.findById(req.params.id);

    if (!higherStudy) {
      return res.status(404).json({
        success: false,
        message: 'Higher study record not found',
      });
    }

    await HigherStudy.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Higher study record deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Higher study record not found (invalid ID format)',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error deleting higher study record',
      error: error.message,
    });
  }
};

module.exports = {
  getHigherStudies,
  createHigherStudy,
  updateHigherStudy,
  deleteHigherStudy,
};
