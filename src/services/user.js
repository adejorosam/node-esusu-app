//user.js
const User = require("../models").User;
const bcrypt = require("bcryptjs");
const {authSchema} = require("../validators/auth")
const securePassword = require('../utils/securePassword');
const getSignedToken = require('../utils/getSignedToken');
const ErrorResponse = require("../utils/error")

module.exports = {

    
    async login(req){
        try{
            const result = await authSchema.validateAsync(req.body)
            const user = await User.findOne({ where:{email: req.body.email}});
            if(!user){
                throw (new ErrorResponse("An account for this email does not exist", 404));
 
            }
            const validPass = await bcrypt.compare(req.body.password, user.password);
            if(!validPass){
                throw (new ErrorResponse("E-mail or password is wrong", 400));
            }
            const token = await getSignedToken(user);
            return token
            // return SuccessResponse(res, "Login successfull", token,  200)
 
          }catch(e){
            throw (new ErrorResponse(e.message, 500));

          }
    },
    
  async getAllUsers(req, res, next) {
    try {
      const userCollection = await User.findAll({})
      return userCollection
    //   return SuccessResponse(res, "Users retrieved successfully", userCollection,  200)
    } catch (e) {
      console.log(e)
      throw (new ErrorResponse(e.message, 500));
    }
  },
  
  async createUser(req) {
    try {
 
      const userExists = await User.findOne({ where:{email: req.body.email}});
      if(userExists != null){
            throw (new ErrorResponse("E-mail already exists",  400))
        }
        const userCollection = await User.create({
            email: req.body.email,
            name: req.body.name,
            password: await securePassword(req.body.password),
        })
        const token = await getSignedToken(userCollection);
        return token
  
    } catch (e) {
      console.log(e)
      throw (new ErrorResponse(e.message,  500))
    }
  },
}