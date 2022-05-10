const { ProjectModel } = require("../../../db/models/project");
const { ProjectJoin, ProjectAdd } = require("../../../utils/const/notifications");
const { AddNotification } = require("../../notification/index").functions;
const mongoose = require("mongoose");
const {
  SuccessResponseHandler,
  ErrorResponseHandler,
} = require("../../../utils/response_handler");


const {GetProjectById}=require("./other")


const {
  ProjectNotExitsMessage,
  ProjectNotAuthorizedMessage,
  ProjectDeleteMessage,
  ProjectUserInTeamMessage,
  ProjectUserInRequestMessage,
  ProjectUserNotInRequestMessage,
  ProjectUpdateMessage,
  ProjectUserInNotTeamMessage,
} = require("../../../utils/const/message");


const RemoveRequestForProject = async (req, res) => {
  try {
    const project = await GetProjectById(req);
    const peerID = mongoose.Types.ObjectId(req.body.user_id);
    const user = req.rootUser;

    if (!project.creator_id.equals(user._id)) {
      return ErrorResponseHandler(res, 404, ProjectNotAuthorizedMessage);
    }

    if (!project.request_list.includes(peerID)) {
      return ErrorResponseHandler(res, 404, ProjectUserInNotTeamMessage);
    }

    project.request_list.pull(peerID);

    await project.save(async (error) => {
      if (error) {
        return ErrorResponseHandler(res, 404, error._message);
      }
      return SuccessResponseHandler(res, 200, ProjectDeleteMessage);
    });
  } catch (error) {
    return ErrorResponseHandler(res, 404, ProjectNotExitsMessage);
  }
};

const RemoveMemberInProject = async (req, res) => {
  try {
    const project = await GetProjectById(req);
    const peerID = mongoose.Types.ObjectId(req.body.user_id);
    const user = req.rootUser;

    if (!project.creator_id.equals(user._id)) {
      return ErrorResponseHandler(res, 404, ProjectNotAuthorizedMessage);
    }

    if (!project.team.includes(peerID)) {
      return ErrorResponseHandler(res, 404, ProjectUserInNotTeamMessage);
    }

    project.team.pull(peerID);

    await project.save(async (error) => {
      if (error) {
        return ErrorResponseHandler(res, 404, error._message);
      }
      return SuccessResponseHandler(res, 200, ProjectDeleteMessage);
    });
  } catch (error) {
    return ErrorResponseHandler(res, 404, ProjectNotExitsMessage);
  }
};

const JoinRequestForProject = async (req, res) => {
  try {
    const project = await GetProjectById(req);
    const user = req.rootUser;

    if (project.creator_id.equals(user._id)) {
      return ErrorResponseHandler(res, 404, ProjectUserInTeamMessage);
    }

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

const UpdateProject = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
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


exports.AddMemberInProject = AddMemberInProject;
exports.JoinRequestForProject = JoinRequestForProject;
exports.UpdateProject = UpdateProject;
exports.RemoveRequestForProject = RemoveRequestForProject;
exports.RemoveMemberInProject = RemoveMemberInProject;


