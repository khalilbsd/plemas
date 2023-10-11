import { PROJECT_PHASE_STATUS_IN_PROGRESS } from "../../constants/constants.js";
import sequelize from "../../db/db.js";
import { Project } from "../../db/relations.js";
import logger from "../../log/config.js";
import Phase from "../../models/project/Phase.model.js";
import ProjectPhase from "../../models/project/ProjectPhase.model.js";
import { generateProjectCustomID } from "./lib.js";
import { createProjectLot } from "./projectLot.controller.js";
// import { createProjectLot } from "./projectLots.controller.js";

export const createProjectPhase = async (
  project,
  phase,
  lot,
  status = PROJECT_PHASE_STATUS_IN_PROGRESS
) => {
  if (!project || !phase )
    return { created: false, message: "project and phase are mandatory" };
  const t = await sequelize.transaction(); // Start a transaction

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
        projectPhase: undefined,
        projectLots: undefined
      };
    //   const isProjectInPhase = await ProjectPhase.findOne({where:{

    // TODO::check if there is a custom id sent in the request :
    // if (!project.customID) {

    // }
    const customID = generateProjectCustomID(
      project.code,
      project.name,
      phaseObject.abbreviation
    );
    //generating customId

    const newProject = await Project.create(
      { ...project, customId: customID },
      { transaction: t }
    );

    //create lot
    const pL =await  createProjectLot(newProject.id, lot, t);
    //create phase
      console.log("RETURNED PL",pL);
    if (!pL.created) {
      await t.rollback();
      return {
        created: false,
        message: pL.message,
        projectPhase: undefined,
        projectLots: undefined
      };
    }
    const newPhase = await ProjectPhase.create(
      {
        activePhase: true,
        phaseID: phaseObject.id,
        projectID: newProject.id, // Use the ID of the newly created project
        status
      },
      { transaction: t }
    );

    if (!newPhase) {
      await t.rollback();
      return {
        created: false,
        message: pL.message,
        projectPhase: undefined,
        projectLots: undefined
      };
    }
    await t.commit(); // Commit the transaction since everything succeeded
    return { created: true, newPhase, message: "created successfully" };
  } catch (error) {
    logger.error(error);
    await t.rollback();
    return {
      created: false,
      message: error,
      projectPhase: undefined,
      projectLots: undefined
    };
  }
};

// export const changeProjectPhase = async (project,phase)=>{

// }
