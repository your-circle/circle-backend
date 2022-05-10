const { UserModel } = require("../../../db/models/user");

const {
  SuccessResponseHandler,
  ErrorResponseHandler,
} = require("../../../utils/response_handler");

const {
  UserUpdateMessage,
} = require("../../../utils/const/message");


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


exports.UpdateUser = UpdateUser;
