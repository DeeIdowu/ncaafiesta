const jwt = require("jsonwebtoken");
const config = require("config");

//middleware function
module.exports = function(req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token");

  //check if there is no token
  if (!token) {
    return res.status(401).json({ msg: "No Token, Authorization is denied" });
  }

  //Verification of token:
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    //assign value to user

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not vaild" });
  }
};
