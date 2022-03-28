const express = require("express");
const router = express.Router();

const { Authenticate } = require("../middleware/Authenticate")
const { Validator } = require("../middleware/Validator")

const { getAllUser, UpdateUser, getUser } = require("../controllers/user/index");



router.get("/all", getAllUser);
router.get("/:id", getUser);
router.put("/update", Authenticate, UpdateUser);

module.exports = router;
