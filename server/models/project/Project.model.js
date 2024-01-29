import { DataTypes } from "sequelize";
import database from "../../db/db.js";
import { TASK_STATE_DOING } from "../../constants/constants.js";

const Project = database.define(
  "projects",
  {
    code: {
      type: DataTypes.STRING,
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
    managerHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: TASK_STATE_DOING
    }
  },
  {
    timestamps: true,
    hooks: {
      beforeUpdate: (instance, options) => {
        // Capture the old values before the update
        instance.oldValues = { ...instance._previousDataValues };
      }
    }
  }
);

export default Project;
