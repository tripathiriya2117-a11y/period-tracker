const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  hasPCOD: {
    type: Boolean,
    default: false
  },
  cycleLength: {
    type: Number,
    default: 28
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User