import { DataTypes } from "sequelize";
import database from "../../db/db.js";

const Project = database.define(
  "projects",
  {
    code: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    },
    customId: {
      type: DataTypes.STRING,
      unique: false
    },
    name: {
      type: DataTypes.STRING,
      unique: false,
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
    //references keys
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    manager: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    managerHours:{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    isCodeCustomized: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },


  },
  { timestamps: true }
);

export default Project;
