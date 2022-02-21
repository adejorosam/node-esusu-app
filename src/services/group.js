const group = require("../models").Group;
const user = require("../models").User;
const ErrorResponse = require('../utils/error');
const groupUser = require("../models").group_users;
const invite = require("../models").Invite;
const db = require('../config/db');
const {groupSchema} = require("../validators/group")


module.exports = {


    async updateGroup(req) {
        try {
          const result = await groupSchema.validateAsync(req.body)
            const group = await group.findByPk(req.params.groupId)
              if(group === null){
                throw (new ErrorResponse(`group with the id of ${req.params.groupId} does not exist`, 404));
             
              }
              else{
                await group.update({    
                  groupName: req.body.groupName ? req.body.groupName : group.groupName,
                  periodicAmount:req.body.periodicAmount ? req.body.periodicAmount : group.periodicAmount,
                  isSearchable: req.body.isSearchable ? req.body.isSearchable : group.isSearchable,
                  groupDescription: req.body.groupDescription ? req.body.groupDescription : group.groupDescription,
                  userId:req.user.id,
               
                });
                return group
          } 
          } catch (e) {
              // console.log(e)
              throw (new ErrorResponse(e.message, 500));
          }
    },
  
    // @desc    Get all groups
    // @route   POST /api/v1/groups
    // @access  Public
  async getAllGroups(req, res, next) {
    try {

      const groupCollection = await group.findAll({})
      if(groupCollection){
        return groupCollection

      }

    } catch (e) {
        throw new ErrorResponse(e.message)
        }
  },

  async getAGroup(groupId) {
    try {
      const groupCollection = await group.findOne({where:{id:groupId}})
        if(groupCollection === null){
            throw new ErrorResponse("Group not found!", 404);
        }
        else{
            return groupCollection
    } 
} 
    catch (e) {
        console.log(e)
        throw new ErrorResponse(e.message, 404)
    }
  },

  async joinGroup(groupId, memberId) {
    try {
        //validate request
        // const result = await groupSchema.validateAsync(req.body)
        //check if group exists
        const groupCollection = await group.findByPk(groupId)
        if(groupCollection === null){
            throw new ErrorResponse(`Group with the id of ${groupId} does not exist`, 404);
        }
        const userCollection = await user.findByPk(memberId)
        //check if user exists on the db
        if(userCollection === null){
            throw new ErrorResponse(`User with the id of ${memberId} does not exist`, 404);
        }
        //check if user has joined before
        const checkGroup = await groupUser.findOne({where: {userId:memberId, groupId:groupId }})
        if(checkGroup != null){
            throw new ErrorResponse(`User with the id of ${memberId} already joined before now`, 404);
        }
        //check if group hasn't exceeded its max cap
        if (groupCollection.length === groupCollection.maximumCapacity ) {
            throw new ErrorResponse("Group has reached its maximum capacity")
        }
        const joinGroup = await groupCollection.addUser(memberId, {through: {amountSaved:0.00, role:"member"}})
      
        groupCollection.recipientList.push(userCollection.name)
        return groupCollection
      

    } catch (e) {
        throw new ErrorResponse(e.message, 500);

    }
  },

  async addMember(groupId, memberId) {
    try {
        //validate request
        // const result = await groupSchema.validateAsync(req.body)

        //check if inviteId is valid
        const inviteCollection = await invite.findOne({where: {userId:memberId, groupId:groupId }})
        if(inviteCollection === null){
            throw new ErrorResponse(`Invite does not exist`, 404)
        }

        //check if group exists
        const groupCollection = await group.findByPk(groupId)
        if(groupCollection === null){
            throw new ErrorResponse(`Group with the id of ${groupId} does not exist`, 404)
        }

        const userCollection = await user.findByPk(memberId)
        //check if user exists on the db
        if(userCollection === null){
            throw new ErrorResponse(`User with the id of ${memberId} does not exist`, 404);
        }

        //check if user has joined before
        const checkGroup = await groupUser.findOne({where: {userId:memberId, groupId:groupId }})
        if(checkGroup === null){
            throw new ErrorResponse(`User with the id of ${req.user.id} already joined before now`)
        }

        //check if group hasn't exceeded its max cap
        if (groupCollection.length === groupCollection.maximumCapacity ) {
            throw new ErrorResponse("Group has reached its maximum capacity")
        }

        const joinGroup = await groupCollection.addUser(req.user.id, {through: {amountSaved:0.00}})


        groupCollection.recipientList.push(userCollection.name)
        return groupCollection
   

    } catch (e) {
        throw new ErrorResponse(e.message)
        // return next(new ErrorResponse(e.message, 500));

    }
  },

  async createGroup(req) {
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
        return groupCollection
        // return SuccessResponse(res, "Group created successfully", groupCollection,  201)
  
    } catch (e) {
        // If the execution reaches this line, an error was thrown.
        // We rollback the transaction.
        await t.rollback();
        throw new ErrorResponse(e.message, 500)
    }
  },

  async deleteGroup(req) {
    try {
        const group = await group.findByPk(req.params.groupId)
          if(group === null){
            throw (new ErrorResponse(`Group with the id of ${req.params.groupId} does not exist`, 404));
          }
          else{
           await group.destroy();
           return group
          } 
      } catch (e) {
          console.log(e)
          throw (new ErrorResponse(e.message, 500));
      }
},

