const mongoose = require("mongoose");
const { Schema } = mongoose;

const formSchema = new Schema(
  {
    ques1: { type: String, required: true },
    ques2: { type: String, required: true },
    filler_id: { type: Schema.Types.ObjectId, ref: "USER" },
    creator_id: { type: Schema.Types.ObjectId, ref: "USER" },
    project_id: { type: Schema.Types.ObjectId, ref: "PROJECT" },
  },
  { timestamps: true }
);

const FormModel = mongoose.model("FORM", formSchema);
exports.FormModel = FormModel;
