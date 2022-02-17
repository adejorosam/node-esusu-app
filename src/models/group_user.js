//Cart Schema
module.exports = (sequelize, DataTypes) => {
    const db = require('../config/db');
    
    let group_users = sequelize.define('group_users', {
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: db.User,
            // key: 'id'
          }
        },
        groupId: {
          type: DataTypes.INTEGER,
          references: {
            model: db.Group, 
            // key: 'id'
          }
        },
        amountSaved:DataTypes.FLOAT,
        role:{
          type: DataTypes.ENUM(['admin', 'member'])
        }

      });
        return group_users
      }
    
    
       
       
       
    