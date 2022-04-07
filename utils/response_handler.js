const SuccessResponseHandler = (res, status = 200, message, data = null) => {
  return res.status(status).send({ message: message, data: data });
};

const ErrorResponseHandler = (res, status = 404, message) => {
  return res.status(status).send({ message: message });
};

exports.SuccessResponseHandler = SuccessResponseHandler;
exports.ErrorResponseHandler = ErrorResponseHandler;
