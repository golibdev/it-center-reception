import privateClient from '../client/private.client';

const courseTimeEndpoints = {
   getAll: "course-time",
   getOne: (id) => `course-time/${id}`,
   createCourseTime: "course-time/create",
   updateCourseTime: (id) => `course-time/update/${id}`,
}

const courseTimeApi = {
   getAll: async () => {
      try {
         const response = await privateClient.get(courseTimeEndpoints.getAll);
         return { response };
      } catch (err) {
         return { err };
      }
   },
   getOne: async (id) => {
      try {
         const response = await privateClient.get(courseTimeEndpoints.getOne(id));
         return { response };
      } catch (err) {
         return { err };
      }
   },
   create: async (params) => {
      try {
         const response = await privateClient.post(
            courseTimeEndpoints.createCourseTime,
            params
         );
         return { response };
      } catch (err) {
         return { err };
      }
   },
   update: async (id, params) => {
      try {
         const response = await privateClient.put(
            courseTimeEndpoints.updateCourseTime(id),
            params
         );
         return { response };
      } catch (err) {
         return { err };
      }
   }
}

export default courseTimeApi;