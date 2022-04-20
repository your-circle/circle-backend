const express = require("express");
const router = express.Router();

const { Authenticate } = require("../middleware/authenticate");
const { Validator } = require("../middleware/validator");

const {
  GetNotification,
  MarkNotification,
  StatusNotification,
} = require("../controllers/notification/index");

router.post("/all", Authenticate, Validator, GetNotification);
router.post("/mark_read", Authenticate, Validator, MarkNotification);
router.post("/status", Authenticate, StatusNotification);

module.exports = router;
