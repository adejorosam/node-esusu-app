const express = require("express")

const userController = require("../controllers/user")

const router = express.Router()
const {
  login,
  createUser,
  getAllUsers
} = userController;

// Auth routes
router.post("/register", createUser)
router.post("/login", login)
router.get('/users', getAllUsers)

module.exports = router;
