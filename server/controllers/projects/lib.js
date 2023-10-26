import { Phase, Project } from "../../db/relations.js";
import logger from "../../log/config.js";

/*
 *  a function to generate a default custom id it accepts
 *  project code
 *  project name
 *  abbreviation
 * @returns a string : projectCodeAbbreviation_projectName
 */
export const generateProjectCustomID = (
  projectCode,
  projectName,
  abbreviation
) => {
  return `${projectCode}${abbreviation.toUpperCase()}_${projectName}`;
};

/*
 * a function to determine if project code is a valid of not : means if it exist or not in the database
 *
 * @returns true / false
 */
export const isCodeValid = async (code, phaseName) => {
  try {
    const phase = await Phase.findOne({ where: { name: phaseName },attributes:['id'] });
    const project = await Project.findOne({ where: { code,phaseID:phase.id } });

    if (project) return false;
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};
/*
 * a function to return the  greatest ids in the table projects
 */
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

/*
 * a function that verify if a project  contains a phase
 *  projectPhases : array of phases
 *  phase : phase
 * @returns  index
 */
export const getProjectPhaseFromOldPhases = async (projectPhases, phase) => {
  try {
    if (!projectPhases.length) return -1;

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
/*
 * a function that returns a project that have a customID
 * @param {*} customID
 * @returns the project
 */
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

/*
 * a functon that returns w list of name of lots
 * @param {*} lots : list of lots objects
 * @returns list lots names
 */

function getProjectLots(lots) {
  const lotList = [];

  lots.forEach((item) => {
    lotList.push(item.lot.name);
  });
  return lotList;
}

/*
 * a function that will serialize a list of the projects : mainly used in the get all projects api
 * @param {*} projects : array of objects
 * @returns array of objects with reduced info
 */

export const serializeProject = (projects) => {
  const list = [];
  projects.forEach((element) => {
    console.log(element.managerDetails);
    list.push({
      id: element.id,
      code: element.code,
      activePhase: element.phase.name,
      manager: {
        image: element.managerDetails.UserProfile.image,
        fullName: `${element.managerDetails.UserProfile.name} ${element.managerDetails.UserProfile.lastName}`
      },
      projectName: element.name,
      projectCustomId: element.customId,
      tasks: "in progress",
      phaseStatus: "tasks in progress",
      lots: getProjectLots(element.projectLots),
      priority: element.priority
    });
  });

  return list;
};
