import { DataTypes } from 'sequelize'
import database from '../../db/db.js'
import { PROJECT_PHASE_STATUS_IN_PROGRESS } from '../../constants/constants.js'
import Project from './Project.model.js'
import phase from './Phase.model.js'



const ProjectPhase = database.define(
    "projectPhase",{
        status:{
            type:DataTypes.STRING,
            allowNull:false,
            defaultValue:PROJECT_PHASE_STATUS_IN_PROGRESS
        },
        activePhase:{
            type:DataTypes.STRING,
            allowNull:false,
            defaultValue:true
        },

        //references keys

    },{timestamps:true}
)

export default ProjectPhase