import { DataTypes } from "sequelize";
import database from "../../db/db.js";

const Project = database.define(
  "projects",
  {
    code: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull:false
    },
    customId: {
      type: DataTypes.STRING,
      unique: true,

    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    priority: {
      type: DataTypes.INTEGER
    },
    overAllStatus:{
        type:DataTypes.BOOLEAN,
        allowNull:true,
    },
    //references keys
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    manager:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    isCodeCustomized:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    }
  },
  { timestamps: true }
);

export default Project;
