const smsTemplateModel = require('../models/smsTemplate');
const responseHandler = require('../handlers/response.handler');
const { isValidObjectId } = require('mongoose');

const getAll = async (req, res) => {
   try {
      const smsTemplates = await smsTemplateModel.find({}).sort({ createdAt: -1 });

      responseHandler.ok(res, {
         message: 'Sms Templates',
         smsTemplates
      })
   } catch (err) {
      responseHandler.error(res, err);
   }
}

const getOne = async (req, res) => {
   try {
      const id = req.params.id;

      if (!isValidObjectId(id)) return responseHandler.badrequest(res, 'not object id');

      const smsTemplate = await smsTemplateModel.findById(id);

      if (!smsTemplate) return responseHandler.notfound(res);

      responseHandler.ok(res, {
         message: "Sms Template",
         smsTemplate
      })
   } catch (err) {
      responseHandler.error(res, err);
   }
}

const create = async (req, res) => {
   try {
      const {title, message} = req.body;

      const newSmsTemplate = await smsTemplateModel.create({ title, message });

      responseHandler.created(res, {
         message: "Successfuly created",
         smsTemplate: newSmsTemplate
      })
   } catch (err) {
      responseHandler.error(res, err);
   }
}

module.exports = {
   getAll,
   getOne,
   create
}