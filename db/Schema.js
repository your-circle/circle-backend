const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../env");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["peer", "mentor"],
      message: "{VALUE} is not supported",
    },
    password: { type: String, required: true },
    about: String,
    github: String,
    linkedin: String,
    twitter: String,
    discord: String,
    skills: [String],
    open_to: [String],
    avatarSeed: String,
    projects: [{ type: Schema.Types.ObjectId, ref: 'PROJECT' }]
  },
  { timestamps: true }
);



const dataSchema = new Schema(
  {
    type: String,
    skills: [String],
    open_to: [String],
  },
  { timestamps: true }
);


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

const notificationsSchema = new Schema({
  user: String,
  notifications: [
    {
      title: String,
      type: {
        type: String,
        enum: ["project", "user-info"],
        message: "{VALUE} is not supported",
      },
      project: { type: Schema.Types.ObjectId, ref: 'PROJECT' }
    },
  ],
  isOpen: Boolean,
});

//hashing the passwords with a total of 20 rounds
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || !this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  // console.log(this);
  next();
});

//generating token using key
userSchema.methods.generateAuthToken = async function () {
  try {
    let tokenNew = jwt.sign({ _id: this._id }, SECRET_KEY, { expiresIn: "7d" });
    return tokenNew;
  } catch (error) {
    // console.log(error);
  }
};

const UserModel = mongoose.model("USER", userSchema);
const DataModel = mongoose.model("DATA", dataSchema);
const ProjectModel = mongoose.model("PROJECT", projectSchema);
const NotificationModel = mongoose.model("Notification", notificationsSchema);

exports.UserModel = UserModel;
exports.DataModel = DataModel;
exports.ProjectModel = ProjectModel;
exports.NotificationModel = NotificationModel;
