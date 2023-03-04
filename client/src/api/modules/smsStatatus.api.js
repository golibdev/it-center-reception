import privateClient from '../client/private.client';

const smsStatusEndpoints = {
   getAll: "sms-status",
   getPagination: (page) => `sms-status?page=${page}`
}

const smsStatusApi = {
   getAll: async () => {
      try {
         const response = await privateClient.get(smsStatusEndpoints.getAll);
         return { response };
      } catch (err) {
         return { err };
      }
   },
   getPagination: async (page) => {
      try {
         const response = await privateClient.get(
            smsStatusEndpoints.getPagination(page)
         )

         return { response }
      } catch (err) {
         return { err }
      }
   },
}

export default smsStatusApi;