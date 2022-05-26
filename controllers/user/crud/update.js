const bcrypt = require("bcryptjs");
const { UserModel } = require("../../../db/models/user");
const VerifyAuthToken = require("../../auth/auth");

const {
  SuccessResponseHandler,
  ErrorResponseHandler,
} = require("../../../utils/response_handler");

const {
  UserUpdateMessage, UserPasswordLinkSent, UserPasswordResetSuccessfull,
} = require("../../../utils/const/message");
const { TokenExpiredError } = require("jsonwebtoken");
const sendEmail = require("../../../utils/sendEmail");


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

const forgetpassword = async (req,res) => {
  try {
    const id = req.userID;
    console.log(req.body.email);
    const user = await UserModel.findOne({email: req.body.email});
    if(!user) return res.status(400).send("user with given email does not exist");
      const token = await user.generateAuthToken();
      const link = `${process.env.BASE_URL}/password-reset/${id}/${token}`;
      await sendEmail(user.email,"Password reset for your circle account", link);
      SuccessResponseHandler(res, 200, UserPasswordLinkSent);

  } catch (error) {
    return ErrorResponseHandler(res, 404, e.message);
  }
}

const passwordReset = async (req,res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if(!user) return res.status(400).send("invalid link or experied");
    const token = await user.generateAuthToken();
    // if(req.body.password == user.password) res.status(400).send("Can't reset to same password");
    user.password = req.body.password;
    await user.save();
    return SuccessResponseHandler(res, 200, UserPasswordResetSuccessfull);
  } catch (error) {
    return ErrorResponseHandler(res, 404, e.message);
  }
}

exports.UpdateUser = UpdateUser;
exports.passwordReset = passwordReset;
exports.forgetpassword = forgetpassword;