async inviteToGroup(req) {
    try {
        //validate request
        // const result = await inviteSchema.validateAsync(req.body)

        //check if group exists
        const groupCollection = await group.findByPk(req.params.groupId)
        if(groupCollection === null){
            throw (new ErrorResponse(`Group with the id of ${req.params.groupId} does not exist`, 404));
        }
        //check if user exists
        const userCollection = await user.findByPk(req.body.userId)
        if(userCollection === null){
            throw (new ErrorResponse(`User with the id of ${req.body.userId} does not exist`, 404));
        }

        //check if user has been previously invited
        const inviteCollection = await invite.findOne({where:{userId:req.body.userId, groupId:req.params.groupId}})
        if(inviteCollection != null){
            throw (new ErrorResponse(`This user has been previously invited`, 400));
        }
        //check if user has joined before
        const checkGroup = await groupUser.findOne({where: {userId:req.body.userId, groupId:req.params.groupId }})
        if(checkGroup != null){
            throw (new ErrorResponse(`User with the id of ${req.body.userId} already joined before now`, 404));
        }
        //check if group hasn't exceeded its max cap
        if (groupCollection.length === groupCollection.maximumCapacity ) {
            throw (new ErrorResponse("Group has reached its maximum capacity and you can't invite anyone", 400))
            // return SuccessResponse(res, "Group has reached its maximum capacity and you can't invite anyone", null,  200)
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
            return inviteLink
        }
    } catch (e) {
        throw (new ErrorResponse(e.message, 500));

    }
  },

  async groupReporting(req) {
    try {
 
      
    const groupCollection = await group.findOne({
       where:{
           id:req.params.groupId
       },  
  
        include: [{
            model:user, 
            attributes: ['id', 'name'],  
            through: { attributes:["amountSaved", "role"],where: { role: "admin", userId:req.user.id } },
           
            // through: {attributes: ["amountSaved", "role"]}
        }],
  
    });
        if(groupCollection === null){
          throw (new ErrorResponse(`group with the id of ${req.params.groupId} does not exist`, 404));

        }
        else{
            return groupCollection
        //   return SuccessResponse(res, "group retrieved successfully", groupCollection,  200)

    } 
    } 
    catch (e) {
        console.log(e)
        throw (new ErrorResponse(e.message, 500));

    }
  },
}

// const { shuffleMembers } = require("../utils/randomGen");

// exports.CreateGroup = async (group) => {
//   try {
//     const newGroup = await GroupModel.create(group);
//     return newGroup;
//   } catch (err) {
//     throw new Error(err);
//   }
// };

// exports.GetGroups = async () => {
//   try {
//     const groups = await GroupModel.find();
//     if (!groups || groups.length < 1) {
//       throw new Error("No groups found");
//     }
//     return groups;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// exports.GetGroupById = async (groupId) => {
//   try {
//     const group = await GroupModel.findById(groupId)
//       .populate({
//         path: "members",
//         select: "name _id",
//       })
//       .populate({
//         path: "nextReceipients",
//         select: "name _id",
//       });
//     if (!group) {
//       throw new Error("Group not found!");
//     }
//     return group;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// exports.AddToGroup = async (userId, groupId) => {
//   try {
//     // check if user is already in group
//     const user = await UserModel.findById(userId);
//     if (!user) {
//       throw new Error("User not found!");
//     }
//     const group = await GroupModel.findById(groupId);
//     if (!group) {
//       throw new Error("Group not found!");
//     }
//     const userInGroup = group.members.find(
//       (member) => member.toString() === userId
//     );
//     if (userInGroup) {
//       throw new Error("User already in group!");
//     }
//     const addedUser = await GroupModel.findByIdAndUpdate(
//       groupId,
//       { $push: { members: userId, nextReceipients: userId } },
//       { new: true }
//     )
//       .populate({
//         path: "members",
//         select: "name _id"
//       })
//       .exec();
//     await UserModel.findByIdAndUpdate(userId, { group: groupId });
//     return addedUser;
//   } catch (err) {
//     throw new Error(err);
//   }
// };

// exports.ClearReceipientList = async (groupId) => {
//   try {
//     const receipientCleared = await GroupModel.findByIdAndUpdate(
//       groupId,
//       { $set: { nextReceipients: [] } },
//       { new: true }
//     );
//     if (receipientCleared) {
//       return receipientCleared;
//     }
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// exports.GenerateRecipients = async (groupId) => {
//   try {
//     const members = await GroupModel.findById(groupId);
//     let receipientTable = shuffleMembers(members.members);
//     logger.info(`Receipient table: ${receipientTable}`);
//     let receipientAdded = [];
//     for (receipient of receipientTable) {
//       logger.info(`Receipient: ${receipient}`);
//       receipientAdded = await GroupModel.findByIdAndUpdate(
//         groupId,
//         { $push: { nextReceipients: receipient } },
//         { new: true }
//       );
//     }
//     return receipientAdded;
//   } catch (err) {
//     throw new Error(err);
//   }
// };


// };