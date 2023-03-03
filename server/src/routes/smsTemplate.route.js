const express = require('express');
const router = express.Router();
const smsTemplateController = require('../controllers/smsTemplate.controller');
const smsTemplateModel = require('../models/smsTemplate');
const tokenMiddleware = require('../middlewares/token.middleware');
const { body } = require('express-validator');
const requestHandler = require('../handlers/request.handler');

router.get(
   '/',
   tokenMiddleware.auth,
   smsTemplateController.getAll
)

router.get(
   '/:id',
   tokenMiddleware.auth,
   smsTemplateController.getOne
)

router.post(
   '/create',
   tokenMiddleware.auth,
   body('title')
      .exists().withMessage("sms template title is required")
      .isLength({ min: 1 }).withMessage("sms template title can not be empty")
      .custom(async value => {
         const smsTemplateExist = await smsTemplateModel.findOne({ title: value })

         if (smsTemplateExist) return Promise.reject("sms template title allready used");
      }),
   body('message')
      .exists().withMessage("sms template message is required")
      .isLength({ min: 1 }).withMessage("sms template message can not be empty"),
   requestHandler.validate,
   smsTemplateController.create
)

module.exports = router