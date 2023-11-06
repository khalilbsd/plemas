import { DataTypes } from "sequelize";
import database from "../../db/db.js";
import { TASK_STATE_DOING } from "../../constants/constants.js";

const Task = database.define("task", {
    name:{
        type:DataTypes.STRING,
        // unique:true,
        allowNull:false
    },
    startDate:{
        type: DataTypes.DATE,
        allowNull:false
    },
    dueDate:{
        type: DataTypes.DATE,
        allowNull:false
    },
    isVerified:{
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    totalHours:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    state:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:TASK_STATE_DOING,
    }

}, { timestamps: true });



export default Task