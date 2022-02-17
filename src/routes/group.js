const express = require("express")

const groupController = require("../controllers/group");
const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware")


const router = express.Router()

const {
  getAllGroups,
  getAGroup,
  createGroup,
  joinGroup,
  deleteGroup,
  updateGroup,
} = groupController;


// Group routes
// router.patch("/groups/:groupId", authMiddleware, updateGroup)

router.get("/groups",authMiddleware,getAllGroups)
router.get("/groups/:groupId", getAGroup)
router.post("/groups/:groupId", authMiddleware, joinGroup)
router.post("/groups", authMiddleware, createGroup)
// router.delete("/groups/:groupId",[authMiddleware,adminMiddleware], deleteGroup)

module.exports = router