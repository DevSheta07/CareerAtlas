const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  enrollmentNo: {
    type: String,
    required: [true, 'Enrollment number is required'],
    unique: true,
    trim: true
  },
  branch: {
    type: String,
    enum: {
      values: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'ICT', 'CH'],
      message: '{VALUE} is not a valid branch'
    },
    required: [true, 'Branch is required']
  },
  batch: {
    type: String,
    required: [true, 'Batch is required'],
    trim: true
  },
  cgpa: {
    type: Number,
    min: [0, 'CGPA cannot be less than 0'],
    max: [10, 'CGPA cannot be more than 10']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['placed', 'higher_studies', 'unplaced'],
      message: '{VALUE} is not a valid status'
    },
    default: 'unplaced'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);
