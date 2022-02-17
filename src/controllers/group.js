//group.js
const group = require("../models").Group;
const user = require("../models").User;

const db = require('../config/db');
const invite = require("../models").Invite;
const groupUser = require("../models").group_users;
const SuccessResponse = require("../utils/success")
const ErrorResponse = require('../utils/error');
const {groupSchema} = require("../validators/group")
const {inviteSchema} = require("../validators/invite")


module.exports = {
  
    // @desc    Get all groups
    // @route   POST /api/v1/groups
    // @access  Public
  async getAllGroups(req, res, next) {
    try {

      const groupCollection = await group.findAll({})
      return SuccessResponse(res, "Group retrieved successfully", groupCollection,  200)

    } catch (e) {
        console.log(e)
        return next(new ErrorResponse(e.message, 500));
        }
  },
    // @desc    Get a group
    // @route   POST /api/v1/groups/groupId
    // @access  Private
  async getAGroup(req, res, next) {
    try {
      const groupCollection = await group.findOne({where:{id:req.params.groupId}})
        if(groupCollection === null){
          return next(new ErrorResponse(`group with the id of ${req.params.groupId} does not exist`, 404));

        }
        else{
          return SuccessResponse(res, "group retrieved successfully", groupCollection,  200)

    } 
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
    const t = await db.transaction();

    try {

        const result = await groupSchema.validateAsync(req.body)

        const groupCollection = await group.create({
            groupName: req.body.groupName,
            maximumCapacity: req.body.maximumCapacity,
            userId:req.user.id,
            groupDescription: req.body.groupDescription,
            periodicAmount:req.body.periodicAmount,
            isSearchable: req.body.isSearchable,
            recipientList: [req.user.name]
        })
        if(groupCollection){
            const joinGroup = await groupCollection.addUser(req.user.id, {through: {amountSaved:0.00, role:"admin"}})
            { transaction: t }
        }

        await t.commit();
        return SuccessResponse(res, "Group created successfully", groupCollection,  201)
  
    } catch (e) {
        // If the execution reaches this line, an error was thrown.
        // We rollback the transaction.
        await t.rollback();
        return next(new ErrorResponse(e, 500));
    }
  },

  async joinGroup(req, res, next) {
    try {
        //validate request
        // const result = await groupSchema.validateAsync(req.body)
        //check if group exists
        const groupCollection = await group.findByPk(req.params.groupId)
        if(groupCollection === null){
            return next(new ErrorResponse(`Group with the id of ${req.params.groupId} does not exist`, 404));
        }
        //check if user has joined before
        const checkGroup = await groupUser.findOne({where: {userId:req.user.id, groupId:req.params.groupId }})
        // console.log(checkGroup)
        if(checkGroup != null){
              // console.log("here");
            return next(new ErrorResponse(`User with the id of ${req.user.id} already joined before now`, 404));
        }
        //check if group hasn't exceeded its max cap
        if (groupCollection.length === groupCollection.maximumCapacity ) {
            return SuccessResponse(res, "Group has reached its maximum capacity", null,  200)
        }

        const joinGroup = await groupCollection.addUser(req.user.id, {through: {amountSaved:0.00, role:"member"}})


        if(joinGroup){
            groupCollection.recipientList.push(req.user.name)
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
      const result = await groupSchema.validateAsync(req.body)
        const group = await group.findByPk(req.params.groupId)
          if(group === null){
            return next(new ErrorResponse(`group with the id of ${req.params.groupId} does not exist`, 404));
         
          }
          else{
            await group.update({    
              groupName: req.body.groupName ? req.body.groupName : group.groupName,
              periodicAmount:req.body.periodicAmount ? req.body.periodicAmount : group.periodicAmount,
              isSearchable: req.body.isSearchable ? req.body.isSearchable : group.isSearchable,
              groupDescription: req.body.groupDescription ? req.body.groupDescription : group.groupDescription,
              userId:req.user.id,
           
            });
            return SuccessResponse(res, "group updated successfully", group,  200)

      } 
      } catch (e) {
          // console.log(e)
          return next(new ErrorResponse(e.message, 500));
      }
},

    // @desc    Delete a particular group in the database
    // @route   DELETE /api/v1/group/:groupId
    // @access  Private
    async deleteGroup(req, res, next) {
        try {
            const group = await group.findByPk(req.params.groupId)
              if(group === null){
                return next(new ErrorResponse(`Group with the id of ${req.params.groupId} does not exist`, 404));
              }
              else{
               await group.destroy();
               return res.status(204).json();
              } 
          } catch (e) {
              console.log(e)
              return next(new ErrorResponse(e.message, 500));
          }
    },

    async inviteToGroup(req, res, next) {
        try {
            //validate request
            // const result = await inviteSchema.validateAsync(req.body)

            
            //check if group exists
            const groupCollection = await group.findByPk(req.params.groupId)
            if(groupCollection === null){
                return next(new ErrorResponse(`Group with the id of ${req.params.groupId} does not exist`, 404));
            }
            //check if user exists
            const userCollection = await user.findByPk(req.body.userId)
            if(userCollection === null){
                return next(new ErrorResponse(`User with the id of ${req.body.userId} does not exist`, 404));
            }

            //check if user has been previously invited
            const inviteCollection = await invite.findOne({where:{userId:req.body.userId, groupId:req.params.groupId}})
            if(inviteCollection != null){
                return next(new ErrorResponse(`This user has been previously invited`, 400));
            }
            //check if user has joined before
            const checkGroup = await groupUser.findOne({where: {userId:req.body.userId, groupId:req.params.groupId }})
            if(checkGroup != null){
                return next(new ErrorResponse(`User with the id of ${req.body.userId} already joined before now`, 404));
            }
            //check if group hasn't exceeded its max cap
            if (groupCollection.length === groupCollection.maximumCapacity ) {
                return SuccessResponse(res, "Group has reached its maximum capacity and you can't invite anyone", null,  200)
            }
            let inviteId = Math.floor(Math.random() * 100) + 1
            const inviteUser = await invite.create({
                userId:req.body.userId,
                invitedBy: req.user.id,
                groupId:req.params.groupId,
                inviteId: inviteId
            })

            if(inviteUser){
                const inviteLink = `${process.env.BASE_URL}/api/v1/group/join/${inviteId}?userId=${req.body.userId}`;
                return SuccessResponse(res, "User has been to successfully invited", inviteLink,  201)

            }
    
        } catch (e) {
            return next(new ErrorResponse(e.message, 500));
    
        }
      },

      async addMember(req, res, next) {
        try {
            //validate request
            // const result = await groupSchema.validateAsync(req.body)

            //check if inviteId is valid
            const inviteCollection = await invite.findOne({where: {userId:req.user.id, groupId:req.body.groupId }})
            if(inviteCollection === null){
                return next(new ErrorResponse(`Invite with the id of ${req.body.inviteId} does not exist`, 404));
            }
            //check if group exists
            const groupCollection = await Group.findByPk(req.body.groupId)
            if(groupCollection === null){
                return next(new ErrorResponse(`Group with the id of ${req.body.groupId} does not exist`, 404));
            }
            //check if user has joined before
            const checkGroup = await groupUser.findOne({where: {userId:req.user.id, groupId:req.body.groupId }})
            if(checkGroup === null){
                return next(new ErrorResponse(`User with the id of ${req.user.id} already joined before now`, 404));
            }
            //check if group hasn't exceeded its max cap
            if (groupCollection.length === groupCollection.maximumCapacity ) {
                return SuccessResponse(res, "Group has reached its maximum capacity", null,  200)
            }
    
            const joinGroup = await groupCollection.addUser(req.user.id, {through: {amountSaved:0.00}})
            // user.addNotification(notification, { through: {cityId: 1, active: true}});
    
    
            if(joinGroup){
                groupCollection.recipientList.push(req.user.name)
                return SuccessResponse(res, "User added to group successfully", joinGroup,  201)
            }
    
        } catch (e) {
            return next(new ErrorResponse(e.message, 500));
    
        }
      },

    
      
}