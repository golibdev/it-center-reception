const jsonwebtoken = require('jsonwebtoken');
const responseHandler = require('../handlers/response.handler');
const adminModel = require('../models/admin');

const tokenDecode = (req) => {
   try {
      const bearerHeader = req.headers['authorization'];

      if(bearerHeader) {
         const token = bearerHeader.split(' ')[1];
         return jsonwebtoken.verify(
            token,
            process.env.TOKEN_SECRET
         )
      }

      return false;
   } catch {
      return false
   }
}

const auth = async (req, res, next) => {
   try {
      const tokenDecoded = tokenDecode(req);

      if(!tokenDecoded) return responseHandler.unathorize(res);

      const admin = await adminModel.findById(tokenDecoded.data);

      if(!admin) return responseHandler.unathorize(res);

      req.admin = admin;

      next();
   } catch (err) {
      responseHandler.error(res)
   }
}

module.exports = {
   auth,
   tokenDecode
}