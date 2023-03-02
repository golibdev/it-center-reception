const courseTimeModel = require('../models/courseTime');
const responseHandler = require('../handlers/response.handler');

const getAll = async (req, res) => {
   try {
      const courseTimes = await courseTimeModel.find({}).sort({ createdAt: -1 });

      responseHandler.ok(res, {
         message: "course times",
         courseTimes
      })
   } catch (err) {
      responseHandler.error(res, err)
   }
}

const getOne = async (req, res) => {
   try {
      const id = req.params.id
      const courseTime = await courseTimeModel.findById(id)

      if (!courseTime) return responseHandler.notfound(res);

      responseHandler.ok(res, {
         message: "course time",
         courseTime
      })
   } catch (err) {
      responseHandler.error(res, err)
   }
}

const creatCourseTime = async (req, res) => {
   try {
      const { title } = req.body;

      const courseTime = await courseTimeModel.create({ title });

      responseHandler.created(res, courseTime);
   } catch (err) {
      responseHandler.error(res, err)
   }
}

const updateCourseTime = async (req, res) => {
   try {
      const id = req.params.id;
      const { title } = req.body;

      const updatedCourseTime = await courseTimeModel.findById(id, { title }, { new: true });

      responseHandler.ok(res, { courseTime: updatedCourseTime });
   } catch (err) {
      responseHandler.error(res, err);
   }
}

module.exports = {
   getAll,
   getOne,
   creatCourseTime,
   updateCourseTime
}