require("dotenv").config();
const jwt = require("jsonwebtoken");
const ErrorResponse = require('../utils/error');
const groupUser = require("../models").group_users;



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

async function adminMiddleware (req, res, next)  {
  try{
      const groupCollection = await groupUser.findOne({where:{groupId:req.params.groupId, userId:req.user.id, role:"admin"}})
      // console.log(groupCollection)
      if (groupCollection === null) {
          return next(new ErrorResponse(`You do not have the right perform this action`, 401));
      }
      return next();
  }
  catch(error){
      return next(new ErrorResponse(error.message, 500));
  }
}

module.exports = {authMiddleware, adminMiddleware} ;