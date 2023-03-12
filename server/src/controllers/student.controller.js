const studentModel = require('../models/student');
const responseHandler = require('../handlers/response.handler');
const utils = require('../utils/status');
const courseModel = require('../models/course');
const { isValidObjectId } = require('mongoose');
const moment = require('moment');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const getAll = async (req, res) => {
   try {
      const page = parseInt(req.query.page) || 1
      const limit = 10
      const skipIndex = (page - 1) * limit

      const students = await studentModel
         .find({})
         .skip(skipIndex)
         .limit(limit)
         .populate('course')
         .populate('courseTime')
         .sort({ createdAt: -1 });
      
      const total = await studentModel.countDocuments();

      const directoryPath = path.join(__dirname, '..', '..', 'public', 'export');

      fs.readdir(directoryPath, (err, files) => {
         if (err) {
            console.error(err);
            return;
         }

         for (const file of files) {
            const filePath = path.join(directoryPath, file);

            fs.stat(filePath, (err, stat) => {
               if (err) {
               console.error(err);
               return;
               }

               if (stat.isFile()) {
               fs.unlink(filePath, (err) => {
                  if (err) {
                     console.error(err);
                     return;
                  }
               });
               } else if (stat.isDirectory()) {
                  deleteFolderRecursive(filePath);
               }
            });
         }
      });

      function deleteFolderRecursive(directoryPath) {
         fs.readdir(directoryPath, (err, files) => {
            if (err) {
               console.error(err);
               return;
            }

            for (const file of files) {
               const filePath = path.join(directoryPath, file);

               fs.stat(filePath, (err, stat) => {
                  if (err) {
                     console.error(err);
                     return;
                  }

                  if (stat.isFile()) {
                     fs.unlink(filePath, (err) => {
                        if (err) {
                        console.error(err);
                        return;
                        }

                        console.log(`File ${filePath} deleted successfully`);
                     });
                  } else if (stat.isDirectory()) {
                     deleteFolderRecursive(filePath);
                  }
               });
            }

            fs.rmdir(directoryPath, (err) => {
               if (err) {
                  console.error(err);
                  return;
               }
            });
         });
      }


      responseHandler.ok(res, {
         message: "students",
         students,
         pagination: {
            total,
            limit,
            page,
            next: `/api/v1/student?page=${page + 1}`
         }
      });
   } catch (err) {
      responseHandler.error(res, err);
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

const search = async (req, res) => {
   try {
      const { search } = req.query;
      const regex = new RegExp(search.toLowerCase().trim(), 'i')

      const students = await studentModel.find({
         $or: [
            {
               fullName: { $regex: regex }
            },
            {
               phoneNumber: { $regex: regex }
            }
         ]
      }).populate('course').populate('courseTime').sort({ createdAt: -1 })

      responseHandler.ok(res, {
         message: "Stundents",
         students
      })
   } catch (err) {
      responseHandler.error(res, err)
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
      }).populate('course').populate('courseTime')

      responseHandler.ok(res, {
         message: "Students",
         students
      })
   } catch (err) {
      responseHandler.error(res, err);
   }
}

const exportExcel = async (req, res) => {
   try {
      const data = await studentModel.find().populate('course').lean().exec();

      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet('Data');

      worksheet.columns = [
         { header: 'Ism familiya', key: 'fullName', width: 30, alignment: { horizontal: 'center' } },
         { header: 'Telefon raqami', key: 'phoneNumber', width: 15, alignment: { horizontal: 'center' } },
         { header: 'Tanlagan kursi', key: 'course', width: 20, alignment: { horizontal: 'center' } },
         { header: 'Status', key: 'status', width: 30, alignment: { horizontal: 'center' } }
      ];

      function statusText(status) {
         let result = ''
         switch(status) {
            case 'new': result = 'Yangi'; break;
            case 'success': result = 'Kursga qatnashadi'; break;
            case 'rejected': result = 'Kursga qatnashmaydi'; break;
            case 'phone_off': result = "Telefoni o'chirilgan"; break;
            case 'dont_phone_answered': result = "Telefonga javob bermadi";
         }

         return result;
      }

      data.forEach(item => {
         worksheet.addRow({
            fullName: item.fullName,
            phoneNumber: item.phoneNumber,
            course: item.course.title,
            status: statusText(item.status)
         })
      })
      const filename = `export-${Date.now()}.xlsx`;
      const filePath = path.join(__dirname, '..', '..', 'public', 'export', filename);
      await workbook.xlsx.writeFile(filePath);

      const fileUrl = `https://crm-api.itpark-qarshi.uz/export/${filename}`;

      responseHandler.ok(res, fileUrl);
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
   thisDateRegisteredStudent,
   search,
   exportExcel
}