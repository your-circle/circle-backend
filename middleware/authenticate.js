const jwt = require("jsonwebtoken");
const { UserModel } = require("../db/models/user");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const { ErrorResponseHandler } = require("../utils/response_handler");

app.use(cookieParser());

//this function mainly aims to restores the session of already signed-in user,
// uses a simple technique to find a user's details from token, if no user is found then accordingly
// throw an error
const Authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

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
    ErrorResponseHandler(res, 401, "Token is not valid");
    // console.log(err);
  }
};

exports.Authenticate = Authenticate;
