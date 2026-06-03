const mongoose = require('mongoose');

const higherStudySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required']
  },
  university: {
    type: String,
    required: [true, 'University name is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  program: {
    type: String,
    enum: {
      values: ['MS', 'MTech', 'MBA', 'PhD'],
      message: '{VALUE} is not a valid program'
    },
    required: [true, 'Program is required']
  },
  admissionYear: {
    type: Number,
    required: [true, 'Admission year is required']
  }
});

module.exports = mongoose.model('HigherStudy', higherStudySchema);
