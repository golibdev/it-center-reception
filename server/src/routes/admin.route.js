const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { body } = require('express-validator');
const tokenMiddleware = require('../middlewares/token.middleware');
const requestHandler = require('../handlers/request.handler');
const adminModel = require('../models/admin');

router.post(
   '/signup',
   body("username")
      .exists().withMessage("username is required")
      .isLength({ min: 1 }).withMessage("usernmae can not be empty")
      .custom(async value => {
         const admin = await adminModel.findOne({ username: value });
         if (admin) return Promise.reject("username allready used")
      }),
   body("password")
      .exists().withMessage("password is required")
      .isLength({ min: 8 }).withMessage("password minimum 8 characters"),
   body("confirmPassword")
      .exists().withMessage("confirm password is required")
      .isLength({ min: 8 }).withMessage("confirm password minimum 8 characters")
      .custom(async (value,  { req }) => {
         if(value !== req.body.password) throw new Error("confirm password not match!")
         return true
      }),
   body("displayName")
      .exists().withMessage("display name is required")
      .isLength({ min: 1 }).withMessage("display name minimum 1 characters"),
   requestHandler.validate,
   adminController.signup
);

router.post(
   "/signin",
   body("username")
      .exists().withMessage("username is required")
      .isLength({ min: 1 }).withMessage("username can not be empty"),
   body("password")
      .exists().withMessage("password is required")
      .isLength({ min: 8 }).withMessage("password minimum 8 characters"),
   requestHandler.validate,
   adminController.signin
);

router.put(
   "/update-password",
   tokenMiddleware.auth,
   body("password")
      .exists().withMessage("password is required")
      .isLength({ min: 8 }).withMessage("password minimum 8 characters"),
   body("newPassword")
      .exists().withMessage("new password is required")
      .isLength({ min: 8 }).withMessage("new password minimum 8 characters"),
   body("confirmNewPassword")
      .exists().withMessage("new confirm password is required")
      .isLength({ min: 8 }).withMessage("new confirm password minimum 8 characters")
      .custom(async (value, { req }) => {
         if(value !== req.body.newPassword) throw new Error("confirm password not match")
         return true
      }),
   requestHandler.validate,
   adminController.updatePassword
)

router.get(
   '/info', 
   tokenMiddleware.auth, 
   adminController.getInfo
)

module.exports = router;