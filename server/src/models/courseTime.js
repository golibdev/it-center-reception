const mongoose = require('mongoose');
const modelOptions = require('./model.options');

const courseTimeSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
      unique: true
   }
}, modelOptions);


const courseTimeModel = mongoose.model("CourseTime", courseTimeSchema);

module.exports = courseTimeModel;