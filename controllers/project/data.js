const { ProjectModel } = require("../../db/models/project");


const GetProjectById= async (req)=>{
    var id = req.params.id;
    console.log(id)
    const project = await ProjectModel.findById(id);
    return project;
}


exports.GetProjectById=GetProjectById;