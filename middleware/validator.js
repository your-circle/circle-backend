const { validationResult } = require("express-validator");
const { ErrorResponseHandler } = require("../utils/response_handler");

const Validator = async (req, res, next) => {
  try {
    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new Error(JSON.stringify(errors.errors));
    }

    next();
  } catch (err) {
    const message = JSON.parse(err.message)[0].msg;
    return ErrorResponseHandler(res, 400, message);
    // console.log(err);
  }
};

exports.Validator = Validator;
