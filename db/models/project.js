const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    tech: [String],
    need: [String],
    likes: [{ type: Schema.Types.ObjectId, ref: "USER" }],
    request_list: [{ type: Schema.Types.ObjectId, ref: "USER" }],
    team: [{ type: Schema.Types.ObjectId, ref: "USER" }],
    creator_id: { type: Schema.Types.ObjectId, ref: "USER" },
    creator_name: String,
    is_team_full: Boolean,
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ProjectModel = mongoose.model("PROJECT", projectSchema);
exports.ProjectModel = ProjectModel;
