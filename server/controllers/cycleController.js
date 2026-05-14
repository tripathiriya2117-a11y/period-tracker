const Cycle = require('../models/Cycle')
console.log('Cycle type:', typeof Cycle);
logCycle = async (req, res) => {
  try {
    const { startDate, endDate, symptoms, mood, cravings, discharge, notes } = req.body

    const cycle = await Cycle.create({
      user: req.user._id,
      startDate,
      endDate,
      symptoms,
      mood,
      cravings,
      discharge,
      notes
    })

    res.status(201).json(cycle)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getCycles = async (req, res) => {
  try {
    const cycles = await Cycle.find({ user: req.user._id })
      .sort({ startDate: -1 })

    res.status(200).json(cycles)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id)

    if (!cycle) {
      return res.status(404).json({ message: 'Cycle not found' })
    }

    if (cycle.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    const updatedCycle = await Cycle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.status(200).json(updatedCycle)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id)

    if (!cycle) {
      return res.status(404).json({ message: 'Cycle not found' })
    }

    if (cycle.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    await cycle.deleteOne()

    res.status(200).json({ message: 'Cycle deleted' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { logCycle, getCycles, updateCycle, deleteCycle }