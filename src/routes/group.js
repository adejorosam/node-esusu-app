const express = require("express");
// const { inviteToGroup } = require("../controllers/group");

const groupController = require("../controllers/group");
const {authMiddleware, adminMiddleware} = require("../middleware/authMiddleware")


const router = express.Router()

const {
  getAllGroups,
  getAGroup,
  createGroup,
  joinGroup,
  deleteGroup,
  updateGroup,
  inviteToGroup,
  groupReporting
} = groupController;


// Group routes

router.get("/groups",authMiddleware,getAllGroups)
router.get("/groups/:groupId",[authMiddleware], getAGroup)
router.post("/groups/:groupId", authMiddleware, joinGroup)
router.post("/groups", [authMiddleware], createGroup)
router.delete("/groups/:groupId",[authMiddleware,adminMiddleware], deleteGroup)
router.patch("/groups/:groupId",[authMiddleware,adminMiddleware], updateGroup)
router.post("/groups/:groupId/user", [authMiddleware, adminMiddleware], inviteToGroup)
router.get("/groups/:groupId/user", [authMiddleware, adminMiddleware], groupReporting)


module.exports = router