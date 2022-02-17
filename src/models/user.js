//User Schema
module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define("User", {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password:DataTypes.STRING
    })


    User.associate = function(models) {
      User.belongsToMany(models.Group,{
        through: "group_users",
        foreignKey: 'userId',
        as: "group",
      })
    }
    
    return User
  }