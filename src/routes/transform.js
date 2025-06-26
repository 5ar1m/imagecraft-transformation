const express = require('express');
const router = express.Router();
const transformController = require('../controllers/transform');

router.get('/transform/:key', transformController);

module.exports = router;