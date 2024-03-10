var express = require('express');
var router = express.Router();

// import upload controller
const uploadController = require('../controllers/upload.controller');

// Upload       POST
router.post('/upload', uploadController.upload);

module.exports = router;