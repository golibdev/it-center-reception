const {  validationResult } = require('express-validator');
const responseHandler = require('./response.handler.js');

const validate = (req, res, next) => {
   const errors = validationResult(req);

   if(!errors.isEmpty()) return responseHandler.badrequest(res, errors.array()[0].msg);

   next();
}

module.exports = { validate };