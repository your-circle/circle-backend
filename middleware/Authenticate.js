const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

app.use(cookieParser());

//this function mainly aims to restores the session of already signed-in user,
// uses a simple technique to find a user's details from token, if no user is found then accordingly
// throw an error
const Authenticate = async (req, res, next) => {
  try {
    console.log(req.cookies);
    const token = req.cookies.jwtToken;

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not Found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
};

module.exports = Authenticate;
