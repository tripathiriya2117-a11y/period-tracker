const express = require('express')
const router = express.Router()
const { logCycle, getCycles, updateCycle, deleteCycle } = require('../controllers/cycleController')
const { protect } = require('../middleware/authMiddleware')

router.route('/')
  .get(protect, getCycles)
  .post(protect, logCycle)

router.route('/:id')
  .put(protect, updateCycle)
  .delete(protect, deleteCycle)

module.exports = router