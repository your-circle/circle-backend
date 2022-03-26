const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const { Authenticate } = require("../middleware/Authenticate")

const { SignIn, SignUp, getAllUser, verifyAuthToken,UpdateUser } = require("../controllers/auth/index");

router.get("/", (req, res) => {
  res.send(`Hello world from the server rotuer js`);
});


router.get("/verifyToken", Authenticate, verifyAuthToken);
router.post("/signup", SignUp);
router.post("/login", SignIn);
//
module.exports = router;
