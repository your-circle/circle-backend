const express = require("express");
const router = express.Router();

const { Authenticate } = require("../middleware/Authenticate")
const { Validator } = require("../middleware/Validator")

const { getAllUser,UpdateUser } = require("../controllers/user/index");
const { UpdateUserValidation} = require("../controllers/user/validation");


router.get("/all", getAllUser);
router.put("/update", Authenticate,UpdateUserValidation,Validator,UpdateUser);

module.exports = router;
