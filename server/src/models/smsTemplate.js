const mongoose = require('mongoose');
const modelOptions = require('./model.options');

const smsTemplateSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
      unique: true
   },
   message: {
      type: String,
      required: true,
      unique: true
   }
}, modelOptions);


const smsTemplateModel = mongoose.model("SmsTemplate", smsTemplateSchema);

module.exports = smsTemplateModel;