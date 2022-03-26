const express = require("express");
const router = express.Router();
const { Authenticate } = require("../middleware/Authenticate")

const { getAllUser,UpdateUser } = require("../controllers/user/index");



router.get("/all", getAllUser);
router.put("/update", Authenticate, UpdateUser);

module.exports = router;
