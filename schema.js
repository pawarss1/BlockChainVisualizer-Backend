const { Schema } = require("mongoose");

const userSchema = new Schema({
  userName: String,
  password: String,
  userEmail: String,
});

const blockSchema = new Schema({
  hash: String,
  prevHash: String,
  timeStamp: String,
  data: String,
  nonce: String,
});

exports.blockSchema = blockSchema;
exports.userSchema = userSchema;
