const DeviceLog = require('../models/DeviceLog');

const logTemperature = async (req, res) => {
  try {
    const { userId, temperature } = req.body;
    const log = await new DeviceLog({ userId, temperature }).save();
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { logTemperature };