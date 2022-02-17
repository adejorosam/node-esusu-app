

//create-post.js
module.exports = {
    //   Every group has a group admin. 
  //   The periodic amount to be saved at the beginning is defined by the admin. 
  //   Other things defined by the admin include group name, group description, maximum capacity, 
  //   if the group is searchable or not.
      up: (queryInterface, Sequelize) =>
        queryInterface.createTable("Invites", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },

          invitedBy:{
            type: Sequelize.INTEGER,
            allowNull: false
          },
    
          inviteId:{
            type: Sequelize.INTEGER,
            allowNull: true
          },

          joined:{
            allowNull: false,
            type: Sequelize.BOOLEAN,
            defaultValue:false
          },
    
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        }),
      down: (queryInterface /* , Sequelize */) => queryInterface.dropTable("Invites"),
    }

