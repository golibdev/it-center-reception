const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { body } = require('express-validator');
const tokenMiddleware = require('../middlewares/token.middleware');
const requestHandler = require('../handlers/request.handler');
const studentModel = require('../models/student');
const courseModel = require('../models/course');
const courseTimeModel = require('../models/courseTime');
const { isValidObjectId } = require('mongoose')

router.get(
   '/',
   tokenMiddleware.auth,
   studentController.getAll
)

router.get(
   '/status',
   tokenMiddleware.auth,
   studentController.getFilterStudents
)

router.get(
   '/course',
   tokenMiddleware.auth,
   studentController.getFilterCourseStudents
)

router.get(
   '/filter-day',
   tokenMiddleware.auth,
   studentController.thisDateRegisteredStudent
)

router.get(
   '/:id',
   tokenMiddleware.auth,
   studentController.getOne
)

router.post(
   '/create',
   tokenMiddleware.auth,
   body('fullName')
      .exists().withMessage("fullname is required")
      .isLength({ min: 1 }).withMessage("fullname can not be empty"),
   body('phoneNumber')
      .exists().withMessage("phone number is required")
      .isLength({ min: 1 }).withMessage("phone number can not be empty"),
   body('courseTime')
      .exists().withMessage("course time is required")
      .isLength({ min: 1 }).withMessage("course time can not be empty")
      .custom(async value => {
         if (!isValidObjectId(value)) return Promise.reject("not object id");

         const existCourseTime = await courseTimeModel.findById(value);

         if (!existCourseTime) return Promise.reject("not found course time");
      }),
   body('course')
      .exists().withMessage("course is required")
      .isLength({ min: 1 }).withMessage("course can not be empty")
      .custom(async value => {
         if (!isValidObjectId(value)) return Promise.reject("not object id");

         const existCourse = await courseModel.findById(value);
         
         if (!existCourse) return Promise.reject("not found course");
      }),
   requestHandler.validate,
   studentController.createStudent
)

router.put(
   '/update-status/:id',
   tokenMiddleware.auth,
   studentController.updateStatusStudent
)

module.exports = router;