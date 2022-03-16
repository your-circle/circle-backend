const { UserModel } = require("../../model/UserSchema");
const bcrypt = require("bcryptjs");

const SignUp = async (req, res) => {
  try {
    let toAddUser = req.body;

    if (!toAddUser || !toAddUser.name || !toAddUser.email) {
      return res.status(400).send({ message: "Not vaild Request Data" });
    }

    const UserByName = await UserModel.findOne({ name: toAddUser.name.trim() });
    const UserByEmail = await UserModel.findOne({
      email: toAddUser.email.trim(),
    });

    if (UserByName || UserByEmail) {
      return res
        .status(404)
        .send({ message: "User with same name or email exits" });
    }

    const User = {
      ...toAddUser,
    };

    const newUser = new UserModel(User);
    const user = await newUser.save((e) => {
      if (e) {
        return res.status(404).send({ message: "Validation failed" });
      }
    });
    
    const token = await newUser.generateAuthToken();

    res
      .status(200)
      .send({
        message: "User Added",
        data: { name: toAddUser.name, email: toAddUser.email, token: token },
      });
  } catch (e) {
    res.status(404).send(e.message);
  }
};

const SignIn = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name) {
      return res.status(400).send({ message: "Invalid Input" });
    }

    const UserByName = await UserModel.findOne({ name: name });

    if (!UserByName) {
      return res.status(404).send({ message: "User Not Exits" });
    }

    const isPasswordSame = await bcrypt.compare(password, UserByName.password);

    if (!isPasswordSame) {
      return res.status(404).send({ message: "PassWord Wrong" });
    }

    const token = await UserByName.generateAuthToken();

    res.status(200).send({
      message: "Login",
      data: { name: UserByName.name, email: UserByName.email, token: token },
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
