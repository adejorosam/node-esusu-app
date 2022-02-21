//user.js
const SuccessResponse = require("../utils/success")
const ErrorResponse = require("../utils/error")
const {
  login,
  createUser,
  getAllUsers
} = require("../services/user");

module.exports = {
    async login(req, res, next){
        try{
            const loginUser = await login(req)
            return SuccessResponse(res, "Login successfull", loginUser,  200)
          }catch(e){
            return next(new ErrorResponse(e.message, 500));
          }
    },
    
  async getAllUsers(req, res, next) {
    try {
      const userCollection = await getAllUsers()
      // return userCollection
      return SuccessResponse(res, "Users retrieved successfully", userCollection,  200)
    } catch (e) {
      // console.log(e)
      return next(new ErrorResponse(e.message, 500));
    }
  },
  
  async createUser(req, res, next) {
    try {
          const userCollection = await createUser(req)
          return SuccessResponse(res, "User created successfully", userCollection,  201)
    } catch (e) {
          return next(new ErrorResponse(e.message,  500))
    }
  },

}