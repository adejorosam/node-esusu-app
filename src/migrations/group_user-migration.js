module.exports = {
    up: (queryInterface, Sequelize) =>
      queryInterface.createTable("group_users", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull:false,
          // onDelete: "CASCADE",
          // references: {
          //   model: "User",
          //   key: "id",
          //   as: "userId",
          // },
        },
  
        groupId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          // onDelete: "CASCADE",
          // references: {
          //   model: "Group",
          //   key: "id",
          //   as: "groupId",
          // },
        },

        role:{
          type: Sequelize.ENUM(['admin', 'member']),
          allowNull: true
        },
        // ENUM(['admin', 'member'])
        // }

        amountSaved:{
          type: Sequelize.FLOAT,
          allowNull: false
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
    down: (queryInterface /* , Sequelize */) => queryInterface.dropTable("group_users"),
  }