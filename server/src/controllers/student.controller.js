const studentModel = require('../models/student');
const responseHandler = require('../handlers/response.handler');
const utils = require('../utils/status');
const courseModel = require('../models/course');
const { isValidObjectId } = require('mongoose');
const moment = require('moment');

const getAll = async (req, res) => {
   try {
      const students = await studentModel
         .find({})
         .populate('course')
         .populate('courseTime')
         .sort({ createdAt: -1 });

      responseHandler.ok(res, {
         message: "students",
         students
      });
   } catch (err) {
      responseHandler(res, err);
   }
}

const getOne = async (req, res) => {
   try {
      const id = req.params.id

      if(!isValidObjectId(id)) return responseHandler.badrequest(res, 'not object id')

      const student = await studentModel
         .findById(id)
         .populate('course')
         .populate('courseTime');

      if (!student) return responseHandler.notfound(res);

      responseHandler.ok(res, {
         message: "student",
         student
      });
   } catch (err) {
      responseHandler.error(res, err);
   }
}

const getFilterStudents = async (req, res) => {
   try {
      const { status, course } = req.query;
      const isStatus = utils.status.includes(status);

      if (!isStatus) return responseHandler.badrequest(res, "error status");

      const students = await studentModel.find({
         $and: [{
            $or: [{
               'status': status
            }]
         }, {
            $or: [{
               'course': course
            }]
         }]
      }).populate('course').populate('courseTime').sort({ createdAt: -1 })
      
      responseHandler.ok(res, {
         message: "Students",
         students
      })
   } catch (err) {
      responseHandler.error(res, err);
   }
}

const getFilterCourseStudents = async (req, res) => {
   try {
      const { course } = req.query;
      
      if (!isValidObjectId(course)) return responseHandler.badrequest(res, "not object id");

      const existCourse = await courseModel.findById(course);

      if (!existCourse) return responseHandler.notfound(res);

      const students = await studentModel
         .find({ course: course })
         .populate('course')
         .populate('courseTime')
         .sort({ createdAt: -1 });

      responseHandler.ok(res, {
         message: "Students",
         students
      })
   } catch (err) {
      responseHandler.error(res, err);
   }
}

const createStudent = async (req, res) => {
   try {
      const {
         fullName,
         phoneNumber,
         courseTime,
         course
      } = req.body;

      const newStudent = await studentModel.create({
         fullName,
         phoneNumber,
         courseTime,
         course
      })
      
      await courseModel.findByIdAndUpdate(course, {
         $push: {
            students: newStudent._id
         }
      }, { new: true });

      responseHandler.created(res, {
         message: "Created successfuly",
         student: newStudent
      })
   } catch (err) {
      responseHandler.error(res, err);
   }
}

const updateStatusStudent = async (req, res) => {
   try {
      const id = req.params.id;
      const status = req.query.status;

      const isStatus = utils.status.includes(status);

      if (!isStatus) return responseHandler.badrequest(res, "error status");

      if (!isValidObjectId(id)) return responseHandler.badrequest(res, 'not object id');

      const student = await studentModel.findById(id);

      if (!student) return responseHandler.notfound(res);

      await studentModel.findByIdAndUpdate(id, {
         status: status
      }, { new: true })

      responseHandler.ok(res,  {
         message: "successfuly updated"
      })
   } catch (err) {
      responseHandler.error(res, err)
   }
}

const thisDateRegisteredStudent = async (req, res) => {
   try {
      const { start_date, end_date } = req.query;

      if (start_date === '' || end_date === '') {
         return responseHandler.badrequest(res, 'Please ensure you pick two dates')
      }

      const startDate = moment(start_date).format('YYYY-MM-DD');
      const endDate = moment(end_date).format('YYYY-MM-DD');

      const students = await studentModel.find({
         createdAt: {
            $gt: new Date(new Date(startDate).setHours(00, 00, 00)),
            $lt: new Date(new Date(endDate).setHours(23, 59, 59))
         }
      })

      responseHandler.ok(res, {
         message: "Students",
         students
      })
   } catch (err) {
      responseHandler.error(res, err);
   }
}

module.exports = {
   getAll,
   getOne,
   getFilterStudents,
   createStudent,
   getFilterCourseStudents,
   updateStatusStudent,
   thisDateRegisteredStudent
}