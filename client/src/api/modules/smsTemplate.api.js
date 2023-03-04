import privateClient from '../client/private.client';

const smsTemplateEndpoints = {
   getAll: "sms-template",
   getOne: (id) => `sms-template/${id}`,
   createCourse: "sms-template/create",
   delete: (id) => `sms-template/delete/${id}`
}

const smsTemplateApi = {
   getAll: async () => {
      try {
         const response = await privateClient.get(smsTemplateEndpoints.getAll);
         return { response };
      } catch (err) {
         return { err };
      }
   },
   getOne: async (id) => {
      try {
         const response = await privateClient.get(smsTemplateEndpoints.getOne(id));
         return { response };
      } catch (err) {
         return { err };
      }
   },
   create: async (params) => {
      try {
         const response = await privateClient.post(
            smsTemplateEndpoints.createCourse,
            params
         );
         return { response };
      } catch (err) {
         return { err };
      }
   },
   delete: async (id) => {
      try {
         const response = await privateClient.delete(smsTemplateEndpoints.delete(id));
         return { response };
      } catch (err) {
         return { err };
      }
   }
}

export default smsTemplateApi;