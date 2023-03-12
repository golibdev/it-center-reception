import privateClient from '../client/private.client';

const studentEndpoints = {
   getAll: "student",
   export: "student/export",
   search: (searchValue) => `student/search?search=${searchValue}`,
   getFilterStatus: (status, course) => `student/status?status=${status}&course=${course}`,
   getFilterCourse: (course) => `student/course?course=${course}`,
   filterDay: (startDate, endDate) => `student/filter-day?start_date=${startDate}&end_date=${endDate}`,
   getOne: (id) => `student/${id}`,
   create: "student/create",
   updateStatus: (id, status) => `student/update-status/${id}?status=${status}`,
   getPagination: (page) => `student?page=${page}`
}

const studentApi = {
   getAll: async () => {
      try {
         const response = await privateClient.get(studentEndpoints.getAll);
         return { response };
      } catch (err) {
         return { err };
      }
   },
   exportExcel: async () => {
      try {
         const response = await privateClient.get(studentEndpoints.export);
         return { response }
      } catch (err) {
         return {err}
      }
   },
   getPagination: async (page) => {
      try {
         const response = await privateClient.get(
            studentEndpoints.getPagination(page)
         )

         return { response }
      } catch (err) {
         return { err }
      }
   },
   search: async (searchValue) => {
      try {
         const response = await privateClient.get(
            studentEndpoints.search(searchValue)
         )

         return { response };
      } catch (err) {
         return { err }
      }
   },
   getFilterStatus: async (status, course) => {
      try {
         const response = await privateClient.get(
            studentEndpoints.getFilterStatus(status, course)
         )

         return { response };
      } catch (err) {
         return { err }
      }
   },
   getFilterCourse: async (course) => {
      try {
         const response = await privateClient.get(
            studentEndpoints.getFilterCourse(course)
         )

         return { response }
      } catch (err) {
         return { err }
      }
   },
   getFilterDay: async (startDate, endDate) => {
      try {
         const response = await privateClient.get(
            studentEndpoints.filterDay(startDate, endDate)
         )

         return { response }
      } catch (err) {
         return { err }
      }
   },
   getOne: async (id) => {
      try {
         const response = await privateClient.get(
            studentEndpoints.getOne(id)
         )

         return { response }
      } catch (err) {
         return { err }
      }
   },
   create: async (params) => {
      console.log(params);
      try {
         const response = await privateClient.post(
            studentEndpoints.create,
            params
         )

         return { response };
      } catch (err) {
         return { err }
      }
   },
   updateStatus: async (id, status) => {
      try {
         const response = await privateClient.put(
            studentEndpoints.updateStatus(id, status)
         )

         return { response };
      } catch (err) {
         return { err }
      }
   }
}

export default studentApi;