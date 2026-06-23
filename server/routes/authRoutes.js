const express = require('express')
const router = express.Router()  // was "route", should be "router"
const { registerUser, loginUser } = require('../controllers/authController')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.put('/profile', async (req, res) => {
  try {
    const { cycleLength, hasPCOD } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { cycleLength, hasPCOD },
      { new: true }
    )
    res.json(user)
  } catch (err) {
    res.status(400).json({ message: 'Error updating profile' })
  }
})

module.exports = router