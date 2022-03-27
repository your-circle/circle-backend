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
        title: ProjectData.title,
        description: ProjectData.description,
        creator: ProjectData.Creator,
      },
    });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

exports.AddProject = AddProject;
