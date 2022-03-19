const mongooose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../env");

const userSchema = new mongooose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  }
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
    let tokenNew = jwt.sign({ _id: this._id }, SECRET_KEY,{expiresIn:'7d'});
    return tokenNew;
  } catch (error) {
    // console.log(error);
  }
};

const UserModel = mongooose.model("USER", userSchema);

exports.UserModel = UserModel;
