const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summary.controller');
const tokenMiddleware = require('../middlewares/token.middleware');

router.get(
   '/', 
   tokenMiddleware.auth,
   summaryController.summaryData
)

module.exports = router