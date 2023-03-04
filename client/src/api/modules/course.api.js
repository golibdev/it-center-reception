import privateClient from '../client/private.client';

const courseEndpoints = {
   getAll: "course",
   getOne: (id) => `course/${id}`,
   createCourse: "course/create",
   updateCourse: (id) => `course/update/${id}`,
   updateStatusCourse: (id) => `course/update-status/${id}`
}

const courseApi = {
   getAll: async () => {
      try {
         const response = await privateClient.get(courseEndpoints.getAll);
         return { response };
      } catch (err) {
         return { err };
      }
   },
   getOne: async (id) => {
      try {
         const response = await privateClient.get(courseEndpoints.getOne(id));
         return { response };
      } catch (err) {
         return { err };
      }
   },
   create: async (params) => {
      try {
         const response = await privateClient.post(
            courseEndpoints.createCourse,
            params
         );
         return { response };
      } catch (err) {
         return { err };
      }
   },
   updateStatus: async (id, status) => {
      try {
         const response = await privateClient.put(
            courseEndpoints.updateStatusCourse(id),
            { status }
         )

         return { response }
      } catch (err) {
         return { err }
      }
   },
   update: async (id, params) => {
      try {
         const response = await privateClient.put(
            courseEndpoints.updateCourse(id),
            params
         );
         return { response };
      } catch (err) {
         return { err };
      }
   }
}

export default courseApi;