const express = require('express')
const router = express.Router()
const { registerUser, loginUser } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
const User = require('../models/User')

router.post('/register', registerUser)
router.post('/login', loginUser)

router.put('/profile', protect, async (req, res) => {
  try {
    const { cycleLength, hasPCOD } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { cycleLength, hasPCOD },
      { new: true }
    )
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: 'Error updating profile' })
  }
})

module.exports = router