import { DataTypes } from 'sequelize'
import database from '../../db/db.js'


const Lot = database.define("lots",{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    }
}, { timestamps: true })

export default Lot