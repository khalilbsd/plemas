import { Lot, ProjectLots } from "../../db/relations.js";
import logger from "../../log/config.js";
import { isLotsValid } from "./lot.controller.js";

export const createProjectLot = async (projectID, lots) => {
  if (!projectID || !lots)
    return {
      created: false,
      projectLot: false,
      message: "project id and lot id are mandatory"
    };

  try {
    var projectLots = [];

    const isAllLotsValid = await isLotsValid(lots);

    if (!isAllLotsValid) {
      return {
        created: false,
        projectLot: false,
        message: "lot doesn't exist"
      };
    }

    isAllLotsValid.every(async (lotID) => {
      const isProjectLotExists = await ProjectLots.findOne({
        where: {
          projectID,
          lotID
        }
      });
      if (isProjectLotExists)
        return {
          created: false,
          projectLots: false,
          message: "this project already have this lot assigned to "
        };

      const lot = await ProjectLots.create(
        { projectID, lotID }
        // { transaction: transaction }
      );
      projectLots.push(lot);
    });

    return {
      created: true,
      projectLots,
      message: `lots have assigned to the project ${projectID}`
    };
  } catch (error) {
    logger.error(error);
    return { created: false, message: error, projectPhase: undefined };
  }
};

const isLotsExist = async (lots) => {
  return isLotsValid(lots);
};
