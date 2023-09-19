import logger from "../log/config.js";
import User from "../models/users/User.model.js";
import dotenv from "dotenv";


dotenv.config()
const  force = process.env.FORCE_DB_SYNC === 'true'


logger.debug("------- Preforming DataBase synchronization");


// Define relations here
User.hasOne(UserProfile,{
    foreignKey:'userId',
    onDelete:'CASCADE',
    onUpdate:'CASCADE'
});

User.sync({ force: force  }).then(() => {
    logger.debug("User model synced with the database");

});

import UserProfile from "../models/users/UserProfile.model.js";

UserProfile.belongsTo(User,{
    foreignKey:'userId'
});

// console.log(User);



UserProfile.sync({ force: force }).then(() => {
    logger.debug("UserProfile model synced with the database");
  });

export { User, UserProfile };
