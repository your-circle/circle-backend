const { UserModel } = require("../../db/models/user");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const {
  SuccessResponseHandler,
  ErrorResponseHandler,
} = require("../../utils/response_handler");
const {
  UserWithEmailExitsMessage,
  UserRegisterMessage,
  UserLogInMessage,
  UserNotFoundMessage,
  InVailPasswordMessage,
} = require("../../utils/message");

const verifyAuthToken = async (req, res) => {
  return SuccessResponseHandler(res, 200, "Token is not expired");
};

const SignUp = async (req, res) => {
  try {
    let toAddUser = req.body;
    const hasUser = await UserModel.findOne({
      email: toAddUser.email.trim(),
    });
    if (hasUser) {
      return ErrorResponseHandler(res, 404, UserWithEmailExitsMessage);
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

      return SuccessResponseHandler(res, 200, UserRegisterMessage, {
        ..._.pick(newUser, ["_id", "name", "email"]),
        token: token,
      });
    });
  } catch (e) {
    return ErrorResponseHandler(res, 404, e.message);
  }
};

const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const User = await UserModel.findOne({ email });
    if (!User) {
      return ErrorResponseHandler(res, 404, UserNotFoundMessage);
    }

    const isPasswordSame = await bcrypt.compare(password, User.password);
    if (!isPasswordSame) {
      return ErrorResponseHandler(res, 404, InVailPasswordMessage);
    }

    const token = await User.generateAuthToken();

    return SuccessResponseHandler(res, 200, UserLogInMessage, {
      ..._.pick(User, ["_id", "name", "email"]),
      token: token,
    });
  } catch (e) {
    return ErrorResponseHandler(res, 404, e.message);
  }
};

exports.SignIn = SignIn;
exports.SignUp = SignUp;
exports.verifyAuthToken = verifyAuthToken;
