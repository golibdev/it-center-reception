const express = require('express');
const router = express.Router();
const tokenMiddleware = require('../middlewares/token.middleware');
const smsController = require('../controllers/sms.controller');

router.get(
   '/generate-token',
   tokenMiddleware.auth,
   smsController.generateToken
)

router.post(
   '/send-sms',
   tokenMiddleware.auth,
   smsController.sendMessage
)

router.post(
   '/send-sms-all-user',
   tokenMiddleware.auth,
   smsController.sendAllUserMessage
)

module.exports = router;