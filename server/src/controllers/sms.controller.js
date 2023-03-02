const axios = require("axios");
const responseHandler = require("../handlers/response.handler");

const generateToken = async (req, res) => {
   const SMSSHLYUZAPIURL = process.env.SMS_SHLYUZ_API_URL;
   const email = process.env.ESKIZ_EMAIL;
   const password = process.env.ESKIZ_PASSWORD;
   try {
      const response = await axios.post(`${SMSSHLYUZAPIURL}auth/login`, {
         email,
         password,
      });

      const data = response.data;

      responseHandler.ok(res, data);
   } catch (err) {
      responseHandler.error(res, err);
   }
};

const sendMessage = async (req, res) => {
   const SMSSHLYUZAPIURL = process.env.SMS_SHLYUZ_API_URL;
   try {
      const token = req.query.token;

      const mobilePhones = req.body.mobilePhones;
      const message = req.body.message;
      const data = [];

      for (let i = 0; i < mobilePhones.length; i++) {
         const phone = mobilePhones[i].phone;

         const response = await axios.post(
            `${SMSSHLYUZAPIURL}message/sms/send`,
            {
               mobile_phone: phone,
               message,
            },
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
               },
            }
         );

         data.push(response.data);
      }

      if (data.length === mobilePhones.length) {
         responseHandler.ok(res, data);
      }
   } catch (err) {
      responseHandler.error(res, err);
   }
};

module.exports = {
   generateToken,
   sendMessage,
};
