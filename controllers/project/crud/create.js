const { ProjectModel } = require("../../../db/models/project");

const {
  SuccessResponseHandler,
  ErrorResponseHandler,
} = require("../../../utils/response_handler");
const {
  ProjectWithNameExistsMessage,
  ProjectAddedMessage,
} = require("../../../utils/const/message");



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


exports.AddProject = AddProject;


