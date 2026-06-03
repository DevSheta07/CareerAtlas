const Student = require('../models/Student');
const Placement = require('../models/Placement');
const HigherStudy = require('../models/HigherStudy');
const User = require('../models/User');


// @desc    Get all students with pagination, search, and filters
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Search by name or enrollmentNo using regex
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { enrollmentNo: searchRegex },
      ];
    }

    // Filter by branch
    if (req.query.branch) {
      filter.branch = req.query.branch;
    }

    // Filter by batch
    if (req.query.batch) {
      filter.batch = req.query.batch;
    }

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const totalStudents = await Student.countDocuments(filter);
    const totalPages = Math.ceil(totalStudents / limit);

    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        students,
        page,
        totalPages,
        totalStudents,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching students',
      error: error.message,
    });
  }
};

// @desc    Get single student by ID with related records
// @route   GET /api/students/:id
// @access  Private
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Fetch related placement and higher study records
    const placements = await Placement.find({ studentId: student._id });
    const higherStudies = await HigherStudy.find({ studentId: student._id });

    res.status(200).json({
      success: true,
      data: {
        student,
        placements,
        higherStudies,
      },
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Student not found (invalid ID format)',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error fetching student',
      error: error.message,
    });
  }
};

// @desc    Create a new student
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A student with this enrollment number or email already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error creating student',
      error: error.message,
    });
  }
};

// @desc    Update a student by ID
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
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
        message: 'Student not found (invalid ID format)',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating student',
      error: error.message,
    });
  }
};

// @desc    Delete a student by ID (cascading delete of related records)
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Delete related placement and higher study records
    await Placement.deleteMany({ studentId: student._id });
    await HigherStudy.deleteMany({ studentId: student._id });

    // Delete the student
    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Student and related records deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Student not found (invalid ID format)',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error deleting student',
      error: error.message,
    });
  }
};

// @desc    Get current logged-in student profile
// @route   GET /api/students/profile/me
// @access  Private
const getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let student = await Student.findOne({ email: user.email });
    
    // Auto-create Student record if it doesn't exist (e.g. for legacy or admin-created student users)
    if (!student && user.role === 'student') {
      const tempEnrollmentNo = `TEMP-${Date.now()}`;
      student = await Student.create({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        enrollmentNo: tempEnrollmentNo,
        branch: 'CSE',
        batch: new Date().getFullYear().toString(),
        status: 'unplaced',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message,
    });
  }
};

// @desc    Update current logged-in student profile
// @route   PUT /api/students/profile/me
// @access  Private
const updateStudentProfile = async (req, res) => {
  try {
    const { name, email, phone, enrollmentNo, branch, batch, cgpa, status } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let student = await Student.findOne({ email: user.email });
    if (!student) {
      // Auto-create if not found
      const tempEnrollmentNo = enrollmentNo || `TEMP-${Date.now()}`;
      student = await Student.create({
        name: name || user.name,
        email: user.email,
        phone: phone || user.phone || '',
        enrollmentNo: tempEnrollmentNo,
        branch: branch || 'CSE',
        batch: batch || new Date().getFullYear().toString(),
        status: status || 'unplaced',
      });
    }

    // Check email uniqueness if email is being updated
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'A user with this email already exists',
        });
      }
      user.email = email.toLowerCase();
      student.email = email.toLowerCase();
    }

    if (name) {
      user.name = name;
      student.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
      student.phone = phone;
    }

    if (enrollmentNo) {
      // Check if enrollment number is taken by another student
      const enrollExists = await Student.findOne({ enrollmentNo, _id: { $ne: student._id } });
      if (enrollExists) {
        return res.status(400).json({
          success: false,
          message: 'Enrollment number is already in use by another student',
        });
      }
      student.enrollmentNo = enrollmentNo;
    }

    if (branch) student.branch = branch;
    if (batch) student.batch = batch;
    if (cgpa !== undefined) student.cgpa = cgpa;
    if (status) student.status = status;

    await user.save();
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: student,
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
      message: 'Server error updating profile',
      error: error.message,
    });
  }
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  updateStudentProfile,
};

