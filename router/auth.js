const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

// const {SignIn,SignUp}= require('../controllers/auth/index')

router.get("/", (req, res) => {
  res.send(`Hello world from the server rotuer js`);
});

// router.post('/SignIn',SignIn)
// router.post('/SignUp',SignIn)

module.exports = router;
