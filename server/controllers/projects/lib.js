import { Project, ProjectPhase } from "../../db/relations.js";
import logger from "../../log/config.js";

export const generateProjectCustomID = (
  projectCode,
  projectName,
  abbreviation
) => {
  return `${projectCode}${abbreviation.toUpperCase()}_${projectName}`;
};

export const isCodeValid = async (code) => {
  try {
    const project = await Project.findOne({ where: { code } });
    if (project) return false;
    return true;
  } catch (error) {
    logger.error(error);
    return;
  }
};

export const getLatestProjectId = async () => {
  try {
    const id = await Project.max("id");
    if (id) return id;
    return 0;
  } catch (error) {
    logger.error(error);
    return undefined;
  }
};

export const getProjectPhaseFromOldPhases = async (projectPhases, phase) => {
  try {
    if (!projectPhases.length) return null;
    let idx;
    // const pp = projectPhases.filter(
    //   (projectPhase) => projectPhase.phaseID == phase.id
    // );
    const pp = projectPhases.findIndex(
      (projectPhase) => projectPhase.phaseID == phase.id
    );

    if (pp < 0) return -1;

    return pp;
  } catch (error) {
    console.log(error);
    return -1;
  }
};

export const getProjectByCustomID = async (customID) => {
  try {
    const project = await Project.findOne({ where: { customId: customID } });
    if (!project) return null;
    return project;
  } catch (error) {
    logger.error(error);
    return null;
  }
};
