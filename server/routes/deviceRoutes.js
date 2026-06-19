const express = require('express');
const router = express.Router();
const { logTemperature } = require('../controllers/deviceController');

router.post('/temperature', logTemperature);

module.exports = router;
