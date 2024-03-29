const express = require("express");
const router = express.Router();

const { Authenticate } = require("../middleware/authenticate");
const { Validator } = require("../middleware/validator");
const { ProjectValidation } = require("../utils/validator/project");

const {
  AddProject,
  GetAllProject,
  GetProjectById,
  JoinRequestForProject,
  AddMemberInProject,
  GetMyProjects,
  UpdateProject,
  deleteProjectById,
  RemoveRequestForProject,
  RemoveMemberInProject,
} = require("../controllers/project/index").functions;

router.post("/all", Authenticate, GetAllProject);
router.get("/:id", GetProjectById);
router.post(
  "/add-project",
  Authenticate,
  ProjectValidation,
  Validator,
  AddProject
);
router.post("/join-request/:id", Authenticate, JoinRequestForProject);
router.post("/remove-request/:id", Authenticate, RemoveRequestForProject);
router.post("/add-member/:id", Authenticate, AddMemberInProject);
router.post("/remove-member/:id", Authenticate, RemoveMemberInProject);
router.post("/my-projects/:id", Authenticate, GetMyProjects);
router.put("/update/:id", Authenticate, UpdateProject);
router.delete("/delete/:id", Authenticate, deleteProjectById);

module.exports = router;
