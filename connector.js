// const mongoURI = "mongodb://localhost:27017" + "/Contact"
const mongoURI =
  "mongodb+srv://cris:cris@cluster0.oo7o6.mongodb.net/BlockChain?retryWrites=true&w=majority";

let mongoose = require("mongoose");
const { userSchema, blockSchema } = require("./schema");

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connection established with mongodb server online");
  })
  .catch((err) => {
    console.log("error while connection", err);
  });

userDb = mongoose.model("User", userSchema);
blockDb = mongoose.model("Block", blockSchema);

exports.blockDb = blockDb;
exports.userDb = userDb;
