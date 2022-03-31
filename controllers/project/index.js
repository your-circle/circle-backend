const { ProjectModel } = require("../../db/Schema");

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

    const User=req.rootUser;
    const Project = {
      ...ProjectData,
      creator: User._id,
    };

    const newProject = new ProjectModel(Project);
    await newProject.save(async (err) => {
      if (err) {
        return res.status(404).send({ message: err });
      }

      User.projects.push(newProject._id);

      await User.save((err) => {
        if (err) {
          return res.status(404).send({ message: "Some Error in add project to user list" });
        }

        return res.status(200).send({
          message: "Project added successfully",
          data: {
            title: Project.title,
            description: Project.description,
            creator: Project.creator,
          },
        });

      })
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
    const project = await ProjectModel.findById(id);
    res.send({ message: "Project by this id is as follow", data: project });
  } catch (error) {
    res.status(404).send({ message: "Sorry! no project by this id exists" });
  }
};

exports.getProjectById = getProjectById;
exports.getAllProject = getAllProject;
exports.AddProject = AddProject;
