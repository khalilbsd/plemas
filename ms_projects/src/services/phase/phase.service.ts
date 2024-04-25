import logger from "log/config";
import { IPhase, TPhase } from "../../models/Phases/IPhase.interface";
import Phase from "../../models/Phases/Phase.model";

export const getPhases = async (): Promise<TPhase[]> => {
  try {
    const attributes = { _id: 0, name: 1, abbreviation: 1 };
    return await Phase.find({}, attributes);
  } catch (error) {
    logger.error(error);
    return [];
  }
};

export const createPhase = async (phase: IPhase): Promise<IPhase | null> => {

  ///check if phase doesn't exist
  try {
    const isPhaseExists = await Phase.exists({ name: phase.name });
    if (isPhaseExists) return null;
    if (!phase.abbreviation) phase.abbreviation = phase.name[0]; //first letter
    const newPhase = await Phase.create(phase);
    return newPhase;
  } catch (error) {
    logger.error(error);
      return null
  }
};

export const getPhaseByName = async (name: String)   =>   {
  const phase = await Phase.findOne({ name });
  return phase;
};
