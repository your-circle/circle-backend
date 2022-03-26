const jwt = require("jsonwebtoken");
const { UserModel } = require("../db/Schema");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

app.use(cookieParser());

//this function mainly aims to restores the session of already signed-in user,
// uses a simple technique to find a user's details from token, if no user is found then accordingly
// throw an error
const Authenticate = async (req, res, next) => {
  try {

    const token = req.headers.authorization;

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);


    const rootUser = await UserModel.findOne({
      _id: verifyToken._id,
    });

    if (!rootUser) {
      throw new Error("User not Found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (err) {
    res.status(401).send({ message:err.message});
    // console.log(err);
  }
};

exports.Authenticate = Authenticate;
