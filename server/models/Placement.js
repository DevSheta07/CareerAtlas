const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Role/designation is required'],
    trim: true
  },
  package: {
    type: Number,
    required: [true, 'Package (in LPA) is required'],
    min: [0, 'Package cannot be negative']
  },
  placementType: {
    type: String,
    enum: {
      values: ['on-campus', 'off-campus', 'internship'],
      message: '{VALUE} is not a valid placement type'
    },
    default: 'on-campus'
  },
  placementDate: {
    type: Date
  },
  location: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Placement', placementSchema);
