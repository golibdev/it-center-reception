const express = require('express');
const router = express.Router();

router.use('/admin', require('./admin.route'));
router.use('/course', require('./course.route'));
router.use('/course-time', require('./courseTime.route'));
router.use('/student', require('./student.route'));
router.use('/sms', require('./sms.route'));

module.exports = router;