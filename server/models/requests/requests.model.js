import { DataTypes } from "sequelize";
import database from "../../db/db.js";

const Request = database.define("requests", {
  description:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  state:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:0
  },

}, { timestamps: true });



export default Request