const mongoose = require('mongoose')

const cycleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  periodLength: {
    type: Number
  },
  cycleLength: {
    type: Number
  },
  phase: {
    type: String,
    enum: ['menstrual', 'follicular', 'ovulatory', 'luteal']
  },
  symptoms: [{
    type: String
  }],
  mood: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'calm', 'irritable', 'energetic', 'tired']
  },
  cravings: [{
    type: String
  }],
  discharge: {
    type: String,
    enum: ['none', 'spotting', 'light', 'moderate', 'heavy']
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
})

const Cycle = mongoose.model('Cycle', cycleSchema)

module.exports = Cycle