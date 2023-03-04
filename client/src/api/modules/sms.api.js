import privateClient from '../client/private.client';

const smsEndpoints = {
   generateToken: "sms/generate-token",
   sendMessage: (token) => `sms/send-sms?token=${token}`,
   sendSmsAllUser: (token) => `sms/send-sms-all-user?token=${token}`
}

const smsApi = {
   generateToken: async () => {
      try {
         const response = await privateClient.get(smsEndpoints.generateToken)
         return { response };
      } catch (err) {
         return { err }
      }
   },
   sendMessage: async (students, message, token) => {
      try {
         const response = await privateClient.post(
            smsEndpoints.sendMessage(token),
            { students, message }
         )
         return { response };
      } catch (err) {
         return { err }
      }
   },
   sendMessageAllUser: async (message, token) => {
      try {
         const response = await privateClient.post(
            smsEndpoints.sendSmsAllUser(token),
            { message }
         )
         return { response };
      } catch (err) {
         return { err }
      }
   },
}

export default smsApi;