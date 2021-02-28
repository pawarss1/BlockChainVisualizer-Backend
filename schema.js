const { Schema } = require("mongoose");

const userSchema = new Schema({
  userName: String,
  password: String,
  userEmail: String,
});

const blockSchema = new Schema({
  index: Number,
  hash: String,
  previousHash: String,
  timestamp: Date,
  data: String,
  nonce: String,
});

exports.blockSchema = blockSchema;
exports.userSchema = userSchema;
