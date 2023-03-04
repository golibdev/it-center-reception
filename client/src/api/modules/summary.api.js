import privateClient from '../client/private.client';

const summaryEndpoints = {
   summaryData: "summary"
}

const summaryApi = {
   summary: async () => {
      try {
         const response = await privateClient.get(summaryEndpoints.summaryData);
         return { response }
      } catch (err) {
         return { err }
      }
   },
}

export default summaryApi;