const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const { SignIn, SignUp, getAllUser } = require("../controllers/auth/index");

router.get("/", (req, res) => {
  res.send(`Hello world from the server rotuer js`);
});

router.get("/users", getAllUser);
router.post("/sign-up", SignUp);
router.post("/sign-in", SignIn);
//
module.exports = router;
