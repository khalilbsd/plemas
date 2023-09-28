import { DataTypes } from "sequelize";
import database from "../../db/db.js";
import logger from "../../log/config.js";

const User = database.define(
  "users",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "employee",
      allowNull: false
    },
    isSuperUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: true
    },
    token:{
      type:DataTypes.STRING,
      allowNull:true
    },
    expireAt:{
      type:DataTypes.DATE,
      allowNull:true
    },
    active:{
      type:DataTypes.BOOLEAN,
      defaultValue:false,
      allowNull:false
    }
  },
  { timestamps: true }
);


// User.sync({ force: true }).then(() => {
//   logger.debug("User model synced with the database");
// });

export default User;
