const express = require("express");
const router = express.Router();

const { Authenticate } = require("../middleware/Authenticate");
const { Validator } = require("../middleware/Validator");

const {
  AddProject,
  getAllProject,
  getProjectById,
} = require("../controllers/project/index");
const { ProjectValidation } = require("../controllers/project/validation");

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
