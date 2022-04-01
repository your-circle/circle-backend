const { UserModel } = require("../../db/models/user");

const getAllUser = async (req, res) => {
  try {
    const list = await UserModel.find({}).select({ password: 0 });
    return res.send({ message: "User list", data: list });
  } catch (e) {
    res.status(404).send({ message: e.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select({
      password: 0,
    });
    return res.send({ message: "User details", data: user });
  } catch (e) {
    res.status(404).send({ message: e.message });
  }
};

const UpdateUser = async (req, res) => {
  try {
    const filter = { _id: req.userID };
    const update = { ...req.body };
    // console.log(update);

    await UserModel.findOneAndUpdate(filter, update);
    const update_user = await UserModel.findOne(filter).select({ password: 0 });

    return res.send({ message: "User Update", data: update_user });
  } catch (e) {
    res.status(404).send({ message: e.message });
  }
};

exports.getAllUser = getAllUser;
exports.getUser = getUser;
exports.UpdateUser = UpdateUser;
