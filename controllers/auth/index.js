const { UserModel } = require("../../model/UserSchema");
const bcrypt = require("bcryptjs");


const IsUserLogin=async (req, res) =>{
  res.status(200).send({ message: "Token is not expired" });
}

const SignUp = async (req, res) => {
  try {
    let toAddUser = req.body;

    if (!toAddUser || !toAddUser.name || !toAddUser.email) {
      return res.status(400).send({ message: "insufficient data" });
    }

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
    await newUser.save((e) => {
      if (e) {
        return res.status(404).send({ message: "Validation failed" });
      }
    });

    const token = await newUser.generateAuthToken();

    res
      .status(200)
      .send({
        message: "User registered successfully",
        data: { name: toAddUser.name, email: toAddUser.email, token: token },
      });
  } catch (e) {
    res.status(404).send(e.message);
  }
};

const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Email required" });
    }

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
      data: { name: User.name, email: User.email, token: token },
    });
  } catch (e) {
    res.status(404).send(e.message);
  }
};

// just for testing purpose
const getAllUser = async (req, res) => {
  try {
    const list = await UserModel.find({});
    return res.send(list);
  } catch (e) {
    res.status(404).send(e.message);
  }
};

exports.SignIn = SignIn;
exports.SignUp = SignUp;
exports.getAllUser = getAllUser;
exports.IsUserLogin = IsUserLogin;
