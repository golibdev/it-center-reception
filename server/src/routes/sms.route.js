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

module.exports = router;