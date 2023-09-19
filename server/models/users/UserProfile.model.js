import { DataTypes } from "sequelize";
import database from "../../db/db.js";
import logger from "../../log/config.js";

const UserProfile = database.define("UserProfile", {
    name:{
        type:DataTypes.STRING,
        allowNull:true
    },
    lastName:{
        type:DataTypes.STRING,
        allowNull:true
    },
    poste:{
        type:DataTypes.STRING,
        allowNull:true
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:true
    },
    image:{
        type:DataTypes.STRING,
        allowNull:true
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }

}, { timestamps: true });



// UserProfile.sync({ force: true }).then(() => {
//   logger.debug("User model synced with the database");
// });
// UserProfile.belongsTo(User,{
//     foreignKey:'userId'
// });

// UserProfile.sync({ force: process.env.FORCE_DB_SYNC }).then(() => {
//     logger.debug("User model synced with the database");
//   });




export default UserProfile;
