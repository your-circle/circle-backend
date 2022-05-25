const express = require("express");
const { forgetpassword, passwordReset } = require("../controllers/user/crud/update");
const router = express.Router();
const { Authenticate } = require("../middleware/authenticate");
// const { Validator } = require("../middleware/validator")
const {
  GetAllUser,
  UpdateUser,
  GetUser,
} = require("../controllers/user/index").functions;

router.post("/all", Authenticate, GetAllUser);
router.get("/:id", GetUser);
router.put("/update", Authenticate, UpdateUser);
router.post("/forgot-password/:id",forgetpassword);
router.post("/:id/password-reset",passwordReset);
module.exports = router;
