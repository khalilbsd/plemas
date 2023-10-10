import { catchAsync } from "../../Utils/catchAsync.js";
import ProjectPhase from "../../models/project/ProjectPhase.model.js";
import Phase from "../../models/project/Phase.model.js";
import logger from "../../log/config.js";
import { PROJECT_PHASE_STATUS_IN_PROGRESS } from "../../constants/constants.js";
import { Project } from "../../db/relations.js";
import { generateProjectCustomID } from "./lib.js";


export const createProjectPhase = async (
  project,
  phase,
  status = PROJECT_PHASE_STATUS_IN_PROGRESS
) => {
  if (!project || !phase)
    return { created: false, message: "project and phase are mandatory" };
  try {
    // find phase !
    const phaseQuery = {};
    if (phase.length === 1) {
      phaseQuery.abbreviation = phase;
    } else {
      phaseQuery.name = phase;
    }

    const phaseObject = await Phase.findOne({ where: phaseQuery });
    if (!phaseObject)
      return {
        created: false,
        message: "phase is not known",
        projectPhase: undefined
      };
    //   const isProjectInPhase = await ProjectPhase.findOne({where:{
    console.log(phaseObject.id);
      // TODO::check if there is a custom id sent in the request :
      // if (!project.customID) {

      // }
      const customID= generateProjectCustomID(project.code,project.name,phaseObject.abbreviation)
    //generating customId


    const newProject = await Project.create({ ...project,customId:customID });
    const newPhase = await ProjectPhase.create({
      activePhase: true,
      phaseID:phaseObject.id,
      projectID: newProject.id, // Use the ID of the newly created project
      status
    });



      return { created: true, newPhase, message: "created successfully" };
  } catch (error) {
    logger.error(error);
    return { created: false, message: error, projectPhase: undefined };
  }
};



// export const changeProjectPhase = async (project,phase)=>{

// }
