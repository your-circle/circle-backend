const { UserModel } = require("../../db/Schema");
const bcrypt = require("bcryptjs");
const _ = require('lodash');


const verifyAuthToken = async (req, res) => {
  res.status(200).send({ message: "Token is not expired" });
}

const SignUp = async (req, res) => {
  try {
    let toAddUser = req.body;

    const hasUser = await UserModel.findOne({
      email: toAddUser.email.trim(),
    });

    if (hasUser) {
      return res
        .status(404)
        .send({ message: "User with this email already exist" });
    }

    const User = {
      ...toAddUser,
    };

    const newUser = new UserModel(User);
    await newUser.save(async (e) => {
      if (e) {
        return res.status(404).send({ message: e });
      }

      const token = await newUser.generateAuthToken();
  
      return res
        .status(200)
        .send({
          message: "User registered successfully",
          data: { ..._.pick(toAddUser, [ '_id', 'name', 'email' ]), token: token },
        });

    });

  } catch (e) {
    res.status(404).send({ message: e.message });
  }
};

const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const User = await UserModel.findOne({ email });

    if (!User) {
      return res.status(404).send({ message: "User doesn't exist" });
    }

    const isPasswordSame = await bcrypt.compare(password, User.password);

    if (!isPasswordSame) {
      return res.status(400).send({ message: "invalid password" });
    }

    const token = await User.generateAuthToken();

    res.status(200).send({
      message: "User logged in successfully",
      data: { ..._.pick(User, [ '_id', 'name', 'email' ]), token: token },
    });
  } catch (e) {
    res.status(404).send({ message: e.message });
  }
};



exports.SignIn = SignIn;
exports.SignUp = SignUp;
exports.verifyAuthToken = verifyAuthToken;
