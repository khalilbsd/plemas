import { DataTypes } from "sequelize";
import database from "../../db/db.js";

const Intervenant = database.define("intervenant", {
    nbHours:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
    }
}, { timestamps: true });



export default Intervenant