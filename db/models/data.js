const mongoose = require("mongoose");
const { Schema } = mongoose;

const dataSchema = new Schema(
  {
    type: String,
    skills: [String],
    open_to: [String],
  },
  { timestamps: true }
);

const DataModel = mongoose.model("DATA", dataSchema);
exports.DataModel = DataModel;
