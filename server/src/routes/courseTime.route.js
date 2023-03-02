const express = require('express');
const router = express.Router();
const courseTimeController = require('../controllers/courseTime.controller');
const { body } = require('express-validator');
const tokenMiddleware = require('../middlewares/token.middleware');
const requestHandler = require('../handlers/request.handler');
const courseTimeModel = require('../models/courseTime');

router.get(
   '/',
   tokenMiddleware.auth,
   courseTimeController.getAll
)

router.get(
   '/:id',
   tokenMiddleware.auth,
   courseTimeController.getOne
)

router.post(
   '/create',
   tokenMiddleware.auth,
   body('title')
      .exists().withMessage("course time title is required")
      .isLength({ min: 1 }).withMessage("title can not be empty")
      .custom(async value => {
         const courseTimeExist = await courseTimeModel.findOne({ title: value })

         if (courseTimeExist) return Promise.reject("title allready used");
      }),
   requestHandler.validate,
   courseTimeController.creatCourseTime
)

router.put(
   '/update/:id',
   tokenMiddleware.auth,
   body('title')
      .exists().withMessage("course time title is required")
      .isLength({ min: 1 }).withMessage("title can not be empty")
      .custom(async value => {
         const courseTimeExist = await courseTimeModel.findOne({ title: value })

         if (courseTimeExist) return Promise.reject("title allready used");
      }),
   requestHandler.validate,
   courseTimeController.updateCourseTime
)

module.exports = router;