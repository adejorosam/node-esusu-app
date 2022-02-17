require("dotenv").config();
const jwt = require("jsonwebtoken");
const ErrorResponse = require('../utils/error');


function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return next(new ErrorResponse(`Unauthorized`, 401));
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    console.log(req.user.id)
    return next();
  } catch (e) {
    return next(new ErrorResponse(e.message,  500))

    // return res.status(400).json({ error_msg: "invalid token" });
  }
}

module.exports = authMiddleware ;