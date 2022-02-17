// Invite Schema
module.exports = (sequelize, DataTypes) => {
    let Invite = sequelize.define("Invite", {
    
        userId:DataTypes.INTEGER,
        invitedBy: DataTypes.INTEGER,
        groupId:DataTypes.INTEGER,
        // joined:DataTypes.BOOLEAN,
        inviteId: DataTypes.INTEGER
    })
    

    return Invite;
  }