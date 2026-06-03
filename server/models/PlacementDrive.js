const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  package: {
    type: Number,
    required: [true, 'Package (in LPA) is required'],
    min: [0, 'Package cannot be negative']
  },
  eligibility: {
    type: String,
    trim: true
  },
  deadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'completed', 'cancelled'],
      message: '{VALUE} is not a valid drive status'
    },
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
