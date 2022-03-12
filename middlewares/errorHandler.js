const errorHandler = (err, req, res, next) => {
  // log errors
  console.log("error", err);
  res.status(500).send("something went wrong!");
}

module.exports = errorHandler;