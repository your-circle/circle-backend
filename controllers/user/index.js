const { UserModel } = require("../../db/models/user");

const {
  SuccessResponseHandler,
  ErrorResponseHandler,
} = require("../../utils/response_handler");

const {
  AllUserListMessage,
  UserDataMessage,
  UserUpdateMessage,
} = require("../../utils/message");
const { GetSkipAndLimit } = require("../helper/limit");

const getAllUser = async (req, res) => {
  try {
    let { size, sort } = req.query;

    const { skip, limit } = GetSkipAndLimit(size);

    const list = await UserModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return SuccessResponseHandler(res, 200, AllUserListMessage, list);
  } catch (e) {
    return ErrorResponseHandler(res, 404, e.message);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select({
      password: 0,
    });
    return SuccessResponseHandler(res, 200, UserDataMessage, user);
  } catch (e) {
    return ErrorResponseHandler(res, 404, e.message);
  }
};

const UpdateUser = async (req, res) => {
  try {
    const filter = { _id: req.userID };
    const update = { ...req.body };
    // console.log(update);

    await UserModel.findOneAndUpdate(filter, update);
    const update_user = await UserModel.findOne(filter).select({ password: 0 });

    return SuccessResponseHandler(res, 200, UserUpdateMessage, update_user);
  } catch (e) {
    return ErrorResponseHandler(res, 404, e.message);
  }
};

exports.getAllUser = getAllUser;
exports.getUser = getUser;
exports.UpdateUser = UpdateUser;
