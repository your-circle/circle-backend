const { UserModel } = require("../../../db/models/user");

const {
  SuccessResponseHandler,
  ErrorResponseHandler,
} = require("../../../utils/response_handler");

const {
  AllUserListMessage,
  UserDataMessage,
} = require("../../../utils/const/message");
const { GetSkipAndLimit } = require("../../../utils/helper/limit");



const GetAllUser = async (req, res) => {
  try {
    let { name, role, skills, open_to } = req.body;
    const { skip, limit } = GetSkipAndLimit(req);

    let query = {
      $and: [{ skills: { $gt: 0 }, open_to: { $gt: 0 } }],
    };

    if (name) {
      query["$and"].push({
        $or: [
          { name: { $regex: name, $options: "i" } },
          { username: { $regex: name, $options: "i" } },
        ],
      });
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

const GetUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select({
      password: 0,
    });
    return SuccessResponseHandler(res, 200, UserDataMessage, user);
  } catch (e) {
    return ErrorResponseHandler(res, 404, e.message);
  }
};


exports.GetAllUser = GetAllUser;
exports.GetUser = GetUser;
