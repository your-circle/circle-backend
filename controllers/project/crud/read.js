const { ProjectModel } = require("../../../db/models/project");
const { UserModel } = require("../../../db/models/user");
const { GetSkipAndLimit } = require("../../../utils/helper/limit");
const {
  SuccessResponseHandler,
  ErrorResponseHandler,
} = require("../../../utils/response_handler");


const {
  ProjectNotExitsMessage,
  ProjectDataMessage,
  ProjectListMessage,
} = require("../../../utils/const/message");




const GetAllProject = async (req, res) => {
  try {
    var { title, tech, need } = req.body;

    const { skip, limit } = GetSkipAndLimit(req);

    let query = {
      // $and: [{ status: true }],
      $and: [],
    };

    if (title) {
      query["$and"].push({
        $or: [
          { title: { $regex: title, $options: "i" } },
          { description: { $regex: title, $options: "i" } },
        ],
      });
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


    return SuccessResponseHandler(res, 200, ProjectListMessage, list);
  } catch (error) {
    return ErrorResponseHandler(res, 404, error.message);
  }
};

const GetProjectById = async (req, res) => {
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

const GetMyProjects = async (req, res) => {
  try {
    var id = req.params.id;

    const { skip, limit } = GetSkipAndLimit(req);

    const User = await UserModel.findById(id).populate({
      path: "projects",
      options: { sort: { createdAt: -1 }, skip: skip, limit: limit },
    });

    return SuccessResponseHandler(res, 200, ProjectListMessage, User.projects);
  } catch (error) {
    return ErrorResponseHandler(res, 400, ProjectNotExitsMessage);
  }
};


exports.GetProjectById = GetProjectById;
exports.GetAllProject = GetAllProject;
exports.GetMyProjects = GetMyProjects;
exports.GetMyProjects = GetMyProjects;


