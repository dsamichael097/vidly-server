const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("No Token. No Access");

  try {
    const decodedJwt = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decodedJwt;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};
