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
    let { name, role, skills, open_to } = req.body;
    const { skip, limit } = GetSkipAndLimit(req);

    let query = {
      $and: [],
    };

    if (name) {
      query["$and"].push({ name: { $regex: name, $options: "i" } });
    }

    if (role) {
      query["$and"].push({ role: role });
    }

    if (skills && skills.length > 0) {
      query["$and"].push({ skills: { $in: skills } });
    }

    if (open_to && open_to.length > 0) {
      query["$and"].push({ open_to: { $in: open_to } });
    }

    if (query["$and"].length == 0) {
      query = {};
    }

    const list = await UserModel.find(query)
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
