const courseModel = require('../models/course');
const responseHandler = require('../handlers/response.handler');
const { isValidObjectId } = require('mongoose');

const getAll = async (req, res) => {
   try {
      const courses = await courseModel.find({})
         .populate('students')
         .sort({ createdAt: -1 });

      responseHandler.ok(res, courses);
   } catch (err) {
      responseHandler.error(res, err);
   }
}

const getOne = async (req, res) => {
   try {
      const id = req.params.id;

      if (!isValidObjectId(id)) return responseHandler.badrequest(res, "not object id")

      const course = await courseModel
         .findById(id)
         .populate('students');

      if (!course) responseHandler.notfound(res);

      responseHandler.ok(res, course);
   } catch (err) {
      responseHandler.error(res, err);
   }
}

const creatCourse = async (req, res) => {
   try {
      const { title } = req.body;

      const course = await courseModel.create({ title });

      responseHandler.created(res, {
         message: "Created Successfuly",
         ...course._doc
      })
   } catch (err) {
      responseHandler.error(res, err)
   }
}

const updateCourse = async (req, res) => {
   try {
      const id = req.params.id;

      if(!isValidObjectId(id)) return responseHandler.badrequest(res, "not object id");

      const { title } = req.body;
      
      const courseExist = await courseModel.findOne({ title });

      if (courseExist) return responseHandler.badrequest(res, "course title already used")

      const updatedCourse = await courseModel.findByIdAndUpdate(id, { title }, { new: true });

      responseHandler.ok(res, {
         ...updatedCourse._doc
      })
   } catch (err) {
      responseHandler.error(res, err)
   }
}

const updateStatusCourse = async (req, res) => {
   try {
      const id = req.params.id;
      const status = req.body.status;

      if (!isValidObjectId(id)) return responseHandler.badrequest("not object id")

      const course = await courseModel.findById(id);

      if (!course) return responseHandler.notfound(res);

      await courseModel.findByIdAndUpdate(id, {
         status: status
      }, { new: true })

      responseHandler.ok(res, {
         message: "Successfuly updated"
      })
   } catch (err) {
      responseHandler.error(res, err);
   }
}

module.exports = {
   getAll,
   getOne,
   creatCourse,
   updateCourse,
   updateStatusCourse
}