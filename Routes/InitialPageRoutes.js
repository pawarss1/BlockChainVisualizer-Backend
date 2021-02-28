const express = require("express");
const routes = express.Router();
routes.use(express.json()); // added body key to req
const { userDb } = require("../connector");

const isNullOrUndefined = (val) => {
  return val === null || val === undefined || val === "";
};

routes.get("/login", async (req, res) => {
  const { userName, password } = req.query;
  const existingUser = await userDb.findOne({ userName });
  if (isNullOrUndefined(userName) || isNullOrUndefined(password)) {
    res
      .status(400)
      .send({ loginSuccess: false, errorMsg: "Required Fields missing." });
  } else if (isNullOrUndefined(existingUser)) {
    res.status(400).send({
      loginSuccess: false,
      errorMsg: "User not registered with us. Please click on Sign Up.",
    });
  } else {
    if (existingUser.password === password) {
      res.send({
        loginSuccess: true,
        newUser: existingUser,
      });
    } else {
      res
        .status(400)
        .send({ loginSuccess: false, errorMsg: "Password Incorrect." });
    }
  }
});

routes.post("/signUp", async (req, res) => {
  const { userName, password, userEmail } = req.body;
  if (
    isNullOrUndefined(userName) ||
    isNullOrUndefined(password) ||
    isNullOrUndefined(userEmail)
  ) {
    res
      .status(400)
      .send({
        success: false,
        errorMsg: "Required Fields missing.",
        alreadyRegistered: false,
      });
    return;
  }
  const existingUserList = await userDb.find({
    $or: [{ userName: userName }, { userEmail: userEmail }],
  });

  if (existingUserList.length > 0) {
    let errMsg = "";
    if (userName === existingUserList[0].userName) {
      errMsg =
        "You have a doppelgänger in terms of Username, Please think of some different Username";
    } else {
      errMsg = "User already registered with us. Please click on Login button.";
    }
    res.status(400).send({
      alreadyRegistered: true,
      errorMsg: errMsg,
      success: true,
    });
  } else {
    const newUser = new userDb({
      userName,
      password,
      userEmail,
    });
    await newUser.save();
    res.send({
      alreadyRegistered: false,
      newUser,
      success: true,
    });
  }
});


module.exports = routes;
