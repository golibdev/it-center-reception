const adminModel = require('../models/admin');
const jsonwebtoken = require('jsonwebtoken');
const responseHandler = require('../handlers/response.handler');

const signup = async (req, res) => {
   try {
      const { username, password, displayName } = req.body;

      const checkAdmin = await adminModel.findOne({ username });

      if (checkAdmin) return responseHandler.badrequest(res, "username already used")

      const admin = new adminModel();
      admin.displayName = displayName;
      admin.username = username;
      admin.setPassword(password);

      await admin.save();

      const token = jsonwebtoken.sign(
         { data: admin.id },
         process.env.TOKEN_SECRET,
      )

      responseHandler.created(res, {
         token,
         ...admin._doc,
         id: admin.id
      })
   } catch (err) {
      responseHandler.error(res, err);
   }
}

const signin = async (req, res) => {
   try {
      const { username, password } = req.body;

      const admin = await adminModel.findOne({ username }).select("username password salt id displayName");

      if(!admin) return responseHandler.badrequest(res, "User not exists");

      if(!admin.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");
      
      const token = jsonwebtoken.sign(
         { data: admin.id },
         process.env.TOKEN_SECRET
      )

      admin.password = undefined;
      admin.salt = undefined;

      responseHandler.ok(res, {
         token,
         ...admin._doc,
         id: admin.id
      })
   } catch (err) {
      responseHandler.error(res, err)
   }
};

const updatePassword = async (req, res) => {
   try {
      const { password, newPassword } = req.body;

      const admin = await adminModel.findById(req.admin.id).select("password id salt");

      if(!admin) return responseHandler.unathorize(res);

      if(!admin.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

      admin.setPassword(newPassword);

      await admin.save();

      responseHandler.ok(res, { message: "update password successfully" });
   } catch (err) {
      responseHandler.error(res, err);
   }
};

const getInfo = async (req, res) => {
   try {
      const admin = await adminModel.findById(req.admin.id);

      if(!admin) return responseHandler.notfound(res);

      responseHandler.ok(res, admin)
   } catch (err) {
      responseHandler.error(res, err);
   }
}

module.exports = {
   signup,
   signin,
   updatePassword,
   getInfo
}