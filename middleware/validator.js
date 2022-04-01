
const { validationResult } = require('express-validator');

const Validator = async (req, res, next) => {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new Error(JSON.stringify(errors.errors));
    };

    next();
  } catch (err) {
    res.status(400).send({ message:JSON.parse(err.message)});
    // console.log(err);
  }
};

exports.Validator = Validator;
