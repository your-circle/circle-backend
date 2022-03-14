const mongooose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//hashing the passwords with a total of 20 rounds
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 20);
  }
  next();
});

//generating token using key
userSchema.methods.generateAuthToken = async function () {
  try {
    let tokenNew = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.token = this.tokens.concat({ token: tokenNew });
    await this.save();
    return tokenNew;
  } catch (error) {
    console.log(error);
  }
};

const User = mongooose.model("USER", userSchema);

module.exports = User;
