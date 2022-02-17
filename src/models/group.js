//User Schema
module.exports = (sequelize, DataTypes) => {
    let Group = sequelize.define("Group", {
      groupName: DataTypes.STRING,
      maximumCapacity: DataTypes.INTEGER,
      groupDescription: DataTypes.TEXT,
      isSearchable: DataTypes.BOOLEAN,
      // userId: DataTypes.INTEGER,
      periodicAmount:DataTypes.FLOAT,
      recipientList: DataTypes.ARRAY(DataTypes.STRING)
    })

    Group.associate = function(models) {
      Group.belongsToMany(models.User,{
        through: "group_users",
        foreignKey: 'groupId',
        as: "user",
      })
    }
    

    return Group
  }

//   Every group has a group admin. 
//   The periodic amount to be saved at the beginning is defined by the admin. 
//   Other things defined by the admin include group name, group description, maximum capacity, 
//   if the group is searchable or not.
