const mongoose = require('mongoose');
const modelOptions = require('./model.options');
const crypto = require('crypto');

const adminSchema = new mongoose.Schema({
   displayName: {
      type: String,
      required: true
   },
   username: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true,
      select: false
   },
   salt: {
      type: String,
      required: true,
      select: false
   }
}, modelOptions);

adminSchema.methods.setPassword = function (password) {
   this.salt = crypto.randomBytes(16).toString("hex");

   this.password = crypto.pbkdf2Sync(
      password,
      this.salt,
      1000,
      64,
      "sha512"
   ).toString("hex");
}

adminSchema.methods.validPassword = function(password) {
   const hash = crypto.pbkdf2Sync(
      password,
      this.salt,
      1000,
      64,
      "sha512"
   ).toString("hex");

   return this.password === hash;
}

const adminModel = mongoose.model("Admin", adminSchema);

module.exports = adminModel;