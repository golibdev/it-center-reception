const { model, Schema } = require('mongoose');
const modelOptions = require('./model.options');

const studentSchema = new Schema({
   fullName: {
      type: String,
      required: true
   },
   phoneNumber: {
      type: String,
      required: true
   },
   courseTime: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'CourseTime'
   },
   course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true
   },
   status: {
      type: String,
      required: true,
      enum: ['new', 'success', 'rejected', 'phone_off', 'dont_phone_answered'],
      default: 'new'
   }
}, modelOptions);

const studentModel = model('Student', studentSchema);

module.exports = studentModel;