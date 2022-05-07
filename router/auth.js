const express = require("express");
const router = express.Router();

const { Authenticate } = require("../middleware/authenticate")
const { Validator } = require("../middleware/validator")
const { SignUpValidation ,LoginValidation} = require("../utils/validator/auth");

const { 
    SignIn, 
    SignUp, 
    verifyAuthToken 
} = require("../controllers/auth/index").functions;


router.post("/signup",SignUpValidation,Validator, SignUp);
router.post("/login",LoginValidation,Validator, SignIn);
router.get("/verifyToken", Authenticate, verifyAuthToken);

module.exports = router;
