const { ProjectModel } = require("../../../db/models/project");
const {
  SuccessResponseHandler,
  ErrorResponseHandler,
} = require("../../../utils/response_handler");

const {GetProjectById}=require("./other")

const {
  ProjectNotExitsMessage,
  ProjectNotAuthorizedMessage,
  ProjectDeleteMessage,
} = require("../../../utils/const/message");



const deleteProjectById = async (req, res) => {
  try {
    let project = await GetProjectById(req);

    if (!project.creator_id.equals(req.rootUser._id)) {
      return ErrorResponseHandler(res, 404, ProjectNotAuthorizedMessage);
    }

    project = await ProjectModel.findByIdAndUpdate(project._id, {
      status: false,
    });
    return SuccessResponseHandler(res, 200, ProjectDeleteMessage);
  } catch (error) {
    return ErrorResponseHandler(res, 404, ProjectNotExitsMessage);
  }
};


exports.deleteProjectById = deleteProjectById;

