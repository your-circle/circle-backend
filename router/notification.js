const express = require("express");
const router = express.Router();

const { Authenticate } = require("../middleware/Authenticate");
const { Validator } = require("../middleware/Validator");

const {
  GetNotification,
  MarkNotification,
} = require("../controllers/notification/index");

router.get("/all", GetNotification);
router.Post("/:id", Authenticate, Validator, MarkNotification);

module.exports = router;
