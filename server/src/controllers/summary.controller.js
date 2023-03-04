const studentModel = require('../models/student');
const smsTemplateModel = require('../models/smsTemplate');
const courseModel = require('../models/course');
const courseTimeModel = require('../models/courseTime');
const responseHandler = require('../handlers/response.handler');
const smsStatusModel = require('../models/smsStatus');

const summaryData = async (req, res) => {
   try {
      const countStudents = await studentModel.countDocuments();
      const countSmsTemplate = await smsTemplateModel.countDocuments();
      const countSmsStatus = await smsStatusModel.countDocuments();
      const countCourse = await courseModel.countDocuments();
      const countCourseTime = await courseTimeModel.countDocuments();

      const summary = {
         countCourse,
         countCourseTime,
         countSmsStatus,
         countSmsTemplate,
         countStudents
      }

      responseHandler.ok(res, {
         message: "summary",
         summary
      })
   } catch (err) {
      responseHandler.error(res, err);
   }
}

module.exports = {
   summaryData
}