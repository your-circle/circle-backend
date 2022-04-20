const express = require("express");
const router = express.Router();

const { Authenticate } = require("../middleware/authenticate");
const { Validator } = require("../middleware/validator");
const { ProjectValidation } = require("../utils/validator/project");

const {
  AddProject,
  getAllProject,
  getProjectById,
  JoinRequestForProject,
  AddMemberInProject,
  GetMyProjects,
  UpdateProject,
  deleteProjectById,
} = require("../controllers/project/index");

router.post("/all", Authenticate, getAllProject);
router.get("/:id", getProjectById);
router.post(
  "/add-project",
  Authenticate,
  ProjectValidation,
  Validator,
  AddProject
);
router.post("/join-request/:id", Authenticate, JoinRequestForProject);
router.post("/add-member/:id", Authenticate, AddMemberInProject);
router.post("/my-projects/:id", Authenticate, GetMyProjects);
router.put("/update/:id", Authenticate, UpdateProject);
router.delete("/delete/:id", Authenticate, deleteProjectById);

module.exports = router;
