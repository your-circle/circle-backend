const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../env");
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
exports.UserModel = UserModel;
