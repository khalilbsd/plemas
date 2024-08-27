import logger from "log/config";
import { IPhase, TPhase } from "../../models/Phases/IPhase.interface";
import Phase from "../../models/Phases/Phase.model";
import { Types } from "mongoose";

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

    //default
    if (phase.default) await Phase.updateMany({}, { $set: { default: false } });
    const newPhase = await Phase.create(phase);
    return newPhase;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

export const getPhaseByName = async (name: String): Promise<IPhase | null> =>
  await Phase.findOne({ name }).exec();

export const getPhaseById = async (_id: Types.ObjectId): Promise<IPhase | null> =>
  await Phase.findById(_id);



export const isPhaseExistsByID = async (_id: Types.ObjectId): Promise<{_id:Types.ObjectId} | null> =>{
if (!_id) return null
  return await Phase.exists({_id});
}



