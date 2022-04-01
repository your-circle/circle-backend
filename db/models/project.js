const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    tech: [String],
    open_to: [String],
    likes: [{ type: Schema.Types.ObjectId, ref: 'USER' }],
    request_list: [{ type: Schema.Types.ObjectId, ref: 'USER' }],
    team: [{ type: Schema.Types.ObjectId, ref: 'USER' }],
    creator: { type: Schema.Types.ObjectId, ref: 'USER' },
    is_team_full: Boolean,
  },
  { timestamps: true }
);

const ProjectModel = mongoose.model("PROJECT", projectSchema);
exports.ProjectModel = ProjectModel;
