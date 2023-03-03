import publicClient from '../client/public.client';
import privateClient from '../client/private.client';

const adminEndpoints = {
   signin: "admin/signin",
   updatePassword: "admin/update-password",
   info: "admin/info"
}

const adminApi = {
   signin: async ({ username, password }) => {
      try {
         const response = await publicClient.post(
            adminEndpoints.signin,
            { username, password}
         )

         return { response }
      } catch (err) {
         return { err }
      }
   },
   info: async () => {
      try {
         const response = await privateClient.get(adminEndpoints.info);
         return { response }
      } catch (err) {
         return { err }
      }
   },
   updatePassword: async ({ password, newPassword }) => {
      try {
         const response = await privateClient.put(
            adminEndpoints.updatePassword,
            { password, newPassword }
         )

         return { response }
      } catch (err) {
         return { err }
      }
   }
}

export default adminApi;