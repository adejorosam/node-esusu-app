//group.js
const group = require("../models").Group;
const user = require("../models").User;

const db = require('../config/db');
const invite = require("../models").Invite;
const SuccessResponse = require("../utils/success")
const ErrorResponse = require('../utils/error');
const {groupSchema} = require("../validators/group")
const {inviteSchema} = require("../validators/invite")
const {
  addMember,
  joinGroup,
  getAGroup,
  getAllGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  inviteToGroup,
  groupReporting
} = require("../services/group");

module.exports = {
  
    // @desc    Get all groups
    // @route   POST /api/v1/groups
    // @access  Public
  async getAllGroups(req, res, next) {
    try {

      // const groupCollection = await group.findAll({})
      const groupCollection = await getAllGroups();
      return SuccessResponse(res, "Group retrieved successfully", groupCollection,  200)

    } catch (e) {
        console.log(e)
        return next(new ErrorResponse(e.message, 500));
        }
  },

     // @desc    Get a list of members in a group and amount saved
    // @route   POST /api/v1/groups/groupId
    // @access  Private
    async groupReporting(req, res, next) {
      try {
          const groupCollection = await groupReporting(req)
          if(groupCollection){
            return SuccessResponse(res, "group retrieved successfully", groupCollection,  200)
          }
      } 
      catch (e) {
          console.log(e)
          return next(new ErrorResponse(e.message, 500));
      }
    },
    // @desc    Get a group
    // @route   POST /api/v1/groups/groupId
    // @access  Private
  async getAGroup(req, res, next) {
    try {
      const groupCollection = await getAGroup(req.params.groupId)
          return SuccessResponse(res, "group retrieved successfully", groupCollection,  200)
    } 
    catch (e) {
        console.log(e)
        return next(new ErrorResponse(e.message, 500));
    }
  },
    // @desc    Create a new group
    // @route   POST /api/v1/groups
    // @access  Private
  async createGroup(req, res, next) {

    try {
        
        const groupCollection = await createGroup(req)
        if(groupCollection){
          return SuccessResponse(res, "Group created successfully", groupCollection,  201)
        }
  
    } catch (e) {
      
        return next(new ErrorResponse(e, 500));
    }
  },

  async joinGroup(req, res, next) {
    try {
        const groupCollection = await joinGroup(req.params.groupId, req.user.id)
        if(groupCollection){
          return SuccessResponse(res, "User added to group successfully", groupCollection,  201)

        }  
    } catch (e) {
        return next(new ErrorResponse(e.message, 500));

    }
  },
    // @desc    Update a particular group in the database
    // @route   PATCH /api/v1/groups/:groupId
    // @access  Private
  async updateGroup(req, res, next) {
   
    try {
      const group = await updateGroup(req)
      if(group){
            return SuccessResponse(res, "group updated successfully", group,  200)

      }
    } catch (error) {
            return next(new ErrorResponse(e.message, 500));
    }
},

    // @desc    Delete a particular group in the database
    // @route   DELETE /api/v1/group/:groupId
    // @access  Private
    async deleteGroup(req, res, next) {
        try {
          const group = deleteGroup(req)
          if(group){
              return res.status(204).json();
          }
        } catch (e) {
            return next(new ErrorResponse(e.message, 500));
        }
    },

    async inviteToGroup(req, res, next) {
        try {
           
            const invite = await inviteToGroup(req)
            if(invite){
                return SuccessResponse(res, "User has been to successfully invited", inviteLink,  201)
            }
    
        } catch (e) {
            return next(new ErrorResponse(e.message, 500));
    
        }
      },

      async addMember(req, res, next) {
        try {
          const groupCollection = await addMember(req.params.groupId, req.user.id)
          if(groupCollection){
            return SuccessResponse(res, "User added to group successfully", groupCollection,  201)
  
          }  
      } catch (e) {
          return next(new ErrorResponse(e.message, 500));
  
      }
      },    
}