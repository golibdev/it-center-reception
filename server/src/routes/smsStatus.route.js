const express = require('express');
const router = express.Router();
const smsStatusController = require('../controllers/smsStatus.controller');
const tokenMiddleware = require('../middlewares/token.middleware');

router.get(
   '/',
   tokenMiddleware.auth,
   smsStatusController.getAll
)

router.get(
   '/:id',
   tokenMiddleware.auth,
   smsStatusController.getOne
)

module.exports = router;