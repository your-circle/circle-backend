const { ProjectModel } = require("../../db/models/project");
const { UserModel } = require("../../db/models/user");
const { ProjectJoin, ProjectAdd } = require("../notification/const");
const { AddNotification } = require("../notification/data");
const { GetProjectById } = require("./data");
const mongoose = require("mongoose");

const AddProject = async (req, res) => {
  try {
    let ProjectData = req.body;

    const hasProject = await ProjectModel.findOne({
      title: ProjectData.title,
    });

    if (hasProject) {
      return res
        .status(404)
        .send({ message: "A project with a same name already exists" });
    }

    const User = req.rootUser;
    const Project = {
      ...ProjectData,
      creator_id: User._id,
      creator_name: User.name,
    };

    const newProject = new ProjectModel(Project);
    await newProject.save(async (err) => {
      if (err) {
        return res.status(404).send({ message: err });
      }

      User.projects.push(newProject._id);

      await User.save((err) => {
        if (err) {
          return res.status(404).send({
            message: "Some Error in add project to user list",
          });
        }

        return res.status(200).send({
          message: "Project added successfully",
          data: {
            title: Project.title,
            description: Project.description,
            creator_id: Project.creator_id,
          },
        });
      });
    });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const getAllProject = async (req, res) => {
  try {
    const list = await ProjectModel.find({});
    res.send({ message: "All projects so far", data: list });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    var id = req.params.id;
    const project = await ProjectModel.findById(id)
      .populate("request_list", "_id name")
      .populate("team", "_id name");

    if (project == null) {
      return res.status(404).send({ message: "Project is not exist." });
    }

    res.send({ message: "Project by this id is as follow", data: project });
  } catch (error) {
    res.status(404).send({
      message: "Sorry! no project by this id exists",
    });
  }
};

const deleteProjectById = async (req, res) => {
  try {
    const project = await GetProjectById(req);

    if (!project.creator_id.equals(req.rootUser._id)) {
      return res.status(404).send({ message: "You don't own the project" });
    }

    await ProjectModel.findByIdAndDelete(project._id);
    res.send({ message: "Project is Deleted successfully", data: null });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      message: "Sorry! no project by this id exists",
    });
  }
};

const JoinRequestForProject = async (req, res) => {
  try {
    const project = await GetProjectById(req);
    const user = req.rootUser;

    if (project.team.includes(user._id)) {
      return res.status(400).send({ message: "User is in Team" });
    }

    if (project.request_list.includes(user._id)) {
      return res.status(400).send({ message: "User is in request List" });
    }

    project.request_list.push(user._id);

    await project.save(async (error) => {
      if (error) {
        return res.status(404).send({ message: err });
      }

      req.projectId = project._id;
      req.projectTitle = project.title;
      req.projectCreator = project.creator_id;
      await AddNotification(req, res, ProjectJoin);
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      message: "Sorry! no project by this id exists",
    });
  }
};

const AddMemberInProject = async (req, res) => {
  try {
    const project = await GetProjectById(req);
    const user = req.rootUser;
    const peerID = mongoose.Types.ObjectId(req.body.userID);

    // console.log(project.creator, user._id);

    if (!project.creator_id.equals(user._id)) {
      return res.status(404).send({ message: "You don't own the project" });
    }

    if (!project.request_list.includes(peerID)) {
      return res.status(400).send({ message: "User is not in request List" });
    }

    project.request_list.pull(peerID);

    if (project.team.includes(peerID)) {
      return res.status(400).send({ message: "User is in Team" });
    }

    project.team.push(peerID);

    await project.save(async (error) => {
      if (error) {
        return res.status(404).send({ message: err });
      }

      req.projectId = project._id;
      req.projectTitle = project.title;
      req.projectCreator = project.creator_id;
      req.userID = peerID;

      await AddNotification(req, res, ProjectAdd);
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      message: "Sorry! no project by this id exists",
    });
  }
};

const GetMyProjects = async (req, res) => {
  try {
    var id = req.params.id;
    // console.log(name);
    const ProjectList = await UserModel.findById(id).populate("projects");
    res.send({
      message: "following are user projects",
      data: ProjectList.projects,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const UpdateProject = async (req, res) => {
  try {
    const filter = { id: req.params.id };
    const update = {
      title: req.body.title,
      description: req.body.description,
      tech: req.body.tech,
      need: req.body.need,
    };

    const project = await GetProjectById(req);

    if (!project.creator_id.equals(req.rootUser._id)) {
      return res.status(404).send({ message: "You don't own the project" });
    }

    await ProjectModel.findOneAndUpdate(filter, update);

    const update_project_data = await ProjectModel.findOne(filter);

    return res.send({
      message: "Updated the project data successfully",
      data: update_project_data,
    });
  } catch (e) {
    res.status(404).send({ message: e.message });
  }
};

exports.getProjectById = getProjectById;
exports.getAllProject = getAllProject;
exports.AddProject = AddProject;
exports.AddMemberInProject = AddMemberInProject;
exports.JoinRequestForProject = JoinRequestForProject;
exports.UpdateProject = UpdateProject;
exports.deleteProjectById = deleteProjectById;
exports.GetMyProjects = GetMyProjects;
