const express = require('express');
const jobController = require('../controllers/jobcontroller.js');

const router = express.Router();

router.post('/', jobController.createJob);
router.get('/:id', jobController.getJobStatus);

module.exports = router;