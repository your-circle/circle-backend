const express = require("express");
const router = express.Router();

const { Authenticate } = require("../middleware/Authenticate")
const { Validator } = require("../middleware/Validator")

const { SignIn, SignUp, verifyAuthToken } = require("../controllers/auth/index");
const { SignUpValidation ,LoginValidation} = require("../controllers/auth/validation");



router.get("/verifyToken", Authenticate, verifyAuthToken);
router.post("/signup",SignUpValidation,Validator, SignUp);
router.post("/login",LoginValidation,Validator, SignIn);

module.exports = router;
