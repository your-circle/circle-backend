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

    const Project = {
      ...ProjectData,
      creator: req.rootUser.name,
    };

    const newProject = new ProjectModel(Project);
    await newProject.save((err) => {
      if (err) {
        return res.status(404).send({ message: "Validation Unsuccessful" });
      }
    });

    res.status(200).send({
      message: "Project added successfully",
      data: {
        title: Project.title,
        description: Project.description,
        creator: Project.creator,
      },
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
    res.send(404).send({ message: error.message });
  }
};

exports.getAllProject = getAllProject;
exports.AddProject = AddProject;
