//create-post.js
module.exports = {
  //   Every group has a group admin. 
//   The periodic amount to be saved at the beginning is defined by the admin. 
//   Other things defined by the admin include group name, group description, maximum capacity, 
//   if the group is searchable or not.
    up: (queryInterface, Sequelize) =>
      queryInterface.createTable("Groups", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        groupName: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        groupDescription:{
          type: Sequelize.TEXT,
          allowNull: true
        },
        recipientList:{
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: true
        },

        periodicAmount:{
          type: Sequelize.INTEGER,
          allowNull: false
        },
  
        isSearchable:{
          allowNull: false,
          type: Sequelize.BOOLEAN,
          defaultValue:true
        },

        maximumCapacity:{
          allowNull: false,
          type: Sequelize.FLOAT,
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
    down: (queryInterface /* , Sequelize */) => queryInterface.dropTable("Groups"),
  }