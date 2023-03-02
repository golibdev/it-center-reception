const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { body } = require('express-validator');
const tokenMiddleware = require('../middlewares/token.middleware');
const requestHandler = require('../handlers/request.handler');
const courseModel = require('../models/course');

router.get(
   '/',
   tokenMiddleware.auth,
   courseController.getAll
)

router.get(
   '/:id',
   tokenMiddleware.auth,
   courseController.getOne
)

router.post(
   '/create',
   tokenMiddleware.auth,
   body("title")
      .exists().withMessage("course title is required")
      .isLength({ min: 1 }).withMessage("title can not be empty")
      .custom(async value => {
         const courseExist = await courseModel.findOne({ title: value })

         if (courseExist) return Promise.reject("title allready used");
      }),
   requestHandler.validate,
   courseController.creatCourse
)

router.put(
   '/update-status/:id',
   tokenMiddleware.auth,
   courseController.updateStatusCourse
)

router.put(
   '/update/:id',
   tokenMiddleware.auth,
   body("title")
      .exists().withMessage("title is required")
      .isLength({ min: 1 }).withMessage("title can not be empty")
      .custom(async value => {
         const courseExist = await courseModel.findOne({ title: value })

         if (courseExist) return Promise.reject("title allready used");
      }),
   requestHandler.validate,
   courseController.updateCourse
)

module.exports = router;