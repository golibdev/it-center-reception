const mongoose = require('mongoose');
const modelOptions = require('./model.options');

const courseSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
      unique: true
   },
   status: {
      type: Boolean,
      default: false,
      required: true
   },
   students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
   }]
}, modelOptions);


const courseModel = mongoose.model("Course", courseSchema);

module.exports = courseModel;