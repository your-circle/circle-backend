const express = require("express");
const router = express.Router();

const { Authenticate } = require("../middleware/authenticate");
const { Validator } = require("../middleware/validator");
const { ProjectValidation } = require("../utils/validator/project");

const {
  AddProject,
  getAllProject,
  getProjectById,
} = require("../controllers/project/index");

router.get("/all", getAllProject);
router.get("/:id", getProjectById);

router.post(
  "/add-project",
  Authenticate,
  Validator,
  ProjectValidation,
  AddProject
);

module.exports = router;
