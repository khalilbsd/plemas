import { ProjectLots } from "../../db/relations";



export const createProjectLot = async (projectID,lotID)=>{
    if (!projectID || lotID) return {created:false,projectLot:false,message:"project id and lot id are mandatory"}
    try {
        const isProjectLotExists = await ProjectLots.findByPk(projectID,lotID)
        if (isProjectLotExists) return {created:false,projectLot:false,message:"this project already have this lot assigned to "}
        const projectLot= await ProjectLots.create(projectID,lotID)
        return {created:true,projectLot,message:`lot ${lotID} have assigned to the project ${projectID}`}

    } catch (error) {
        logger.error(error);
        return { created: false, message: error, projectPhase: undefined };
    }

}