const express = require("express");
const router = express.Router();

const { Authenticate } = require("../middleware/Authenticate");
const { Validator } = require("../middleware/Validator");

const { AddProject } = require("../controllers/project/index");
const { ProjectValidation } = require("../controllers/project/validation");

router.post(
  "/add-project",
  Authenticate,
  Validator,
  ProjectValidation,
  AddProject
);

module.exports = router;
