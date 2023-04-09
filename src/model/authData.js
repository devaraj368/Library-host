const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const authSchema = new Schema({
  name: String,
  email: String,
  password: String,
  confirmPassword: String,
});

const authData = mongoose.model("authDetails", authSchema);

module.exports = authData;
