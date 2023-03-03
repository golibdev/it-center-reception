const { isValidObjectId } = require("mongoose");
const responseHandler = require("../handlers/response.handler");
const smsStatusModel = require('../models/smsStatus');

const getAll = async (req, res) => {
   try {
      const page = parseInt(req.query.page) || 1
      const limit = 10
      const skipIndex = (page - 1) * limit

      const smsStatus = await smsStatusModel.find()
         .skip(skipIndex)
         .limit(limit)
         .sort({ createdAt: -1 });

      const total = await smsStatusModel.countDocuments();

      responseHandler.ok(res, {
         smsStatus,
         pagination: {
            total,
            limit,
            page,
            next: `/api/v1/sms-status?page=${page + 1}`
         }
      })
   } catch (err) {
      responseHandler.error(res, err);
   }
}

const getOne = async (req, res) => {
   try {
      const id = req.params.id

      if (!isValidObjectId(id)) return responseHandler.badrequest(res, 'not object id');

      const smsStatus = await smsStatusModel.findById(id);

      if (!smsStatus) return responseHandler.notfound(res);

      responseHandler.ok(res, {
         message: 'Sms Status',
         smsStatus
      })
   } catch (err) {
      responseHandler.error(res, err);
   }
}

module.exports = {
   getAll,
   getOne
}