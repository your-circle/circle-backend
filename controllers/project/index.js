const { ProjectModel } = require("../../db/models/project");
const { UserModel } = require("../../db/models/user");
const { ProjectJoin, ProjectAdd } = require("../notification/const");
const { AddNotification } = require("../notification/data");
const { GetProjectById } = require("./data");
const mongoose = require("mongoose");
const { GetSkipAndLimit } = require("../helper/limit");
const {
  SuccessResponseHandler,
  ErrorResponseHandler,
} = require("../../utils/response_handler");

const {
  ProjectWithNameExistsMessage,
  ProjectAddedMessage,
  ProjectNotExitsMessage,
  ProjectDataMessage,
  ProjectNotAuthorizedMessage,
  ProjectDeleteMessage,
  ProjectUserInTeamMessage,
  ProjectUserInRequestMessage,
  ProjectUserNotInRequestMessage,
  ProjectUpdateMessage,
  ProjectListMessage,
} = require("../../utils/message");
const req = require("express/lib/request");

const AddProject = async (req, res) => {
  try {
    let ProjectData = req.body;

    const hasProject = await ProjectModel.findOne({
      title: ProjectData.title,
    });

    if (hasProject) {
      return ErrorResponseHandler(res, 404, ProjectWithNameExistsMessage);
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
          return ErrorResponseHandler(
            res,
            404,
            "Some Error in add project to user list"
          );
        }

        return SuccessResponseHandler(res, 200, ProjectAddedMessage, {
          title: Project.title,
          description: Project.description,
          creator_id: Project.creator_id,
        });
      });
    });
  } catch (error) {
    return ErrorResponseHandler(res, 404, error.message);
  }
};

const getAllProject = async (req, res) => {
  try {
    var { title, tech, need } = req.body;

    const { skip, limit } = GetSkipAndLimit(req);

    // console.log(filters);

    let query = {
      $and: [],
    };

    if (title) {
      query["$and"].push({ title: { $regex: title, $options: "i" } });
    }

    if (need && need.length > 0) {
      query["$and"].push({ need: { $in: need } });
    }

    if (tech && tech.length > 0) {
      query["$and"].push({ tech: { $in: tech } });
    }

    if (query["$and"].length == 0) {
      query = {};
    }

    let list = await ProjectModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log(list.length);

    return SuccessResponseHandler(res, 200, ProjectListMessage, list);
  } catch (error) {
    return ErrorResponseHandler(res, 404, error.message);
  }
};

const getProjectById = async (req, res) => {
  try {
    var id = req.params.id;
    const project = await ProjectModel.findById(id)
      .populate("request_list", "_id name")
      .populate("team", "_id name");

    if (project == null) {
      return ErrorResponseHandler(res, 404, ProjectNotExitsMessage);
    }

    return SuccessResponseHandler(res, 200, ProjectDataMessage, project);
  } catch (error) {
    return ErrorResponseHandler(res, 404, ProjectNotExitsMessage);
  }
};

const deleteProjectById = async (req, res) => {
  try {
    const project = await GetProjectById(req);

    if (!project.creator_id.equals(req.rootUser._id)) {
      return ErrorResponseHandler(res, 404, ProjectNotAuthorizedMessage);
    }

    await ProjectModel.findByIdAndDelete(project._id);
    return SuccessResponseHandler(res, 200, ProjectDeleteMessage);
  } catch (error) {
    return ErrorResponseHandler(res, 404, ProjectNotExitsMessage);
  }
};

const JoinRequestForProject = async (req, res) => {
  try {
    const project = await GetProjectById(req);
    const user = req.rootUser;

    if (project.team.includes(user._id)) {
      return ErrorResponseHandler(res, 404, ProjectUserInTeamMessage);
    }

    if (project.request_list.includes(user._id)) {
      return ErrorResponseHandler(res, 404, ProjectUserInRequestMessage);
    }

    project.request_list.push(user._id);

    await project.save(async (error) => {
      if (error) {
        return ErrorResponseHandler(res, 404, error._message);
      }

      req.projectId = project._id;
      req.projectTitle = project.title;
      req.projectCreator = project.creator_id;
      await AddNotification(req, res, ProjectJoin);
    });
  } catch (error) {
    return ErrorResponseHandler(res, 404, ProjectNotExitsMessage);
  }
};

const AddMemberInProject = async (req, res) => {
  try {
    const project = await GetProjectById(req);
    const user = req.rootUser;
    const peerID = mongoose.Types.ObjectId(req.body.user_id);

    // console.log(project.creator, user._id);

    if (!project.creator_id.equals(user._id)) {
      return ErrorResponseHandler(res, 404, ProjectNotAuthorizedMessage);
    }

    if (!project.request_list.includes(peerID)) {
      return ErrorResponseHandler(res, 404, ProjectUserNotInRequestMessage);
    }

    project.request_list.pull(peerID);

    if (project.team.includes(peerID)) {
      return ErrorResponseHandler(res, 404, ProjectUserInTeamMessage);
    }

    project.team.push(peerID);

    await project.save(async (error) => {
      if (error) {
        return ErrorResponseHandler(res, 404, error._message);
      }

      req.projectId = project._id;
      req.projectTitle = project.title;
      req.projectCreator = project.creator_id;
      req.userID = peerID;

      await AddNotification(req, res, ProjectAdd);
    });
  } catch (error) {
    return ErrorResponseHandler(res, 404, ProjectNotExitsMessage);
  }
};

const GetMyProjects = async (req, res) => {
  try {
    var id = req.params.id;

    const { skip, limit } = GetSkipAndLimit(req);

    console.log({ skip, limit });

    const User = await UserModel.findById(id).populate({
      path: "projects",
      options: { sort: { createdAt: -1 }, skip: skip, limit: limit },
    });

    return SuccessResponseHandler(res, 200, ProjectListMessage, User.projects);
  } catch (error) {
    console.log(error);
    return ErrorResponseHandler(res, 400, ProjectNotExitsMessage);
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
      return ErrorResponseHandler(res, 404, ProjectNotAuthorizedMessage);
    }

    await ProjectModel.findOneAndUpdate(filter, update);

    const update_project_data = await ProjectModel.findOne(filter);

    return SuccessResponseHandler(
      res,
      200,
      ProjectUpdateMessage,
      update_project_data
    );
  } catch (e) {
    return ErrorResponseHandler(res, 404, e.message);
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
