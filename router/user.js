const express = require("express");
const router = express.Router();
const { Authenticate } = require("../middleware/authenticate");
// const { Validator } = require("../middleware/validator")
const {
  getAllUser,
  UpdateUser,
  getUser,
} = require("../controllers/user/index");

router.post("/all", getAllUser);
router.get("/:id", getUser);
router.put("/update", Authenticate, UpdateUser);
module.exports = router;
