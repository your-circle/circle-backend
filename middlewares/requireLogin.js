
const validateLogin = async (req, res, next) => {
  // If not a valid loggedIn user
  if (!req.user) {
    return res.status(401).send({ error: 'unauthorized access!' })
  }
  next();
}

module.exports = validateLogin;