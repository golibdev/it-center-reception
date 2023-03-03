const mongoose = require('mongoose');
const modelOptions = require('./model.options');

const smsStatusSchema = new mongoose.Schema({
   id: {
      type: String,
      required: true,
      unique: true
   },
   phone: {
      type: String,
      required: true
   },
   message: {
      type: String,
      required: true
   }
}, modelOptions);


const smsStatusModel = mongoose.model("SmsStatus", smsStatusSchema);

module.exports = smsStatusModel;