import { catchAsync } from "../../Utils/catchAsync.js";
import ProjectPhase from "../../models/project/ProjectPhase.model.js";
import logger from "../../log/config.js";
import { PROJECT_PHASE_STATUS_IN_PROGRESS } from "../../constants/constants.js";

export const createProjectPhase = async (
  projectID,
  phaseID,
  status = PROJECT_PHASE_STATUS_IN_PROGRESS
) => {
  if (!projectID || !phaseID)
    return { created: false, message: "project id and phase id are mandatory" };
  try {
    console.log(projectID,phaseID);
    const isProjectInPhase = await ProjectPhase.findByPk({
      projectID,
      phaseID
    });
    if (isProjectInPhase)
      return {
        created: false,
        message: "project has already passed by this phase",
        projectPhase: undefined
      };
    const projectPhase = await ProjectPhase.create({
      projectID,
      phaseID,
      status
    });
    return { created: true, projectPhase, message: "created successfully" };
  } catch (error) {
    logger.error(error);
    return { created: false, message: error, projectPhase: undefined };
  }
};
