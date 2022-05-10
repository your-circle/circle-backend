const mongoose = require("mongoose");
const { Schema } = mongoose;

const dataSchema = new Schema(
  {
    type: {type:String,unique:true},
    tech: [String],
    open_to: [String],
    need: [String]
  },
  { timestamps: true }
);

const DataModel = mongoose.model("DATA", dataSchema);
exports.DataModel = DataModel;
